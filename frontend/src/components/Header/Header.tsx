import { useState } from "react";
import HeaderLogo from "./components/HeaderLogo";
import HeaderLoginButton from "./components/HeaderLoginButton";
import HeaderMainButtons from "./components/HeaderMainButtons";
import HeaderLecturerControls from "./components/HeaderLecturerControls";
import HeaderProfileButton from "./components/HeaderProfileButton";

interface HeaderProps {
  type: "login" | "main" | "lecturer" | "participant";
}

const Header = ({ type }: HeaderProps) => {
  const [isProfileClicked, setIsProfileClicked] = useState(false);

  return (
    <header className="flex w-100 relative items-center justify-between px-6 py-4 bg-white border-header box-border">
      <div className="flex items-center gap-4 semibold-20">
        {(type === "login" || type === "main") && <HeaderLogo type="normal" />}
        {(type === "lecturer" || type === "participant") && <HeaderLogo type="lecture" />}
      </div>

      <div className="flex items-center gap-4 semibold-20">
        {type === "login" && <HeaderLoginButton />}
        {type === "main" && (
          <>
            <HeaderMainButtons />
            <HeaderProfileButton isProfileClicked={isProfileClicked} setIsProfileClicked={setIsProfileClicked} />
          </>
        )}
        {type === "lecturer" && (
          <>
            <HeaderLecturerControls />
            <HeaderProfileButton isProfileClicked={isProfileClicked} setIsProfileClicked={setIsProfileClicked} />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
