import Header from "@/components/Header/Header";
import Button from "@/components/Button/Button";

const Home = () => {
  return (
    <>
      <Header type="login" />
      <Header type="main" />
      <Header type="instructor" />
      <div>
        <Button type="fit" className="bg-grayscale-black text-grayscale-white">
          내부 요소 기준 맞춤 버튼
        </Button>
        <Button type="full" className="bg-alert-100 text-grayscale-white">
          상위 컴포넌트 요소 맞춤 버튼
        </Button>
        <div className="w-[700px] flex flex-row">
          <Button type="grow" className="bg-grayscale-black text-grayscale-white">
            1
          </Button>
          <Button type="grow" className="bg-boarlog-100 text-grayscale-white">
            2
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
