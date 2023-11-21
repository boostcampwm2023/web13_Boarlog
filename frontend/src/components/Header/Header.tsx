import { useState } from "react";
import ProfileModal from "./components/ProfileModal";
import LeftSection from "./components/LeftSection";
import RightSection from "./components/RightSection";

interface HeaderProps {
  lecture?: boolean;
  lecturer?: boolean;
  login?: boolean;
  main?: boolean;
}

const Header = ({ lecture, lecturer, login, main }: HeaderProps) => {
  const [isProfileClicked, setIsProfileClicked] = useState(false);

  return (
    <header className="flex w-100 relative items-center justify-between px-6 py-4 bg-white border-header box-border">
      <LeftSection lecture={lecture} />
      <RightSection
        isProfileClicked={isProfileClicked}
        setIsProfileClicked={setIsProfileClicked}
        lecturer={lecturer}
        login={login}
        main={main}
      />
      <ProfileModal isProfileClicked={isProfileClicked} setIsProfileClicked={setIsProfileClicked} />
    </header>
  );
};

export default Header;
