import { useState } from "react";
import HeaderLogo from "./components/HeaderLogo";
import HeaderLoginButton from "./components/HeaderLoginButton";
import HeaderMainButtons from "./components/HeaderMainButtons";
import HeaderInstructorControls from "./components/HeaderInstructorControls";
import HeaderParticipantControls from "./components/HeaderParticipantControls";
import HeaderProfileButton from "./components/HeaderProfileButton";
import HeaderSettingButton from "./components/HeaderSettingButton";
import HeaderCodeCopyButton from "./components/HeaderCodeCopyButton";

interface HeaderProps {
  type: "login" | "main" | "instructor" | "participant" | "review";
}

const Header = ({ type }: HeaderProps) => {
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [isSettingClicked, setIsSettingClicked] = useState(false);
  const [lectureTitle, setLectureTitle] = useState("강의 제목");
  const [lectureCode, setLectureCode] = useState("000000");

  return (
    <header className="flex w-100 h-20 items-center justify-between px-6 py-4 bg-grayscale-white border-header box-border z-10 sticky top-0">
      <div className="flex items-center gap-4 semibold-20">
        {(type === "login" || type === "main") && (
          <HeaderLogo type={type === "login" ? "login" : "normal"} lectureTitle={lectureTitle} />
        )}
        {(type === "instructor" || type === "participant") && (
          <>
            <HeaderLogo type="lecture" lectureTitle={lectureTitle} />
            <HeaderCodeCopyButton lectureCode={lectureCode} />
          </>
        )}
        {type === "review" && <HeaderLogo type="lecture" lectureTitle={lectureTitle} />}
      </div>

      <div className="flex items-center gap-4 semibold-20">
        {type === "login" && <HeaderLoginButton />}
        {type === "main" && (
          <>
            <HeaderMainButtons />
            <HeaderProfileButton isProfileClicked={isProfileClicked} setIsProfileClicked={setIsProfileClicked} />
          </>
        )}
        {type === "instructor" && (
          <>
            <HeaderInstructorControls setLectureCode={setLectureCode} setLectureTitle={setLectureTitle} />
            <HeaderSettingButton
              isSettingClicked={isSettingClicked}
              setIsSettingClicked={setIsSettingClicked}
              type={type}
            />
            <HeaderProfileButton isProfileClicked={isProfileClicked} setIsProfileClicked={setIsProfileClicked} />
          </>
        )}
        {type === "participant" && (
          <>
            <HeaderParticipantControls setLectureCode={setLectureCode} setLectureTitle={setLectureTitle} />
            <HeaderSettingButton
              isSettingClicked={isSettingClicked}
              setIsSettingClicked={setIsSettingClicked}
              type={type}
            />
            <HeaderProfileButton isProfileClicked={isProfileClicked} setIsProfileClicked={setIsProfileClicked} />
          </>
        )}
        {type === "review" && (
          <>
            <HeaderMainButtons />
            <HeaderProfileButton isProfileClicked={isProfileClicked} setIsProfileClicked={setIsProfileClicked} />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
