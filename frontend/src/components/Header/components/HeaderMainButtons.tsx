import { useNavigate } from "react-router-dom";

const HeaderMainButtons = () => {
  const navigate = useNavigate();

  return (
    <>
      <button type="button" className="medium-16" onClick={() => navigate("/")}>
        시작하기
      </button>
      <button type="button" className="medium-16" onClick={() => navigate("/mypage")}>
        강의 다시보기
      </button>
    </>
  );
};

export default HeaderMainButtons;
