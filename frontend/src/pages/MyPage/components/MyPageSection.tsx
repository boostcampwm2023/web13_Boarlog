import { useState } from "react";
import Button from "@/components/Button/Button";
import ProfileBig from "@/assets/imgs/profileBig.png";
import EnterIcon from "@/assets/svgs/enter.svg?react";
import { useToast } from "@/components/Toast/useToast";
import ReplayLectureCard from "./ReplayLectureCard";

interface MyPageSectionProps {
  profileImage: string;
}

const NICKNAME_REGEXP = /^(?![0-9-_.]+$)[가-힣A-Za-z0-9-_.]{1,10}$/;

const DUMMY_DATA = [
  {
    profileImage: "",
    duration: "12:34",
    user: "볼록이",
    date: "2023.11.11",
    title: "프로그래밍 기초",
    description: "컴퓨터 프로그래밍의 기본 원리를 배우는 입문 강좌. 언어 선택부터 기본 구문까지."
  },
  {
    profileImage: "",
    duration: "12:34",
    user: "볼록이",
    date: "2023.11.12",
    title: "요리의 기초",
    description: "기본적인 요리 기술과 요리법을 배우는 강좌. 초보자를 위한 쉬운 레시피와 요리 팁 제공."
  },
  {
    profileImage: "",
    duration: "12:34",
    user: "볼록이",
    date: "2023.11.13",
    title: "디지털 마케팅",
    description: "디지털 마케팅 전략과 소셜 미디어 활용 방법을 배우는 실용적인 강좌."
  },
  {
    profileImage: "",
    duration: "12:34",
    user: "볼록이",
    date: "2023.11.14",
    title: "수학의 이해",
    description: "기본적인 수학 개념과 문제 해결 기술을 배우는 강좌. 수학에 대한 두려움을 극복할 수 있도록 도움."
  },
  {
    profileImage: "",
    duration: "12:34",
    user: "볼록이",
    date: "2023.11.15",
    title: "역사 탐험",
    description: "세계 역사의 주요 사건과 인물을 탐구하는 강좌. 역사를 통해 현재를 이해하는 데 도움."
  },
  {
    profileImage: "",
    duration: "12:34",
    user: "볼록이",
    date: "2023.11.16",
    title: "창의적 글쓰기",
    description: "창의적인 글쓰기 기술과 아이디어 발상법을 배우는 강좌. 글쓰기를 통한 자기 표현 방법 탐구."
  },
  {
    profileImage: "",
    duration: "12:34",
    user: "볼록이",
    date: "2023.11.17",
    title: "영화 분석",
    description: "영화의 기술적 요소와 예술적 가치를 분석하는 강좌. 영화를 깊이 있게 이해하는 방법 제공."
  },
  {
    profileImage: "",
    duration: "12:34",
    user: "볼록이",
    date: "2023.11.18",
    title: "피트니스 가이드",
    description: "건강하고 효율적인 운동 방법을 배우는 강좌. 개인별 맞춤 운동 계획 설정 방법 제공."
  },
  {
    profileImage: "",
    duration: "12:34",
    user: "볼록이",
    date: "2023.11.19",
    title: "사진술 입문",
    description: "기초 사진 기술과 구도, 조명 활용법을 배우는 강좌. 사진을 통해 예술적 감각 향상."
  },
  {
    profileImage: "",
    duration: "12:34",
    user: "볼록이",
    date: "2023.11.20",
    title: "환경 보호",
    description: "환경 보호와 지속 가능한 생활 방식에 대해 배우는 강좌. 일상에서 실천할 수 있는 환경 보호 활동 소개."
  }
];

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
    <div className="flex flex-col items-center mt-32 sm:mt-36">
      <section className="flex relative w-11/12 max-w-3xl p-6 flex-col items-center gap-8 rounded-2xl border-default shadow-xl">
        <img
          src={profileImage ? profileImage : ProfileBig}
          alt="프로필 이미지"
          className="absolute -top-20 w-40 h-40 sm:w-56 sm:h-56 sm:-top-28"
        />

        <input
          type="text"
          value={nickname}
          onChange={handleChange}
          size={nickname.length || 1}
          placeholder="닉네임"
          maxLength={10}
          className="mt-20 sm:mt-28 semibold-32 text-center border-b-2 border-grayscale-gray focus:border-grayscale-black outline-none transition duration-200"
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
          {DUMMY_DATA.map((value, index) => (
            <ReplayLectureCard
              key={index}
              profileImage={value.profileImage}
              date={value.date}
              duration={value.duration}
              user={value.user}
              title={value.title}
              description={value.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MyPageSection;
