import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./global.css";
import Home from "@/pages/Home/Home";
import Login from "./pages/Login/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
