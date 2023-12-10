import { useState } from "react";
import Header from "@/components/Header/Header";
import UserAuthSection from "./components/UserAuthSection";

const UserAuth = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <>
      <Header type="login" />
      <UserAuthSection isSignIn={isSignIn} setIsSignIn={setIsSignIn} />
    </>
  );
};

export default UserAuth;
