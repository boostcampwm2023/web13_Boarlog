import QuestionIcon from "@/assets/svgs/whiteboard/question.svg?react";
import { useState } from "react";
import { ToolType } from "./Toolbar";

interface QuestionButtonProps {
  setTool: React.Dispatch<React.SetStateAction<ToolType>>;
}

const QuestionButton = ({ setTool }: QuestionButtonProps) => {
  const [isQuestionListOpen, setIsQuestionListOpen] = useState<boolean>(false);

  return (
    <button
      type="button"
      className={`w-12 h-12  shadow-md flex justify-center items-center rounded-xl mb-3 ${
        isQuestionListOpen ? "bg-boarlog-80" : "bg-grayscale-lightgray"
      }`}
      aria-label="질문 리스트"
      aria-pressed={isQuestionListOpen}
      onClick={() => {
        if (!isQuestionListOpen) setTool("select");
        setIsQuestionListOpen(!isQuestionListOpen);
      }}
    >
      <QuestionIcon className={isQuestionListOpen ? "fill-white" : "fill-grayscale-black"} />
    </button>
  );
};

export default QuestionButton;
