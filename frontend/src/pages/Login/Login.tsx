import Header from "@/components/Header/Header";
import LoginSection from "./components/LoginSection";

const Login = () => {
  return (
    <>
      <Header type="login" />
      <div className="flex flex-1 items-center justify-center h-[calc(100vh-6rem)]">
        <LoginSection />
      </div>
    </>
  );
};

export default Login;
