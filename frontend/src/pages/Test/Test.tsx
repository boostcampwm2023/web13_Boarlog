import Header from "./components/Header";
import CanvasSection from "./components/CanvasSection";

const Test = () => {
  return (
    <>
      <Header />
      <div className="flex flex-1 items-center justify-center h-[calc(100vh-80px)]">
        <CanvasSection />
      </div>
    </>
  );
};

export default Test;
