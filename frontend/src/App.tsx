import "./global.css";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ToastContainer from "./components/Toast/ToastContainer";

import Home from "@/pages/Home/Home";
import UserAuth from "./pages/UserAuth/UserAuth";
import Start from "./pages/Start/Start";
import MyPage from "./pages/MyPage/MyPage";
import Instructor from "./pages/Instructor/Instructor";
import Participant from "./pages/Participant/Participant";
import Review from "./pages/Review/Review";
import LectureEnd from "./pages/LectureEnd/LectureEnd";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import CanvasPage from "./pages/Canvas/CanvasPage";

const App = () => {
  return (
    <RecoilRoot>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/userauth" element={<UserAuth />} />
          <Route path="/start" element={<Start />} />
          <Route path="/mypage" element={<MyPage />} />
          {!Modernizr.touchevents && <Route path="/instructor" element={<Instructor />} />}
          <Route path="/participant" element={<Participant />} />
          <Route path="/review" element={<Review />} />
          <Route path="/lecture-end" element={<LectureEnd />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/*" element={<Navigate to="/error" />} />
          <Route path="/canvas" element={<CanvasPage />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default App;
