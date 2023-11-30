import QuestionIcon from "@/assets/svgs/whiteboard/question.svg?react";
import { useRecoilState, useSetRecoilState } from "recoil";
import isQuestionListOpenState from "./stateIsQuestionListOpen";
import activeToolState from "./stateActiveTool";

const QuestionButton = () => {
  const [isQuestionListOpen, setIsQuestionListOpen] = useRecoilState(isQuestionListOpenState);
  const setActiveTool = useSetRecoilState(activeToolState);
  return (
    <button
      type="button"
      className={`w-12 h-12  shadow-md flex justify-center items-center rounded-xl mb-3 ${
        isQuestionListOpen ? "bg-boarlog-80" : "bg-grayscale-lightgray"
      }`}
      aria-label="질문 리스트"
      aria-pressed={isQuestionListOpen}
      onClick={() => {
        if (!isQuestionListOpen) setActiveTool("select");
        setIsQuestionListOpen(!isQuestionListOpen);
      }}
    >
      <QuestionIcon className={isQuestionListOpen ? "fill-white" : "fill-grayscale-black"} />
    </button>
  );
};

export default QuestionButton;
