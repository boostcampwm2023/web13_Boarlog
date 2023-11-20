interface HeaderProps {
  lecture?: boolean;
  login?: boolean;
  main?: boolean;
}

const RightSection: React.FC<HeaderProps> = ({ login, main }) => {
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
          <button type="button" className="">
            <img></img>
          </button>
        </>
      )}
    </div>
  );
};

export default RightSection;
