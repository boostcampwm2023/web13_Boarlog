import logoBig from "@/assets/imgs/logoBig.png";
import GoogleIcon from "@/assets/svgs/google.svg?react";

const LoginSection = () => {
  return (
    <section className="flex relative w-6/12 py-8 flex-col items-center rounded-2xl border-default shadow-default">
      <img src={logoBig} alt="Boarlog 로고" className="absolute top-[-100px]"></img>
      <h2 className="semibold-64 mt-[100px]">Boarlog</h2>
      <h3 className="semibold-20 mt-6 text-grayscale-darkgray">기록으로 남기는 실시간 강의</h3>
      <p className="medium-16 mt-1 text-grayscale-darkgray">지금 바로 볼록과 함께하세요.</p>
      <button
        type="button"
        className="flex gap-1 justify-center items-center mt-[50px] py-3 w-8/12 rounded-xl semibold-18 text-grayscale-white bg-grayscale-black"
      >
        <GoogleIcon />
        구글 계정으로 로그인
      </button>
    </section>
  );
};

export default LoginSection;
