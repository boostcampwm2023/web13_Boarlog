import SettingIcon from "@/assets/svgs/setting.svg?react";
import SmallButton from "@/components/SmallButton/SmallButton";
import HeaderSettingModal from "./HeaderSettingModal";

interface HeaderSettingButtonProps {
  isSettingClicked: boolean;
  setIsSettingClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderSettingButton = ({ isSettingClicked, setIsSettingClicked }: HeaderSettingButtonProps) => {
  return (
    <>
      <SmallButton
        className="bg-grayscale-lightgray text-grayscale-white"
        onClick={() => setIsSettingClicked(!isSettingClicked)}
      >
        <SettingIcon className="w-5 h-5 fill-grayscale-black" />
      </SmallButton>
      <HeaderSettingModal isSettingClicked={isSettingClicked} setIsSettingClicked={setIsSettingClicked} />
    </>
  );
};

export default HeaderSettingButton;
