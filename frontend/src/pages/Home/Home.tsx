import Header from "@/components/Header/Header";
import GoogleIcon from "@/assets/svgs/google.svg?react";
import logoImg from "@/assets/imgs/joinLecture.png";

const Home = () => {
  return (
    <>
      <Header main />
      <div>
        <GoogleIcon className="w-[50px] h-auto" />
        <img src={logoImg} />
        <h1 className="medium-12 text-boarlog-100">Home</h1>
      </div>
    </>
  );
};

export default Home;
