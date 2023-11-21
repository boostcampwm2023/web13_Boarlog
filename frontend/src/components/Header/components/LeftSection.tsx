import { useNavigate } from "react-router-dom";
import logoSmall from "@/assets/imgs/logoSmall.png";

interface LeftSectionProps {
  lecture?: boolean;
}

const LeftSection = ({ lecture }: LeftSectionProps) => {
  const navigate = useNavigate();

  const moveToMainPage = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center gap-4 semibold-20">
      <button type="button" className="flex flex-row items-center gap-4" onClick={moveToMainPage}>
        <img src={logoSmall} />
        {!lecture && <h1>Boarlog</h1>}
      </button>
      {lecture && <h1>lecture name</h1>}
    </div>
  );
};

export default LeftSection;
