import { useSetRecoilState, useRecoilValue } from "recoil";
import { useEffect, useRef } from "react";

import CloseIcon from "@/assets/svgs/close.svg?react";
import ScriptIcon from "@/assets/svgs/whiteboard/script.svg?react";

import isQuestionLogOpenState from "@/stores/stateIsQuestionLogOpen";
import videoRefState from "../Test/components/stateVideoRef";

import LogToggleButton from "@/components/Button/LogToggleButton";
import LogContainer from "@/components/LogContainer/LogContainer";
import Header from "@/components/Header/Header";
import ProgressBar from "./components/ProgressBar";

const Review = () => {
  const setVideoRef = useSetRecoilState(videoRefState);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isQuestionLogOpen = useRecoilValue(isQuestionLogOpenState);

  useEffect(() => {
    setVideoRef(videoRef);
  }, []);

  return (
    <>
      <Header type="review" />
      <section className="relative">
        <video className="w-[100vw] h-[calc(100vh-5rem)]" autoPlay muted ref={videoRef}></video>
        <LogContainer
          type="prompt"
          className={`absolute top-2.5 right-2.5 ${isQuestionLogOpen ? "block" : "hidden"}`}
        />
        <LogToggleButton className="absolute top-2.5 right-2.5">
          {isQuestionLogOpen ? <CloseIcon /> : <ScriptIcon fill="black" />}
        </LogToggleButton>
        <ProgressBar className="absolute bottom-2.5 left-1/2 -translate-x-1/2" />
      </section>
    </>
  );
};

export default Review;
