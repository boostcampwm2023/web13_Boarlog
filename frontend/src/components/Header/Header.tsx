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
  const [profileClicked, setProfileClicked] = useState(false);

  return (
    <header className="flex w-100 relative items-center justify-between px-6 py-4 bg-white border-header box-border">
      <LeftSection lecture={lecture} />
      <RightSection
        profileClicked={profileClicked}
        setProfileClicked={setProfileClicked}
        lecturer={lecturer}
        login={login}
        main={main}
      />
      <ProfileModal profileClicked={profileClicked} setProfileClicked={setProfileClicked} />
    </header>
  );
};

export default Header;
