import Header from "@/components/Header/Header";

import { useEffect, useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
import videoRefState from "../Test/components/stateVideoRef";
import LogContainer from "@/components/LogContainer/LogContainer";

const ParticipantSection = () => {
  const setVideoRef = useSetRecoilState(videoRefState);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);
  useEffect(() => {
    if (didMount) {
      console.log("videoRef");
      setVideoRef(videoRef);
    }
  }, [didMount]);
  return (
    <section className="relative">
      <video className="w-[100vw] h-[calc(100vh-5rem)]" autoPlay muted ref={videoRef}></video>
      <LogContainer type="question" className={"absolute top-2.5 right-2.5"} />
    </section>
  );
};

export default ParticipantSection;
