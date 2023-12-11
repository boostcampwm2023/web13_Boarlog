import HeaderProfileModal from "./HeaderProfileModal";
import ProfileSmall from "@/assets/imgs/profileSmall.png";

interface HeaderProfileButtonProps {
  isProfileClicked: boolean;
  setIsProfileClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderProfileButton = ({ isProfileClicked, setIsProfileClicked }: HeaderProfileButtonProps) => {
  return (
    <>
      <button type="button" className="" onClick={() => setIsProfileClicked(!isProfileClicked)}>
        <img src={ProfileSmall} alt="내 프로필" />
      </button>
      <HeaderProfileModal isProfileClicked={isProfileClicked} setIsProfileClicked={setIsProfileClicked} />
    </>
  );
};

export default HeaderProfileButton;
