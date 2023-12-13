import { useToast } from "@/components/Toast/useToast";
import { useNavigate } from "react-router-dom";

const HeaderLoginButton = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const handleButtonClicked = () => {
    showToast({ message: "Guest로 시작합니다.", type: "default" });
    navigate("/");
  };

  return (
    <button type="button" className="medium-16" onClick={handleButtonClicked}>
      Guest로 시작하기
    </button>
  );
};

export default HeaderLoginButton;
