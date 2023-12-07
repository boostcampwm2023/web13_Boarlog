import QuestionIcon from "@/assets/svgs/whiteboard/question.svg?react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import isQuestionListOpenState from "./stateIsQuestionListOpen";
import activeToolState from "./stateActiveTool";
import { questionCountState } from "./stateQuestionList";
import { useEffect, useState } from "react";

const IndicatorBubble = ({ count }: { count: number }) => {
  return (
    <>
      <div className="animate-ping absolute -top-2 -right-2 rounded-xl w-5 h-5 z-10  bg-alert-100"></div>
      <div className="absolute -top-2 -right-2 flex justify-center items-center rounded-xl w-5 h-5  bg-alert-100 medium-12 text-grayscale-white">
        {count}
      </div>
    </>
  );
};

const QuestionButton = () => {
  const [isQuestionListOpen, setIsQuestionListOpen] = useRecoilState(isQuestionListOpenState);
  const setActiveTool = useSetRecoilState(activeToolState);
  const QuestionCount = useRecoilValue(questionCountState);
  const [prevQuestionCount, setPrevQuestionCount] = useState<number>(0);
  const [newQuestionCount, setNewQuestionCount] = useState<number>(0);

  // 후에 실시간으로 들어오는 질문의 수를 카운팅 하도록 구현 해야함.

  useEffect(() => {
    setNewQuestionCount(QuestionCount - prevQuestionCount);
  }, [QuestionCount]);

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
        setPrevQuestionCount(prevQuestionCount + newQuestionCount);
        setNewQuestionCount(0);
      }}
    >
      {newQuestionCount !== 0 && <IndicatorBubble count={newQuestionCount} />}

      <QuestionIcon className={isQuestionListOpen ? "fill-white" : "fill-grayscale-black"} />
    </button>
  );
};

export default QuestionButton;
