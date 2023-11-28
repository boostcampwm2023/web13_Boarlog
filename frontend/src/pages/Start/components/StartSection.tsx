import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/Button";
import ProfileLarge from "@/assets/imgs/profileLarge.png";
import EnterIcon from "@/assets/svgs/enter.svg?react";
import { useToast } from "@/components/Toast/useToast";

interface StartSectionProps {
  profileImage: string;
}

const NICKNAME_REGEXP = /^(?![0-9-_.]+$)[가-힣A-Za-z0-9-_.]{1,10}$/;

const StartSection = ({ profileImage }: StartSectionProps) => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [nickname, setNickname] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    showToast({ message: "닉네임을 설정해주세요.", type: "default" });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = event.target.value;
    setNickname(newNickname);
    setIsValid(NICKNAME_REGEXP.test(newNickname));
  };

  const handleStartButtonClicked = () => {
    if (isValid) {
      showToast({ message: "메인 페이지로 이동합니다.", type: "success" });
      navigate("/");
    } else {
      showToast({ message: "올바르지 않은 닉네임입니다.", type: "alert" });
    }
  };

  return (
    <section className="flex relative w-11/12 max-w-xl p-8 flex-col items-center gap-8 rounded-xl border-default shadow-xl">
      <img
        src={profileImage ? profileImage : ProfileLarge}
        alt="프로필 이미지"
        className="absolute -top-20 w-40 h-40 st:w-56 st:h-56 st:-top-28"
      />

      <input
        type="text"
        value={nickname}
        onChange={handleChange}
        size={nickname.length || 1}
        placeholder="닉네임"
        maxLength={10}
        className="mt-20 st:mt-28 semibold-32 text-center border-b-2 border-grayscale-gray focus:border-grayscale-black outline-none transition duration-200"
      />

      <div className="flex flex-col gap-1 justify-center items-center">
        <p className="semibold-18 text-grayscale-darkgray">사용할 닉네임을 입력해 주세요.</p>
        <p className={`medium-12 ${isValid ? "text-boarlog-100" : "text-alert-100"}`}>
          한글, 영문, 숫자, -, _, ., 총 10자 이내
        </p>
      </div>

      <div className="w-full max-w-sm">
        <Button type="full" buttonStyle={isValid ? "blue" : "black"} onClick={handleStartButtonClicked}>
          <EnterIcon className="fill-grayscale-white" />
          볼록 시작하기
        </Button>
      </div>
    </section>
  );
};

export default StartSection;
