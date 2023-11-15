import logoSmall from "@/assets/imgs/logoSmall.png";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-header">
      <button type="button" className="flex flex-row items-center gap-4 semibold-20">
        <img src={logoSmall} />
        Boarlog
      </button>
      <button type="button" className="medium-16">
        Boarlog 체험하기
      </button>
    </header>
  );
};

export default Header;
