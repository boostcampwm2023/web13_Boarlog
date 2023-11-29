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
      <div className="relative w-[100vw] h-[calc(100vh-6rem)]">
        <video controls autoPlay muted height="500px" width="500px" ref={videoRef}></video>
      </div>
    </>
  );
};

export default Participant;
