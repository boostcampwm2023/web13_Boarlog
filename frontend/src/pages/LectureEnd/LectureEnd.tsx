import { useNavigate } from "react-router-dom";
import EndLecture from "@/assets/imgs/endLecture.png";
import Button from "@/components/Button/Button";
import HomeIcon from "@/assets/svgs/home.svg?react";

const LectureEnd = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center display-center w-11/12 md:w-fit">
      <img src={EndLecture} className="w-64 h-64 md:w-fit md:h-fit" alt="로고 이미지" />
      <p className="font-pretendard font-semibold text-size-32 -mt-20 md:-mt-32 md:text-size-64">CLOSED</p>
      <p className="semibold-20 text-grayscale-darkgray mt-12 mb-6">강의가 종료되었어요.</p>
      <Button type="full" buttonStyle="black" onClick={() => navigate("/")}>
        <HomeIcon className="fill-grayscale-white" />홈 화면으로 돌아가기
      </Button>
    </div>
  );
};

export default LectureEnd;
