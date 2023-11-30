import { useState, useEffect } from "react";
import Button from "@/components/Button/Button";
import ProfileBig from "@/assets/imgs/profileBig.png";
import EnterIcon from "@/assets/svgs/enter.svg?react";
import { useToast } from "@/components/Toast/useToast";
import ReplayLectureCard from "./ReplayLectureCard";

interface MyPageSectionProps {
  profileImage: string;
}

const NICKNAME_REGEXP = /^(?![0-9-_.]+$)[가-힣A-Za-z0-9-_.]{1,10}$/;

const MyPageSection = ({ profileImage }: MyPageSectionProps) => {
  const showToast = useToast();
  const [nickname, setNickname] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = event.target.value;
    setNickname(newNickname);
    setIsValid(NICKNAME_REGEXP.test(newNickname));
  };

  const handleStartButtonClicked = () => {
    if (isValid) {
      showToast({ message: "닉네임 변경을 완료했습니다.", type: "success" });
    } else {
      showToast({ message: "올바르지 않은 닉네임입니다.", type: "alert" });
    }
  };

  return (
    <div className="flex flex-col items-center mt-32 st:mt-36">
      <section className="flex relative w-11/12 max-w-3xl p-6 flex-col items-center gap-8 rounded-2xl border-default shadow-xl">
        <img
          src={profileImage ? profileImage : ProfileBig}
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
            닉네임 변경 완료하기
          </Button>
        </div>

        <h3 className="mt-12 semibold-32">강의 다시보기</h3>
        <div className="flex flex-col w-full gap-6">
          <ReplayLectureCard />
          <ReplayLectureCard />
          <ReplayLectureCard />
          <ReplayLectureCard />
          <ReplayLectureCard />
          <ReplayLectureCard />
          <ReplayLectureCard />
          <ReplayLectureCard />
          <ReplayLectureCard />
          <ReplayLectureCard />
          <ReplayLectureCard />
        </div>
      </section>
    </div>
  );
};

export default MyPageSection;
