import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EnterIcon from "@/assets/svgs/enter.svg?react";
import UserIcon from "@/assets/svgs/user.svg?react";
import CloseIcon from "@/assets/svgs/close.svg?react";
import Button from "@/components/Button/Button";
import LogoOriginal from "@/assets/imgs/logoOriginal.png";
import SubLogoOriginal from "@/assets/imgs/subLogoOriginal.png";

interface UserAuthSectionProps {
  isSignIn: boolean;
  setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const EMAIL_REGEXP = /^[a-zA-Z0-9._+]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
const NICKNAME_REGEXP = /^[a-zA-Z0-9가-힣]{3,15}$/;
const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const UserAuthSection = ({ isSignIn, setIsSignIn }: UserAuthSectionProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isNicknameValid, setIsNicknameValid] = useState<boolean | null>(null);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState<boolean | null>(null);

  useEffect(() => {
    setEmail("");
    setNickname("");
    setPassword("");
    setPasswordConfirm("");
    setIsEmailValid(null);
    setIsNicknameValid(null);
    setIsPasswordValid(null);
    setIsPasswordConfirm(null);
  }, [isSignIn]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsEmailValid(EMAIL_REGEXP.test(e.target.value));
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setIsNicknameValid(NICKNAME_REGEXP.test(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsPasswordValid(PASSWORD_REGEXP.test(e.target.value));
    setIsPasswordConfirm(passwordConfirm === e.target.value);
  };

  const handlePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
    setIsPasswordConfirm(e.target.value === password);
  };

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

  const getDescriptionColor = (isValid: boolean | null) => {
    if (isValid === null) return "text-grayscale-darkgray";
    return isValid ? "text-boarlog-100" : "text-alert-100";
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
            {!isSignIn && (
              <p className={`medium-12 ${getDescriptionColor(isEmailValid)}`}>올바른 이메일 형식을 입력해주세요.</p>
            )}
            <input
              type="text"
              className="rounded-xl border-black w-full flex-grow medium-12 p-3 focus:outline-none focus:ring-1 focus:ring-boarlog-100 focus:border-transparent"
              placeholder="이메일을 입력해주세요"
              maxLength={50}
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          {!isSignIn && (
            <div className="flex flex-col gap-2 w-full">
              <p className="semibold-18">닉네임</p>
              <p className={`medium-12 ${getDescriptionColor(isNicknameValid)}`}>
                3자 이상 15자 이하의 영문, 숫자, 한글만 사용할 수 있습니다.
              </p>
              <input
                type="text"
                className="rounded-xl border-black w-full flex-grow medium-12 p-3 focus:outline-none focus:ring-1 focus:ring-boarlog-100 focus:border-transparent"
                placeholder="닉네임을 입력해주세요"
                maxLength={15}
                value={nickname}
                onChange={handleNicknameChange}
              />
            </div>
          )}
          <div className="flex flex-col gap-2 w-full">
            <p className="semibold-18">비밀번호</p>
            {!isSignIn && (
              <p className={`medium-12 ${getDescriptionColor(isPasswordValid)}`}>
                8자 이상, 대소문자, 숫자, 특수 문자(@$!%*?&)를 최소 하나씩 포함해야 합니다.
              </p>
            )}
            <input
              type="password"
              className="rounded-xl border-black w-full flex-grow medium-12 p-3 focus:outline-none focus:ring-1 focus:ring-boarlog-100 focus:border-transparent"
              placeholder="비밀번호을 입력해주세요"
              maxLength={50}
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          {!isSignIn && (
            <div className="flex flex-col gap-2 w-full">
              <p className="semibold-18">비밀번호 확인</p>
              <p className={`medium-12 ${getDescriptionColor(isPasswordConfirm)}`}>
                비밀번호가 일치하도록 입력해주세요.
              </p>
              <input
                type="password"
                className="rounded-xl border-black w-full flex-grow medium-12 p-3 focus:outline-none focus:ring-1 focus:ring-boarlog-100 focus:border-transparent"
                placeholder="비밀번호을 다시 입력해주세요"
                maxLength={50}
                value={passwordConfirm}
                onChange={handlePasswordConfirm}
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
                <CloseIcon className="fill-grayscale-white" />
                뒤로가기
              </>
            )}
          </Button>
          <Button type="grow" buttonStyle="black" onClick={handleRightButtonClicked}>
            {isSignIn ? (
              <>
                <UserIcon className="fill-grayscale-white" />
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
