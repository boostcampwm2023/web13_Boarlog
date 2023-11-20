import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./global.css";
import Home from "@/pages/Home/Home";
import Login from "./pages/Login/Login";
import Test from "./pages/Test/Test";
import MicTest from "./pages/MicTest/MicTest";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Test />} />
        <Route path="/mictest" element={<MicTest />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
