import { useNavigate } from "react-router-dom";
import EnterIcon from "@/assets/svgs/enter.svg?react";
import UserIcon from "@/assets/svgs/user.svg?react";
import Button from "@/components/Button/Button";
import LogoOriginal from "@/assets/imgs/logoOriginal.png";
import SubLogoOriginal from "@/assets/imgs/subLogoOriginal.png";

interface UserAuthSectionProps {
  isSignIn: boolean;
  setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserAuthSection = ({ isSignIn, setIsSignIn }: UserAuthSectionProps) => {
  const navigate = useNavigate();

  const handleLeftButtonClicked = () => {
    if (isSignIn) {
      console.log("singin logic");
    } else {
      setIsSignIn(true);
    }
  };

  const handleRightButtonClicked = () => {
    if (isSignIn) {
      setIsSignIn(false);
    } else {
      console.log("singup logic");
    }
  };

  return (
    <div className="flex flex-col relative py-20 sm:py-32 items-center justify-center w-full overflow-x-hidden overflow-y-visible">
      <section className="flex relative w-11/12 sm:max-w-md p-8 bg-grayscale-white flex-col items-start gap-8 rounded-xl border-default shadow-xl">
        <img src={LogoOriginal} className="absolute hidden -top-2 -left-52 rotate-[-20deg] z-[-1] w-64 sm:block" />
        <img src={SubLogoOriginal} className="absolute hidden -bottom-16 -right-80 rotate-[20deg] z-[-1] sm:block" />

        <div className="flex flex-col">
          <h1 className="semibold-64">Boarlog</h1>
          <h2 className="semibold-20 text-grayscale-darkgray">기록으로 남기는 실시간 강의</h2>
        </div>
        {isSignIn ? <></> : <></>}
        <div className="flex flex-col gap-4 w-full">
          <h3 className="semibold-32">{isSignIn ? "로그인" : "회원가입"}</h3>
          <div className="flex flex-col gap-2 w-full">
            <p className="semibold-18">이메일</p>
            <input
              type="text"
              className="rounded-xl border-black w-full flex-grow medium-12 p-3 focus:outline-none focus:ring-1 focus:ring-boarlog-100 focus:border-transparent"
              placeholder="이메일을 입력해주세요"
              maxLength={50}
            />
          </div>
          {!isSignIn && (
            <div className="flex flex-col gap-2 w-full">
              <p className="semibold-18">닉네임</p>
              <input
                type="text"
                className="rounded-xl border-black w-full flex-grow medium-12 p-3 focus:outline-none focus:ring-1 focus:ring-boarlog-100 focus:border-transparent"
                placeholder="닉네임을 입력해주세요"
                maxLength={50}
              />
            </div>
          )}
          <div className="flex flex-col gap-2 w-full">
            <p className="semibold-18">비밀번호</p>
            <input
              type="text"
              className="rounded-xl border-black w-full flex-grow medium-12 p-3 focus:outline-none focus:ring-1 focus:ring-boarlog-100 focus:border-transparent"
              placeholder="비밀번호을 입력해주세요"
              maxLength={50}
            />
          </div>
          {!isSignIn && (
            <div className="flex flex-col gap-2 w-full">
              <p className="semibold-18">비밀번호 확인</p>
              <input
                type="text"
                className="rounded-xl border-black w-full flex-grow medium-12 p-3 focus:outline-none focus:ring-1 focus:ring-boarlog-100 focus:border-transparent"
                placeholder="비밀번호을 다시 입력해주세요"
                maxLength={50}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col w-full gap-4 sm:flex-row">
          <Button type="grow" buttonStyle="black" onClick={handleLeftButtonClicked}>
            {isSignIn ? (
              <>
                <EnterIcon className="fill-grayscale-white" />
                시작하기
              </>
            ) : (
              <>
                <EnterIcon className="fill-grayscale-white" />
                뒤로가기
              </>
            )}
          </Button>
          <Button type="grow" buttonStyle="black" onClick={handleRightButtonClicked}>
            {isSignIn ? (
              <>
                <EnterIcon className="fill-grayscale-white" />
                회원가입
              </>
            ) : (
              <>
                <EnterIcon className="fill-grayscale-white" />
                가입하기
              </>
            )}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default UserAuthSection;
