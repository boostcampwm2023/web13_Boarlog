import { useState } from "react";
import HeaderLogo from "./components/HeaderLogo";
import HeaderLoginButton from "./components/HeaderLoginButton";
import HeaderMainButtons from "./components/HeaderMainButtons";
import HeaderInstructorControls from "./components/HeaderInstructorControls";
import HeaderProfileButton from "./components/HeaderProfileButton";
import HeaderSettingButton from "./components/HeaderSettingButton";
import HeaderCodeCopyButton from "./components/HeaderCodeCopyButton";

interface HeaderProps {
  type: "login" | "main" | "instructor" | "participant";
}

const Header = ({ type }: HeaderProps) => {
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [isSettingClicked, setIsSettingClicked] = useState(false);

  return (
    <header className="flex w-100 relative items-center justify-between px-6 py-4 bg-white border-header box-border">
      <div className="flex items-center gap-4 semibold-20">
        {(type === "login" || type === "main") && <HeaderLogo type="normal" />}
        {(type === "instructor" || type === "participant") && (
          <>
            <HeaderLogo type="lecture" />
            <HeaderCodeCopyButton lectureCode="000000" />
          </>
        )}
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
            <HeaderInstructorControls />
            <HeaderSettingButton isSettingClicked={isSettingClicked} setIsSettingClicked={setIsSettingClicked} />
            <HeaderProfileButton isProfileClicked={isProfileClicked} setIsProfileClicked={setIsProfileClicked} />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
