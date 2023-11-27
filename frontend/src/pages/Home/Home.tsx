import Header from "@/components/Header/Header";
import MainCard from "./components/MainCard";

const Home = () => {
  return (
    <>
      <Header type="main" />
      <section className="flex flex-col my-20 items-center justify-center">
        <h1 className="semibold-64 mb-2">시작하기</h1>
        <p className="semibold-20 text-grayscale-darkgray">볼록과 함께 실시간 강의를 경험해보세요.</p>
        <div className="flex flex-col items-center justify-center gap-8 mt-16 hm:flex-row w-full">
          <MainCard />
          <MainCard />
        </div>
      </section>
    </>
  );
};

export default Home;
