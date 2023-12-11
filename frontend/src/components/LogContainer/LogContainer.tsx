import SendMessage from "@/assets/svgs/sendMessage.svg?react";
import participantSocketRefState from "@/stores/stateParticipantSocketRef";

import { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useLocation } from "react-router-dom";
import { convertMsToTimeString } from "@/utils/convertMsToTimeString";
import axios from "axios";
import progressMsTimeState from "@/stores/stateProgressMsTime";
import convertTimeStringToMS from "@/utils/converTimeStringToMS";

interface LogItemInterface {
  key?: string;
  title: string;
  contents: string;
  className?: string;
  onClick?: any;
  style?: CSSProperties;
}

interface LogContainerInterface {
  type: "question" | "prompt";
  className: string;
  updateProgressMsTime: (time: number) => void;
}

const LogItem = ({ title, contents, className, onClick, style }: LogItemInterface) => {
  return (
    <li
      className={`${className} h-21 p-4 border mt-4 mb-2 first-of-type:mt-0 bg-grayscale-white border-grayscale-lightgray rounded-lg`}
      style={style}
      onClick={onClick}
    >
      <p className="semibold-16">{title}</p>
      <p className="mt-2 medium-12 text-grayscale-darkgray">{contents}</p>
    </li>
  );
};

const LogContainer = ({ type, className, updateProgressMsTime }: LogContainerInterface) => {
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
  const [questionList, setQuestionList] = useState<Array<{ title: string; contents: string }>>([]);
  const [scriptList, setScriptList] = useState<Array<{ start: string; text: string }>>([]);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const logContainerRef = useRef<HTMLUListElement | null>(null);
  const [progressMsTime, setProgressMsTime] = useRecoilState(progressMsTimeState);
  const socket = useRecoilValue(participantSocketRefState);
  const [hilightedItemIndex, setHilightedItemIndex] = useState(0);

  const roomid = new URLSearchParams(useLocation().search).get("roomid") || "999999";

  if (type === "prompt") {
    useEffect(() => {
      axios("./reviewLecture.json")
        .then(({ data }) => {
          setScriptList(data);
        })
        .catch((error) => {
          console.log("프롬프트에 표시할 스크립트 로딩 실패", error);
        });
    }, []);

    useLayoutEffect(() => {
      let currentIndexOfPrompt =
        scriptList.findIndex((value) => {
          const startTime = Math.floor(+value.start / 1000) * 1000;

          return startTime > progressMsTime;
        }) - 1;
      const lastStartTime = +scriptList[scriptList.length - 1]?.start;
      if (Math.floor(lastStartTime / 1000) * 1000 <= progressMsTime) {
        currentIndexOfPrompt = scriptList.length - 1;
      } else if (currentIndexOfPrompt < 0) setHilightedItemIndex(0);
      setHilightedItemIndex(currentIndexOfPrompt);
    }, [progressMsTime]);
  } else {
    useEffect(() => {
      if (!logContainerRef.current) return;
      logContainerRef.current.scrollTop = logContainerRef.current?.scrollHeight;
    }, [questionList]);
  }

  const handleInputChange = () => {
    if (!messageInputRef.current) return;
    const inputValue = messageInputRef.current.value;
    setIsInputEmpty(inputValue.replace(/\n|\s/g, "").length === 0);
  };

  const handleInputEnter = ({ key }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === "Enter") {
      if (messageInputRef.current?.value.replace(/\n|\s/g, "").length === 0) return;

      sendMessage();
    }
  };

  const sendMessage = () => {
    if (!messageInputRef.current) return;
    const inputRef = messageInputRef.current;
    const messageContents = inputRef.value;
    if (!messageContents || !socket) return;
    // 추후 사용자의 닉네임을 가져와야한다.
    setQuestionList([...questionList, { title: "닉네임", contents: messageContents }]);

    socket?.emit("ask", {
      type: "question",
      roomId: roomid,
      content: messageContents
    });

    inputRef.value = "";
    setIsInputEmpty(inputRef.value.replace(/\n|\s/g, "").length === 0);
  };

  const handleSendButtonClicked = () => {
    sendMessage();
  };

  return (
    <section
      className={`flex flex-col pb-4 ${className} w-72 h-[calc(100vh-12rem)] bg-grayscale-white border border-grayscale-lightgray rounded-xl`}
    >
      <h2 className="mt-2 h-14 semibold-18 leading-10 p-4	flex items-center">
        {type === "question" ? "질문하기" : "강의 프롬프트"}
      </h2>
      {type === "question" && (
        <ul className="px-4 flex-grow overflow-y-auto	" ref={logContainerRef}>
          {questionList.map(({ title, contents }, index) => {
            return <LogItem key={`k-${index}`} title={title} contents={contents} />;
          })}
        </ul>
      )}
      {type === "prompt" && (
        <ul className="px-4 flex-grow overflow-y-auto	" ref={logContainerRef}>
          {scriptList.map(({ start, text }, index) => {
            return (
              <LogItem
                key={`k-${index}`}
                title={convertMsToTimeString(start)}
                contents={text}
                className={`cursor-point`}
                style={{ borderColor: hilightedItemIndex === index ? "#4f4ffb" : "#e6e6e6" }}
                onClick={(event: MouseEvent) => {
                  const currentTarget = event.currentTarget as HTMLLIElement;
                  if (!currentTarget.children[0].textContent) return;
                  convertTimeStringToMS(currentTarget.children[0].textContent);
                  setProgressMsTime(convertTimeStringToMS(currentTarget.children[0].textContent));
                  updateProgressMsTime(convertTimeStringToMS(currentTarget.children[0].textContent));
                }}
              />
            );
          })}
        </ul>
      )}
      {type === "question" && (
        <div className="flex justify-between px-4 pt-4">
          <label htmlFor="question-input" className="a11y-hidden">
            질문 입력 창
          </label>
          <input
            type="text"
            id="question-input"
            className="w-52 medium-12 border border-boarlog rounded-lg px-3 py-2"
            placeholder="질문을 입력해 주세요."
            ref={messageInputRef}
            onChange={() => {
              handleInputChange();
            }}
            onKeyUp={(event) => {
              handleInputEnter(event);
            }}
          />
          <button
            className={`flex justify-center items-center w-[2.125rem] h-[2.125rem] rounded-lg ${
              isInputEmpty ? "bg-grayscale-lightgray" : "bg-boarlog-100"
            }`}
            type="button"
            aria-label="질문 전송"
            disabled={isInputEmpty}
            onClick={() => {
              handleSendButtonClicked();
            }}
          >
            <SendMessage fill={isInputEmpty ? "black" : "white"} />
          </button>
        </div>
      )}
    </section>
  );
};

export default LogContainer;
