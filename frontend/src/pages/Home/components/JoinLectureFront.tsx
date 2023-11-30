import JoinLectureImg from "@/assets/imgs/joinLecture.png";
import Button from "@/components/Button/Button";
import EnterIcon from "@/assets/svgs/enter.svg?react";

interface JoinLectureFrontProps {
  handleJoinLectureTrue: () => void;
}

const JoinLectureFront = ({ handleJoinLectureTrue }: JoinLectureFrontProps) => {
  return (
    <div
      className="w-full h-full flex flex-col absolute bg-grayscale-white overflow-hidden border-default rounded-xl backface-hidden z-[2] shadow-xl cursor-pointer"
      onClick={handleJoinLectureTrue}
    >
      <img src={JoinLectureImg} alt="강의 시작 배너 이미지" className="w-full h-60 object-cover object-center" />
      <div className="w-full flex grow flex-col p-6 justify-between">
        <div>
          <h3 className="semibold-32 break-keep mb-1">강의 참여하기</h3>
          <p className="medium-16 text-grayscale-darkgray break-keep">
            생성된 강의 세션에 참여해 보세요. 실시간 채팅으로 세션 진행자에게 질문하고 다양한 사람들과 소통할 수 있어요.
          </p>
        </div>
        <Button type="full" buttonStyle="black" onClick={handleJoinLectureTrue}>
          <EnterIcon className="fill-grayscale-white" />
          강의 참여하기
        </Button>
      </div>
    </div>
  );
};

export default JoinLectureFront;
