import CloseIcon from "@/assets/svgs/close.svg?react";
import QuestionIcon from "@/assets/svgs/whiteboard/question.svg?react";
import isQuestionLogOpenState from "@/stores/stateIsQuestionLogOpen";
import { useRecoilState } from "recoil";

const QuestionLogButton = ({ className }: { className?: string }) => {
  const [isQuestionLogOpen, setIsQuestionLogOpen] = useRecoilState(isQuestionLogOpenState);

  return (
    <button
      type="button"
      className={`${className} w-12 h-12 flex justify-center items-center rounded-xl mb-3 ${
        isQuestionLogOpen ? "transparent" : "bg-grayscale-lightgray  shadow-md"
      }`}
      aria-label="질문 리스트"
      aria-pressed={isQuestionLogOpen}
      onClick={() => {
        setIsQuestionLogOpen(!isQuestionLogOpen);
      }}
    >
      <span className={`semibold-20 + ${isQuestionLogOpen ? "text-white" : "text-grayscale-black"}`}>
        {isQuestionLogOpen ? <CloseIcon /> : <QuestionIcon fill="black" />}
      </span>
    </button>
  );
};
export default QuestionLogButton;
