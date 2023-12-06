import SendMessage from "@/assets/svgs/sendMessage.svg?react";
import participantSocketRefState from "@/stores/stateParticipantSocketRef";

import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { useLocation } from "react-router-dom";
import axios from "axios";

interface LogItemInterface {
  key?: string;
  title: string;
  contents: string;
}

interface LogContainerInterface {
  type: "question" | "prompt";
  className: string;
}

const LogItem = ({ title, contents }: LogItemInterface) => {
  return (
    <li className="h-21 p-4 border mt-4 first-of-type:mt-0 bg-grayscale-white border-grayscale-lightgray rounded-lg">
      <p className="semibold-16">{title}</p>
      <p className="mt-2 medium-12 text-grayscale-darkgray">{contents}</p>
    </li>
  );
};

function convertMsToTimeString(ms: string) {
  let msNumber = parseInt(ms);
  let seconds = Math.floor(msNumber / 1000);
  let hours = Math.floor(seconds / 3600);
  seconds = seconds % 3600;

  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

const LogContainer = ({ type, className }: LogContainerInterface) => {
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
  const [questionList, setQuestionList] = useState<Array<{ title: string; contents: string }>>([]);
  const [scriptList, setScriptList] = useState<Array<{ start: string; text: string }>>([]);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const socket = useRecoilValue(participantSocketRefState);
  const roomid = new URLSearchParams(useLocation().search).get("roomid") || "999999";

  useEffect(() => {
    axios("./reviewLecture.json")
      .then(({ data }) => {
        console.log(data);
        // @ts-ignore
        setScriptList(data);
      })
      .catch((error) => {
        console.log("프롬프트에 표시할 스크립트 로딩 실패", error);
      });
  }, []);

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

    socket.emit("ask", {
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
      className={`flex flex-col ${className} w-72 h-[calc(100vh-12rem)] pb-4 bg-grayscale-white border border-grayscale-lightgray rounded-xl`}
    >
      <h2 className="mt-2 h-14 semibold-18 leading-10 p-4	flex items-center">
        {type === "question" ? "질문하기" : "강의 프롬프트"}
      </h2>
      {type === "question" && (
        <ul className="px-4 flex-grow overflow-y-auto	">
          {questionList.map(({ title, contents }, index) => {
            return <LogItem key={`k-${index}`} title={title} contents={contents} />;
          })}
        </ul>
      )}
      {type === "prompt" && (
        <ul className="px-4 flex-grow overflow-y-auto	">
          {scriptList.map(({ start, text }, index) => {
            return <LogItem key={`k-${index}`} title={convertMsToTimeString(start)} contents={text} />;
          })}
        </ul>
      )}
      {type === "question" && (
        <div className="flex justify-between p-4">
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
            onKeyDown={(event) => {
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
