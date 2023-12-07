import { useState } from "react";
import Header from "@/components/Header/Header";
import MainCard from "./components/MainCard";
import NewLectureFront from "./components/NewLectureFront";
import NewLectureBack from "./components/NewLectureBack";
import JoinLectureBack from "./components/JoinLectureBack";
import JoinLectureFront from "./components/JoinLectureFront";

const Home = () => {
  const [isNewLectureClicked, setIsNewLectureClicked] = useState(false);
  const [isJoinLectureClicked, setIsJoinLectureClicked] = useState(false);
  const [isLectureSearchClicked, setIsLectureSearchClicked] = useState(false);
  const [codeInputs, setCodeInputs] = useState<string[]>(Array(6).fill(""));

  const handleNewLectureFalse = () => {
    setIsNewLectureClicked(false);
  };

  const handleNewLectureTrue = () => {
    setCodeInputs(Array(6).fill(""));
    setIsLectureSearchClicked(false);
    setIsJoinLectureClicked(false);
    setIsNewLectureClicked(true);
  };

  const handleJoinLectureFalse = () => {
    setCodeInputs(Array(6).fill(""));
    setIsLectureSearchClicked(false);
    setIsJoinLectureClicked(false);
  };

  const handleJoinLectureTrue = () => {
    setIsNewLectureClicked(false);
    setIsJoinLectureClicked(true);
  };

  const handleLectureSearchClickedTrue = () => {
    setIsLectureSearchClicked(true);
  };

  return (
    <>
      <Header type="main" />
      <section className="flex flex-col my-20 items-center justify-center">
        <h1 className="semibold-64 mb-2">시작하기</h1>
        <p className="semibold-20 text-grayscale-darkgray">볼록과 함께 실시간 강의를 경험해보세요.</p>
        <div className="flex flex-col items-center justify-center gap-8 mt-16 home:flex-row w-full">
          {Modernizr.touchevents ? (
            ""
          ) : (
            <MainCard isButtonClicked={isNewLectureClicked}>
              <NewLectureFront handleNewLectureTrue={handleNewLectureTrue} />
              <NewLectureBack handleNewLectureFalse={handleNewLectureFalse} />
            </MainCard>
          )}
          <MainCard isButtonClicked={isJoinLectureClicked}>
            <JoinLectureFront handleJoinLectureTrue={handleJoinLectureTrue} />
            <JoinLectureBack
              handleJoinLectureFalse={handleJoinLectureFalse}
              isLectureSearchClicked={isLectureSearchClicked}
              handleLectureSearchClickedTrue={handleLectureSearchClickedTrue}
              codeInputs={codeInputs}
              setCodeInputs={setCodeInputs}
            />
          </MainCard>
        </div>
      </section>
    </>
  );
};

export default Home;
