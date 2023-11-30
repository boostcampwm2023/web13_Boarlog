import AddIcon from "@/assets/svgs/whiteboard/add.svg?react";

import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

import activeToolState from "./stateActiveTool";
import questionCountState from "./stateQuestionCount";
import clickedQuestionContentsState from "./stateClickedQuestionContents";

const QUESTIONS_URL = "/dummyQuestionData.json";

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
  const [questions, setQuestions] = useState<{ content: string }[]>([]);
  const setActiveTool = useSetRecoilState(activeToolState);
  const setQuestionCount = useSetRecoilState(questionCountState);
  const setQuestionContents = useSetRecoilState(clickedQuestionContentsState);

  const handleAddButtonClicked = (index: number) => {
    if (!listRef.current) return;
    const questionContents = listRef.current.children[index].textContent;
    if (questionContents) setQuestionContents(questionContents);
    setActiveTool("stickyNote");
  };

  // 이후에 소켓통신으로? 새로운 질문이 발생함을 처리한다면 이벤트를 감지할 때마다 재실행할 필요가 있습니다.
  const getQuestionsFromServer = async (url: string) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("서버에서 데이터를 불러오는데 문제가 발생했습니다.");
      }

      const data = await response.json();

      setQuestions(data);
      setQuestionCount(data.length);
    } catch (error) {
      console.log("질문 리스트 데이터를 가져오는데 실패했습니다: ", error);
    }
  };

  useEffect(() => {
    getQuestionsFromServer(QUESTIONS_URL);
  }, []);

  return (
    <section className="w-60 h-[80vh] border border-default rounded-xl absolute top-2.5 left-20 mb-6 bg-grayscale-white">
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
              {question.content}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default QuestionList;
