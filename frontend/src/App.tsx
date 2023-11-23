import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./global.css";
import Home from "@/pages/Home/Home";
import Login from "./pages/Login/Login";
import Test from "./pages/Test/Test";
import MicTest from "./pages/MicTest/MicTest";

import { RecoilRoot } from "recoil";
import Example from "./pages/Example/Example";

import ToastContainer from "./components/Toast/ToastContainer";

const App = () => {
  return (
    <RecoilRoot>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<Test />} />
          <Route path="/mictest" element={<MicTest />} />
          <Route path="/example" element={<Example />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default App;
