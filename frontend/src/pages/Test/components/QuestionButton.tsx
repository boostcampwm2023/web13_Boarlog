import QuestionIcon from "@/assets/svgs/whiteboard/question.svg?react";
import { useRecoilState, useSetRecoilState } from "recoil";
import isQuestionListOpenState from "./stateIsQuestionListOpen";
import activeToolState from "./stateActiveTool";

const IndicatorBubble = ({ count }: { count: number }) => {
  return (
    <div className="absolute -top-2 -right-2 flex justify-center items-center rounded-xl w-5 h-5  bg-alert-100 medium-12 text-grayscale-white">
      {count}
    </div>
  );
};

const QuestionButton = () => {
  const [isQuestionListOpen, setIsQuestionListOpen] = useRecoilState(isQuestionListOpenState);
  const setActiveTool = useSetRecoilState(activeToolState);
  // 후에 실시간으로 들어오는 질문의 수를 카운팅 하도록 구현 해야함.
  let newQuestionCount = 10;

  return (
    <button
      type="button"
      className={`relative w-12 h-12  shadow-md flex justify-center items-center rounded-xl mb-3 ${
        isQuestionListOpen ? "bg-boarlog-80" : "bg-grayscale-lightgray"
      }`}
      aria-label="질문 리스트"
      aria-pressed={isQuestionListOpen}
      onClick={() => {
        if (!isQuestionListOpen) setActiveTool("select");
        setIsQuestionListOpen(!isQuestionListOpen);
      }}
    >
      {newQuestionCount !== 0 && <IndicatorBubble count={newQuestionCount} />}

      <QuestionIcon className={isQuestionListOpen ? "fill-white" : "fill-grayscale-black"} />
    </button>
  );
};

export default QuestionButton;
