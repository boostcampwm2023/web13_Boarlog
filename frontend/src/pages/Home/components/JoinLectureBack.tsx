import Button from "@/components/Button/Button";
import SmallButton from "@/components/SmallButton/SmallButton";
import CloseIcon from "@/assets/svgs/close.svg?react";
import EnterIcon from "@/assets/svgs/enter.svg?react";
import SearchIcon from "@/assets/svgs/search.svg?react";
import LectureCodeInput from "./LectureCodeInput";
import { useToast } from "@/components/Toast/useToast";

interface JoinLectureBackProps {
  handleJoinLectureFalse: () => void;
  isLectureSearchClicked: boolean;
  handleLectureSearchClickedTrue: () => void;
  codeInputs: string[];
  setCodeInputs: React.Dispatch<React.SetStateAction<string[]>>;
}

const JoinLectureBack = ({
  handleJoinLectureFalse,
  isLectureSearchClicked,
  handleLectureSearchClickedTrue,
  codeInputs,
  setCodeInputs
}: JoinLectureBackProps) => {
  const showToast = useToast();

  const handleSearchButtonClicked = () => {
    if (codeInputs.join("").length !== 6) showToast({ message: "강의 코드를 올바르게 입력해주세요.", type: "alert" });
    else handleLectureSearchClickedTrue();
  };

  return (
    <div className="w-full h-full flex flex-col absolute bg-grayscale-white overflow-hidden border-default rounded-xl rotate-180 z-[1] shadow-xl">
      <div className="w-full h-full flex flex-col p-6 gap-6">
        <div className="flex flex-row justify-between">
          <h3 className="semibold-32 break-keep">강의 참여하기</h3>
          <SmallButton onClick={handleJoinLectureFalse}>
            <CloseIcon className="w-6 h-6" />
          </SmallButton>
        </div>

        {isLectureSearchClicked ? (
          <>
            <div className="flex flex-col gap-1">
              <h4 className="semibold-18 break-keep">강의 코드</h4>
              <p className="medium-32 text-boarlog-100 break-keep">{codeInputs.join("")}</p>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="semibold-18 break-keep">강의 제목</h4>
              <p className="medium-16 text-grayscale-darkgray break-keep">여기에 강의 제목이 표시됩니다.</p>
            </div>

            <div className="flex flex-col flex-grow gap-2">
              <h4 className="semibold-18 break-keep">강의 설명</h4>
              <p className="medium-16 flex-grow text-grayscale-darkgray break-keep">여기에 강의 설명이 표시됩니다.</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2 flex-grow">
            <h4 className="semibold-18 break-keep">강의 코드</h4>
            <p className="medium-12 text-grayscale-darkgray break-keep">
              강의 진행자에게 전달받은 강의 코드 6자리를 입력해주세요.
            </p>
            <LectureCodeInput inputs={codeInputs} setInputs={setCodeInputs} keyPress={handleSearchButtonClicked} />
          </div>
        )}

        <Button type="full" buttonStyle={isLectureSearchClicked ? "blue" : "black"} onClick={handleSearchButtonClicked}>
          {isLectureSearchClicked ? (
            <>
              <EnterIcon className="fill-grayscale-white" />
              강의 참여하기
            </>
          ) : (
            <>
              <SearchIcon className="fill-grayscale-white" />
              강의 조회하기
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default JoinLectureBack;
