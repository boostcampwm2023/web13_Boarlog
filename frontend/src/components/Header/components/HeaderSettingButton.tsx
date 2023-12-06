import SettingIcon from "@/assets/svgs/setting.svg?react";
import SmallButton from "@/components/SmallButton/SmallButton";
import HeaderInstructorSettingModal from "./HeaderInstructorSettingModal";
import HeaderParticipantSettingModal from "./HeaderParticipantSettingModal";

interface HeaderSettingButtonProps {
  isSettingClicked: boolean;
  setIsSettingClicked: React.Dispatch<React.SetStateAction<boolean>>;
  type: "login" | "main" | "instructor" | "participant" | "review";
}

const HeaderSettingButton = ({ isSettingClicked, setIsSettingClicked, type }: HeaderSettingButtonProps) => {
  return (
    <>
      <SmallButton
        className="bg-grayscale-lightgray text-grayscale-white"
        onClick={() => setIsSettingClicked(!isSettingClicked)}
      >
        <SettingIcon className="w-5 h-5 fill-grayscale-black" />
      </SmallButton>

      {type === "instructor" && (
        <HeaderInstructorSettingModal isSettingClicked={isSettingClicked} setIsSettingClicked={setIsSettingClicked} />
      )}
      {(type === "participant" || type === "review") && (
        <HeaderParticipantSettingModal isSettingClicked={isSettingClicked} setIsSettingClicked={setIsSettingClicked} />
      )}
    </>
  );
};

export default HeaderSettingButton;
