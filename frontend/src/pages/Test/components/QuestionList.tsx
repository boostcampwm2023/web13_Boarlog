import AddIcon from "@/assets/svgs/whiteboard/add.svg?react";

import { useRef } from "react";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";

import activeToolState from "./stateActiveTool";
import questionListState from "./stateQuestionList";
import clickedQuestionContentsState from "./stateClickedQuestionContents";

const COLOR_SET = [
  { background: "bg-memo-red", border: "border-memo-border-red" },
  { background: "bg-memo-yellow", border: "border-memo-border-yellow" },
  { background: "bg-memo-forsythia", border: "border-memo-border-forsythia" },
  { background: "bg-memo-lightgreen", border: "border-memo-border-lightgreen" },
  { background: "bg-memo-blue", border: "border-memo-border-blue" }
];

const getColorSetByIndex = (index: number) => {
  const randomIndex = index % COLOR_SET.length;

  return COLOR_SET[randomIndex].background + " " + COLOR_SET[randomIndex].border;
};

const QuestionList = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const questions = useRecoilValue(questionListState);
  const setActiveTool = useSetRecoilState(activeToolState);
  const setQuestionContents = useSetRecoilState(clickedQuestionContentsState);

  const handleAddButtonClicked = (index: number) => {
    if (!listRef.current) return;
    const questionContents = listRef.current.children[index].textContent;
    if (questionContents) setQuestionContents(questionContents);
    setActiveTool("stickyNote");
  };

  return (
    <section className="w-60 h-[41rem] border border-default rounded-xl absolute top-2.5 left-20 mb-6 bg-grayscale-white">
      <h2 className="semibold-18 inline-block mt-1 p-4">질문 리스트</h2>
      <div className="h-[36rem] px-4 overflow-scroll">
        <ul ref={listRef}>
          {questions.map((question, index) => (
            <li className={`p-4 h-fit mb-4 min-h-[6.25rem] ${getColorSetByIndex(index)} relative`} key={index}>
              <div className="flex justify-center items-center h-[100%] w-[100%] bg-black/30 absolute top-0 left-0 opacity-0 hover:opacity-100">
                <button
                  type="button"
                  className="flex justify-center items-center w-10 h-10 rounded-xl bg-grayscale-white border border-grayscale-lightgray"
                  aria-label="질문 화이트보드에 추가하기"
                  onClick={() => {
                    handleAddButtonClicked(index);
                  }}
                >
                  <AddIcon />
                </button>
              </div>
              {question}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default QuestionList;
