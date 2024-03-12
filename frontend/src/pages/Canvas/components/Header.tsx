import logoSmall from "@/assets/imgs/logoSmall.png";

const Header = () => {
  return (
    <header className="flex w-100 h-20 items-center justify-between px-6 py-4 bg-grayscale-white border-header box-border z-10 sticky top-0">
      <div className="flex flex-row items-center gap-4 semibold-20" >
        <img src={logoSmall} />
        <h1>Boarlog 화이트보드 체험하기</h1>
      </div>
    </header>
  );
};

export default Header;
