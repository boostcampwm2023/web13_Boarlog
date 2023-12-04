import Header from "@/components/Header/Header";

import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import videoRefState from "../Test/components/stateVideoRef";

const Participant = () => {
  const setVideoRef = useSetRecoilState(videoRefState);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setVideoRef(videoRef);
  }, []);

  return (
    <>
      <Header type="participant" />
      <video className="relative w-[100vw] h-[calc(100vh-6rem)]" autoPlay muted ref={videoRef}></video>
    </>
  );
};

export default Participant;
