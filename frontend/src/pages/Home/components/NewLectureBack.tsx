import Button from "@/components/Button/Button";
import SmallButton from "@/components/SmallButton/SmallButton";
import CloseIcon from "@/assets/svgs/close.svg?react";
import NewLectureIcon from "@/assets/svgs/newLecture.svg?react";

interface NewLectureBackProps {
  handleNewLectureFalse: () => void;
}

const NewLectureBack = ({ handleNewLectureFalse }: NewLectureBackProps) => {
  return (
    <div className="w-full h-full flex flex-col absolute bg-grayscale-white overflow-hidden border-default rounded-xl rotate-180 z-[1] shadow-xl">
      <div className="w-full h-full flex flex-col p-6 gap-6">
        <div className="flex flex-row justify-between">
          <h3 className="semibold-32 break-keep">새로운 강의 생성하기</h3>
          <SmallButton onClick={handleNewLectureFalse}>
            <CloseIcon className="w-6 h-6" />
          </SmallButton>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="semibold-18 break-keep">강의 제목</h4>
          <p className="medium-12 text-grayscale-darkgray break-keep">강의를 잘 드러낼 수 있는 제목을 작성해 주세요.</p>
          <input
            type="text"
            className="rounded-xl border-black w-full flex-grow medium-12 p-3 focus:outline-none focus:ring-1 focus:ring-boarlog-100 focus:border-transparent"
            placeholder="강의 제목을 입력해주세요"
            maxLength={50}
          />
        </div>

        <div className="flex flex-col gap-2 flex-grow">
          <h4 className="semibold-18 break-keep">강의 설명</h4>
          <p className="medium-12 text-grayscale-darkgray break-keep">강의에 대한 설명을 간략하게 작성해주세요.</p>
          <textarea
            className="rounded-xl border-black w-full flex-grow medium-12 p-3 resize-none focus:outline-none focus:ring-1 focus:ring-boarlog-100 focus:border-transparent"
            placeholder="강의 설명을 입력해주세요"
            maxLength={200}
          />
        </div>

        <Button type="full" buttonStyle="blue">
          <NewLectureIcon className="fill-grayscale-white" />
          강의 생성하기
        </Button>
      </div>
    </div>
  );
};

export default NewLectureBack;
