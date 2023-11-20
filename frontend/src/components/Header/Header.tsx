import { useState } from "react";
import ProfileModal from "./components/ProfileModal";
import LeftSection from "./components/LeftSection";
import RightSection from "./components/RightSection";

interface HeaderProps {
  lecture?: boolean;
  login?: boolean;
  main?: boolean;
}

const Header = ({ lecture, login, main }: HeaderProps) => {
  const [profileClicked, setProfileClicked] = useState(false);

  return (
    <header className="flex w-100 relative items-center justify-between px-6 py-4 bg-white border-header box-border">
      <LeftSection lecture={lecture} />
      <RightSection setProfileClicked={setProfileClicked} login={login} main={main} />
      <ProfileModal profileClicked={profileClicked} />
    </header>
  );
};

export default Header;
