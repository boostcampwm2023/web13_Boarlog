import Header from "@/components/Header/Header";

import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import videoRefState from "../Test/components/stateVideoRef";
import LogContainer from "@/components/LogContainer/LogContainer";
import QuestionLogButton from "./components/QuestionLogButton";
import isQuestionLogOpenState from "@/stores/stateIsQuestionLogOpen";
import { useRecoilValue } from "recoil";

const Participant = () => {
  const setVideoRef = useSetRecoilState(videoRefState);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isQuestionLogOpen = useRecoilValue(isQuestionLogOpenState);
  useEffect(() => {
    setVideoRef(videoRef);
  }, []);

  return (
    <>
      <Header type="participant" />
      <section className="relative">
        <video className="w-[100vw] h-[calc(100vh-5rem)]" autoPlay muted ref={videoRef}></video>
        <LogContainer
          type="question"
          className={`absolute top-2.5 right-2.5 ${isQuestionLogOpen ? "block" : "hidden"}`}
        />
        <QuestionLogButton className="absolute top-2.5 right-2.5" />
      </section>
    </>
  );
};

export default Participant;
