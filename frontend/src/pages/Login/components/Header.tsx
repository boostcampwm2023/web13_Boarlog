import logoSmall from "@/assets/imgs/logoSmall.png";

const Header = () => {
  return (
    <header className="flex w-screen items-center justify-between px-6 py-4 bg-white border-header box-border">
      <button type="button" className="flex flex-row items-center gap-4 semibold-20">
        <img src={logoSmall} />
        <h1>Boarlog</h1>
      </button>
      <button type="button" className="medium-16">
        Boarlog 체험하기
      </button>
    </header>
  );
};

export default Header;
