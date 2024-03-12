import AddIcon from "@/assets/svgs/whiteboard/add.svg?react";

import { useRef } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";

import activeToolState from "./stateActiveTool";
import questionListState from "./stateQuestionList";
import clickedQuestionContentsState from "./stateClickedQuestionContents";

const MEMO_COLOR = "bg-memo-yellow border-memo-border-yellow";

const QuestionList = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const questions = useRecoilValue(questionListState);
  const setActiveTool = useSetRecoilState(activeToolState);
  const setQuestionContents = useSetRecoilState(clickedQuestionContentsState);

  const handleAddButtonClicked = (index: number) => {
    if (!listRef.current) return;
    const questionContents = listRef.current.children[index].textContent;
    const dataQuestionId = (listRef.current.children[index] as HTMLLIElement).dataset.questionId;
    if (!questionContents || !dataQuestionId) return;
    if (questionContents) setQuestionContents({ content: questionContents, questionId: dataQuestionId });
    setActiveTool("stickyNote");
  };

  return (
    <section className="w-60 h-[41rem] border border-default rounded-xl absolute top-2.5 left-20 mb-6 bg-grayscale-white">
      <h2 className="semibold-18 inline-block mt-1 p-4">질문 리스트</h2>
      <div className="h-[36rem] px-4 overflow-y-auto">
        <ul ref={listRef}>
          {questions.map(({ content, questionId }, index) => (
            <li
              className={`p-4 h-fit mb-4 min-h-[6.25rem] ${MEMO_COLOR} relative`}
              key={index}
              data-question-id={questionId}
            >
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
              {content}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default QuestionList;
