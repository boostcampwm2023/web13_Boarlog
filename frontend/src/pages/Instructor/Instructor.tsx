import Header from "@/components/Header/Header";
import { useEffect } from "react";
import CanvasSection from "@/pages/Test/components/CanvasSection";
import { useToast } from "@/components/Toast/useToast";
import { useNavigate } from "react-router-dom";

const Instructor = () => {
  return (
    <>
      <Header type="instructor" />
      <CanvasSection />
    </>
  );
};

export default Instructor;
