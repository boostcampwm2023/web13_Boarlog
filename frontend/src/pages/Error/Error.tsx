import { Navigate, useNavigate } from "react-router-dom";
import LogoBig from "@/assets/imgs/logoBig.png";
import Button from "@/components/Button/Button";
import HomeIcon from "@/assets/svgs/home.svg?react";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center display-center w-11/12 sm:8/12 md:w-fit">
      <div className="flex flex-row items-center justify-center">
        <p className="font-pretendard font-bold text-8xl md:text-size-260">4</p>
        <img src={LogoBig} className="w-24 h-24 md:w-fit md:h-fit" alt="로고 이미지" />
        <p className="font-pretendard font-bold text-8xl md:text-size-260">4</p>
      </div>
      <p className="font-pretendard font-semibold text-size-32 md:text-size-64">NOT FOUND</p>
      <p className="semibold-20 text-grayscale-darkgray mt-12 mb-6">이런! 잘못된 접근이에요.</p>
      <Button type="full" buttonStyle="black" onClick={() => navigate("/")}>
        <HomeIcon className="fill-grayscale-white" />홈 화면으로 돌아가기
      </Button>
    </div>
  );
};

export default Error;
