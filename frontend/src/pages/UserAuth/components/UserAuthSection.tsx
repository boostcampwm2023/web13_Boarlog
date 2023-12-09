import { useNavigate } from "react-router-dom";
import logoBig from "@/assets/imgs/logoBig.png";
import GoogleIcon from "@/assets/svgs/google.svg?react";
import Button from "@/components/Button/Button";

const UserAuthSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 items-center justify-center h-[calc(100vh-5rem)]">
      <section className="flex relative w-11/12 max-w-xl p-6 flex-col items-center gap-4 rounded-xl border-default shadow-xl">
        <img src={logoBig} alt="Boarlog 로고" className="absolute -top-20 w-40 h-40 sm:w-56 sm:h-56 sm:-top-28"></img>
        <h2 className="semibold-32 mt-20 sm:mt-28">Boarlog</h2>

        <div className="flex flex-col gap-1 justify-center items-center">
          <h3 className="semibold-18 text-grayscale-darkgray">기록으로 남기는 실시간 강의</h3>
          <p className="medium-12 text-grayscale-darkgray">지금 바로 볼록과 함께하세요.</p>
        </div>

        <div className="w-full max-w-sm">
          <Button type="full" buttonStyle="black" onClick={() => navigate("/start")}>
            <GoogleIcon />
            구글 계정으로 로그인
          </Button>
        </div>
      </section>
    </div>
  );
};

export default UserAuthSection;
