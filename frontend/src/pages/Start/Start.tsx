import Header from "@/components/Header/Header";
import StartSection from "./components/StartSection";

const Start = () => {
  return (
    <>
      <Header type="login" />
      <div className="flex flex-1 items-center justify-center h-[calc(100vh-6rem)]">
        <StartSection profileImage={""} />
      </div>
    </>
  );
};

export default Start;
