import NewLectureImg from "@/assets/imgs/newLecture.png";
import Button from "@/components/Button/Button";
import NewLectureIcon from "@/assets/svgs/newLecture.svg?react";

interface NewLectureFrontProps {
  handleNewLectureTrue: () => void;
}

const NewLectureFront = ({ handleNewLectureTrue }: NewLectureFrontProps) => {
  return (
    <div className="w-full h-full flex flex-col absolute bg-grayscale-white overflow-hidden border-default rounded-xl backface-hidden z-[2] shadow-xl">
      <img src={NewLectureImg} alt="강의 시작 배너 이미지" className="w-full h-60 object-cover object-center" />
      <div className="w-full flex grow flex-col p-6 justify-between">
        <div>
          <h3 className="semibold-32 break-keep mb-1">새로운 강의 생성하기</h3>
          <p className="medium-18 text-grayscale-darkgray break-keep">
            강의 세션을 직접 생성하여 직접 진행해보세요. 다양한 사람들과 함께 실시간으로 소통하며 원하는 주제에 대해
            이야기를 나눌 수 있어요.
          </p>
        </div>
        <Button type="full" buttonStyle="black" onClick={handleNewLectureTrue}>
          <NewLectureIcon className="fill-grayscale-white" />
          강의 생성하기
        </Button>
      </div>
    </div>
  );
};

export default NewLectureFront;
