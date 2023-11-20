import ProfileSmall from "@/assets/imgs/profileSmall.png";

const ProfileModal = () => {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-4 w-96 h-fit bg-grayscale-white rounded-xl border-default">
      <div className="flex flex-row gap-3 w-full h-14 justify-start">
        <img className="w-14 h-14" src={ProfileSmall} alt="내 프로필" />
        <div className="flex flex-col justify-between h-full">
          <p className="semibold-20">닉네임</p>
          <p className="medium-16 text-grayscale-darkgray">user.exampleEmail@gmail.com</p>
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full">
        <button
          className="flex flex-row flex-grow justify-center gap-1 py-3 rounded-xl bg-grayscale-black semibold-18 text-grayscale-white"
          type="button"
        >
          로그아웃
        </button>
        <button
          className="flex flex-row flex-grow justify-center gap-1 py-3 rounded-xl bg-grayscale-black semibold-18 text-grayscale-white"
          type="button"
        >
          마이페이지
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
