import ProfileSmall from "@/assets/imgs/profileSmall.png";
import LogoutIcon from "@/assets/svgs/logout.svg?react";
import UserIcon from "@/assets/svgs/user.svg?react";

interface ProfileModalProps {
  profileClicked: boolean;
  setProfileClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileModal = ({ profileClicked, setProfileClicked }: ProfileModalProps) => {
  const handleBackgroundClick = () => {
    setProfileClicked(!profileClicked);
  };

  return (
    <>
      <div
        className={`w-screen h-screen fixed top-0 left-0 ${
          profileClicked ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={handleBackgroundClick}
      />
      <div
        className={`flex flex-col absolute top-24 right-4 items-center gap-4 px-6 py-4 w-96 h-fit bg-grayscale-white rounded-xl border-default duration-500 ${
          profileClicked ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-row gap-3 w-full h-14 justify-start">
          <img className="w-14 h-14" src={ProfileSmall} alt="내 프로필" />
          <div className="flex flex-col justify-between h-full">
            <p className="semibold-20">닉네임</p>
            <p className="medium-16 text-grayscale-darkgray">user.exampleEmail@gmail.com</p>
          </div>
        </div>
        <div className="flex flex-row gap-4 w-full">
          <button
            className="flex flex-row flex-grow justify-center items-center gap-1 py-3 rounded-xl bg-grayscale-black semibold-18 text-grayscale-white hover:bg-grayscale-darkgray duration-500"
            type="button"
          >
            <LogoutIcon className="fill-grayscale-white" />
            로그아웃
          </button>
          <button
            className="flex flex-row flex-grow justify-center items-center gap-1 py-3 rounded-xl bg-grayscale-black semibold-18 text-grayscale-white hover:bg-grayscale-darkgray duration-500"
            type="button"
          >
            <UserIcon className="fill-grayscale-white" />
            마이페이지
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
