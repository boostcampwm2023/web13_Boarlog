import { useNavigate } from "react-router-dom";

const HeaderReviewButtons = () => {
  const navigate = useNavigate();

  return (
    <>
      <button type="button" className="medium-16" onClick={() => navigate("/mypage")}>
        나가기
      </button>
    </>
  );
};

export default HeaderReviewButtons;
