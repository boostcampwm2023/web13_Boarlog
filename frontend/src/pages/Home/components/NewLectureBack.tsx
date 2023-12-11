import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Button from "@/components/Button/Button";
import SmallButton from "@/components/SmallButton/SmallButton";
import CloseIcon from "@/assets/svgs/close.svg?react";
import NewLectureIcon from "@/assets/svgs/newLecture.svg?react";
import { useToast } from "@/components/Toast/useToast";

interface NewLectureBackProps {
  handleNewLectureFalse: () => void;
}

const NewLectureBack = ({ handleNewLectureFalse }: NewLectureBackProps) => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateButtonClicked = () => {
    if (title.replace(/ /g, "") && description.replace(/ /g, "")) {
      axios
        .post(
          `${import.meta.env.VITE_API_SERVER_URL}/lecture`,
          {
            title,
            description,
            email: localStorage.getItem("email")
          },
          {
            headers: {
              Authorization: localStorage.getItem("token")
            }
          }
        )
        .then((result) => {
          showToast({ message: "강의 생성을 완료했어요.", type: "success" });
          navigate(`/instructor?roomid=${result.data.code}`);
        })
        .catch((error) => {
          console.log(error);
        });
    } else showToast({ message: "올바른 강의 정보를 입력해주세요.", type: "alert" });
  };

  return (
    <div className="w-full h-full flex flex-col absolute bg-grayscale-white overflow-hidden border-default rounded-xl rotate-180 z-[1] shadow-xl">
      <div className="w-full h-full flex flex-col p-6 gap-6">
        <div className="flex flex-row justify-between">
          <h3 className="semibold-32 break-keep">새로운 강의 생성하기</h3>
          <SmallButton onClick={handleNewLectureFalse}>
            <CloseIcon className="w-6 h-6" />
          </SmallButton>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="semibold-18 break-keep">강의 제목</h4>
          <p className="medium-12 text-grayscale-darkgray break-keep">강의를 잘 드러낼 수 있는 제목을 작성해 주세요.</p>
          <input
            type="text"
            className="rounded-xl border-black w-full flex-grow medium-12 p-3 focus:outline-none focus:ring-1 focus:ring-boarlog-100 focus:border-transparent"
            placeholder="강의 제목을 입력해주세요"
            maxLength={50}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 flex-grow">
          <h4 className="semibold-18 break-keep">강의 설명</h4>
          <p className="medium-12 text-grayscale-darkgray break-keep">강의에 대한 설명을 간략하게 작성해주세요.</p>
          <textarea
            className="rounded-xl border-black w-full flex-grow medium-12 p-3 resize-none focus:outline-none focus:ring-1 focus:ring-boarlog-100 focus:border-transparent"
            placeholder="강의 설명을 입력해주세요"
            maxLength={200}
            value={description} // 상태 바인딩
            onChange={(e) => setDescription(e.target.value)} // 입력 변경에 따라 상태 업데이트
          />
        </div>

        <Button type="full" buttonStyle="blue" onClick={handleCreateButtonClicked}>
          <NewLectureIcon className="fill-grayscale-white" />
          강의 생성하기
        </Button>
      </div>
    </div>
  );
};

export default NewLectureBack;
