import Header from "@/components/Header/Header";

import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import videoRefState from "../Test/components/stateVideoRef";
import QuestionPromptLogContainer from "@/components/QuestionPromptLogContainer/QuestionPromptLogContainer";

const Participant = () => {
  const setVideoRef = useSetRecoilState(videoRefState);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setVideoRef(videoRef);
  }, []);

  return (
    <>
      <Header type="participant" />
      <section className="relative">
        <video className="w-[100vw] h-[calc(100vh-6rem)]" autoPlay muted ref={videoRef}></video>
        <QuestionPromptLogContainer type="question" className={"absolute top-2.5 right-2.5"} />
      </section>
    </>
  );
};

export default Participant;
