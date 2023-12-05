import SendMessage from "@/assets/svgs/sendMessage.svg?react";
import participantSocketRefState from "@/stores/stateParticipantSocketRef";

import { ChangeEvent, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { useLocation } from "react-router-dom";

interface LogItemInterface {
  key?: string;
  title: string;
  contents: string;
}

const LogItem = ({ key, title, contents }: LogItemInterface) => {
  return (
    <li
      key={key}
      className="h-21 p-4 border mt-4 first-of-type:mt-0 bg-grayscale-white border-grayscale-lightgray rounded-lg"
    >
      <p className="semibold-16">{title}</p>
      <p className="mt-2 medium-12 text-grayscale-darkgray">{contents}</p>
    </li>
  );
};

interface LogContainerInterface {
  type: "question" | "prompt";
  className: string;
}

const LogContainer = ({ type, className }: LogContainerInterface) => {
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
  const [questionList, setQuestionList] = useState<Array<{ title: string; contents: string }>>([]);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const socket = useRecoilValue(participantSocketRefState);
  const roomid = new URLSearchParams(useLocation().search).get("roomid") || "999999";

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const inputValue = target.value;
    setIsInputEmpty(inputValue.replace(/\n|\s/g, "").length === 0);
  };

  const handleSendButtonClicked = () => {
    if (!messageInputRef.current) return;
    const inputRef = messageInputRef.current;
    const messageContents = inputRef.value;
    if (!messageContents || !socket) return;
    // 추후 사용자의 닉네임을 가져와야한다.
    // 추후 질문의 내용을 발표자에게 전송해야한다.
    setQuestionList([...questionList, { title: "닉네임", contents: messageContents }]);

    socket.emit("ask", {
      type: "question",
      roomId: roomid,
      content: messageContents
    });

    inputRef.value = "";
  };

  return (
    <section
      className={`flex flex-col ${className} w-72 h-[calc(100vh-12rem)] bg-grayscale-white border border-grayscale-lightgray rounded-xl`}
    >
      <h2 className="mt-2 h-14 semibold-18 leading-10 p-4	flex items-center">
        {type === "question" ? "질문하기" : "강의 프롬프트"}
      </h2>
      <ul className="px-4 flex-grow overflow-y-auto	">
        {questionList.map(({ title, contents }, index) => {
          return <LogItem key={`${index}`} title={title} contents={contents} />;
        })}
      </ul>
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
            onChange={(event) => {
              handleInputChange(event);
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
