import { useNavigate } from "react-router-dom";
import ProfileSmall from "@/assets/imgs/profileSmall.png";
import LogoutIcon from "@/assets/svgs/logout.svg?react";
import UserIcon from "@/assets/svgs/user.svg?react";
import Button from "@/components/Button/Button";

interface HeaderProfileModalProps {
  isProfileClicked: boolean;
  setIsProfileClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderProfileModal = ({ isProfileClicked, setIsProfileClicked }: HeaderProfileModalProps) => {
  const navigate = useNavigate();

  const moveToMyPage = () => {
    navigate("/mypage");
  };

  return (
    <>
      <div
        className={`w-screen h-screen fixed top-0 left-0 ${
          isProfileClicked ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsProfileClicked(!isProfileClicked)}
      />
      <div
        className={`flex flex-col fixed sm:absolute top-24 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-4 items-center gap-4 px-6 py-4 w-11/12 sm:w-96 h-fit bg-grayscale-white rounded-xl border-default duration-500 ${
          isProfileClicked ? "opacity-100 visible" : "opacity-0 invisible"
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
          <Button type="grow" buttonStyle="black">
            <LogoutIcon className="fill-grayscale-white" />
            로그아웃
          </Button>
          <Button type="grow" buttonStyle="black" onClick={moveToMyPage}>
            <UserIcon className="fill-grayscale-white" />
            마이페이지
          </Button>
        </div>
      </div>
    </>
  );
};

export default HeaderProfileModal;
