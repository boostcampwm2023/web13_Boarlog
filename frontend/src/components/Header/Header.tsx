import LeftSection from "./components/LeftSection";
import RightSection from "./components/RightSection";

interface HeaderProps {
  lecture?: boolean;
  login?: boolean;
  main?: boolean;
}

const Header: React.FC<HeaderProps> = ({ lecture, login, main }) => {
  return (
    <header className="flex w-100 items-center justify-between px-6 py-4 bg-white border-header box-border">
      <LeftSection lecture={lecture} />
      <RightSection login={login} main={main} />
    </header>
  );
};

export default Header;
