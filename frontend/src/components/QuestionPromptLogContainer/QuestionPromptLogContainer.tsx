import SendMessage from "@/assets/svgs/sendMessage.svg?react";
import { ChangeEvent, useState } from "react";

interface LogItemInterface {
  key: string;
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

const QuestionPromptLogContainer = ({ type, className }: LogContainerInterface) => {
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const inputValue = target.value;

    setIsInputEmpty(inputValue.replace(/\n|\s/g, "").length === 0);
  };

  return (
    <section
      className={`flex flex-col ${className} w-72 h-[calc(100vh-12rem)] bg-grayscale-white border border-grayscale-lightgray rounded-xl`}
    >
      <h2 className="mt-2 h-14 semibold-18 leading-10 p-4	flex items-center">
        {type === "question" ? "질문하기" : "강의 프롬프트"}
      </h2>
      <ul className="px-4 flex-grow overflow-y-auto	">
        <LogItem
          key="1"
          title="닉네임"
          contents="질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용"
        />
        <LogItem key="2" title="닉네임" contents="질문 내용" />
        <LogItem key="3" title="닉네임" contents="질문 내용" />
        <LogItem key="4" title="닉네임" contents="질문 내용" />
        <LogItem
          key="5"
          title="닉네임"
          contents="질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용질문 내용"
        />
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
          >
            <SendMessage fill={isInputEmpty ? "black" : "white"} />
          </button>
        </div>
      )}
    </section>
  );
};

export default QuestionPromptLogContainer;
