import ProfileSmall from "@/assets/imgs/profileSmall.png";

interface RightSectionProps {
  login?: boolean;
  main?: boolean;
  setProfileClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const RightSection = ({ setProfileClicked, login, main }: RightSectionProps) => {
  const handleFocus = () => {
    setProfileClicked(true);
  };

  const handleBlur = () => {
    setProfileClicked(false);
  };

  return (
    <div className="flex items-center gap-4">
      {login && (
        <button type="button" className="medium-16">
          Boarlog 체험하기
        </button>
      )}
      {main && (
        <>
          <button type="button" className="medium-16">
            시작하기
          </button>
          <button type="button" className="medium-16">
            이전 강의 다시보기
          </button>
          <button type="button" className="" onFocus={handleFocus} onBlur={handleBlur}>
            <img src={ProfileSmall} alt="내 프로필" />
          </button>
        </>
      )}
    </div>
  );
};

export default RightSection;
