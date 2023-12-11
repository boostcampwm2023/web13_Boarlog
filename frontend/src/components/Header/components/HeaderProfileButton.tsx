import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/components/Toast/useToast";
import HeaderProfileModal from "./HeaderProfileModal";
import ProfileSmall from "@/assets/imgs/profileSmall.png";

interface HeaderProfileButtonProps {
  isProfileClicked: boolean;
  setIsProfileClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderProfileButton = ({ isProfileClicked, setIsProfileClicked }: HeaderProfileButtonProps) => {
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      showToast({ message: "로그인이 필요해요.", type: "alert" });
      navigate("/userauth");
    } else {
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");
      if (!username || !email) {
        axios
          .get(`${import.meta.env.VITE_API_SERVER_URL}/profile`, {
            headers: {
              Authorization: accessToken
            }
          })
          .then((result) => {
            console.log(result);
            localStorage.setItem("username", result.data.username);
            localStorage.setItem("email", result.data.email);
          })
          .catch((error) => {
            if (error.response.status === 401) {
              showToast({ message: "로그인이 만료되었어요.", type: "alert" });
              navigate("/userauth");
            }
          });
      }
    }
  }, []);

  return (
    <>
      <button type="button" className="" onClick={() => setIsProfileClicked(!isProfileClicked)}>
        <img src={ProfileSmall} alt="내 프로필" />
      </button>
      <HeaderProfileModal isProfileClicked={isProfileClicked} setIsProfileClicked={setIsProfileClicked} />
    </>
  );
};

export default HeaderProfileButton;
