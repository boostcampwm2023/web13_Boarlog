import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import useAuth from "@/hooks/useAuth";
import Button from "@/components/Button/Button";
import ReplayLectureCard from "./ReplayLectureCard";
import { useToast } from "@/components/Toast/useToast";

import EnterIcon from "@/assets/svgs/enter.svg?react";
import ProfileBig from "@/assets/imgs/profileBig.png";
import SubLogoOriginal from "@/assets/imgs/subLogoOriginal.png";

const NICKNAME_REGEXP = /^[a-zA-Z0-9가-힣]{3,15}$/;

type Lecture = {
  date: string;
  duration: string;
  user: string;
  title: string;
  description: string;
};

const MyPageSection = () => {
  const showToast = useToast();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [isUsernameEdit, setIsUsernameEdit] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [lectureList, setLectureList] = useState<Lecture[]>([]);

  useEffect(() => {
    checkAuth();
    axios
      .get(`${import.meta.env.VITE_API_SERVER_URL}/lecture/list`, {
        headers: { Authorization: localStorage.getItem("token") }
      })
      .then((result) => {
        setLectureList(result.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          showToast({ message: "로그인이 만료되었어요.", type: "alert" });
          navigate("/userauth");
        } else showToast({ message: "정보를 불러오는데 오류가 발생했어요.", type: "alert" });
      });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    setIsValid(NICKNAME_REGEXP.test(newUsername));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleEditButtonClicked();
  };

  const handleEditButtonClicked = () => {
    if (isUsernameEdit) {
      if (isValid) {
        axios
          .post(
            `${import.meta.env.VITE_API_SERVER_URL}/profile`,
            { username },
            {
              headers: { Authorization: localStorage.getItem("token") }
            }
          )
          .then((response) => {
            const { username, email } = response.data;
            localStorage.setItem("username", username);
            localStorage.setItem("email", email);
            setUsername(username);
          })
          .catch((error) => {
            if (error.response.status === 401) {
              showToast({ message: "로그인이 만료되었어요.", type: "alert" });
              navigate("/userauth");
            } else showToast({ message: "정보를 불러오는데 오류가 발생했어요.", type: "alert" });
          });
        showToast({ message: "닉네임 변경을 완료했습니다.", type: "success" });
        setIsUsernameEdit(false);
      } else {
        showToast({ message: "올바르지 않은 닉네임입니다.", type: "alert" });
      }
    } else {
      showToast({ message: "닉네임을 변경합니다.", type: "default" });
      setIsUsernameEdit(true);
    }
  };

  return (
    <div className="flex flex-col items-center my-32 sm:mt-36">
      <section className="flex relative w-11/12 max-w-3xl p-6 flex-col items-center gap-6 rounded-2xl border-default shadow-xl">
        <img src={ProfileBig} alt="프로필 이미지" className="absolute -top-20 w-40 h-40 sm:w-56 sm:h-56 sm:-top-28" />

        <input
          type="text"
          value={username}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          size={username.length + 1 || 3}
          placeholder="닉네임"
          maxLength={10}
          disabled={!isUsernameEdit}
          className="mt-20 sm:mt-28 semibold-32 text-center border-b-2 border-grayscale-gray focus:border-grayscale-black outline-none transition duration-200 rounded-none disabled:border-none disabled:text-grayscale-black disabled:bg-grayscale-white"
        />

        <div className="flex flex-col gap-1 justify-center items-center">
          {isUsernameEdit ? (
            <>
              {" "}
              <p className="semibold-18 text-grayscale-darkgray">사용할 닉네임을 입력해 주세요.</p>
              <p className={`medium-12 ${isValid ? "text-boarlog-100" : "text-alert-100"}`}>
                한글, 영문, 숫자 총 10자 이내
              </p>
            </>
          ) : (
            <p className="semibold-16 text-grayscale-darkgray">{localStorage.getItem("email")}</p>
          )}
        </div>

        <div className="w-full max-w-sm">
          <Button
            type="full"
            buttonStyle={isUsernameEdit && isValid ? "blue" : "black"}
            onClick={handleEditButtonClicked}
          >
            <EnterIcon className="fill-grayscale-white" />
            {isUsernameEdit ? "닉네임 변경 완료하기" : "닉네임 변경하기"}
          </Button>
        </div>

        <h3 className="mt-12 semibold-32">강의 다시보기</h3>
        <div className="flex flex-col w-full gap-6 items-center">
          {lectureList.length ? (
            lectureList.map((value, index) => (
              <ReplayLectureCard
                key={index}
                date={value.date}
                duration={value.duration}
                user={value.user}
                title={value.title}
                description={value.description}
                onClick={() => navigate("/")}
              />
            ))
          ) : (
            <>
              <img className="max-w-sm w-full" src={SubLogoOriginal} />
              <p className="semibold-16 text-grayscale-darkgray -mb-4">아직 수강한 강의가 존재하지 않아요.</p>
              <p className="semibold-16 text-grayscale-darkgray mb-6">새로운 강의를 수강하러 가볼까요?</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyPageSection;
