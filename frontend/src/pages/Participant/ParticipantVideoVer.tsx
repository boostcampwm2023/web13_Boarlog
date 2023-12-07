// 완전하게 비디오 방식으로 전달하는 것을 포기하게 되면 삭제하겠습니다.

import Header from "@/components/Header/Header";

import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import videoRefState from "../Test/components/stateVideoRef";
import LogContainer from "@/components/LogContainer/LogContainer";

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
        <video className="w-[100vw] h-[calc(100vh-5rem)]" autoPlay muted ref={videoRef}></video>
        <LogContainer type="question" className={"absolute top-2.5 right-2.5"} />
      </section>
    </>
  );
};

export default Participant;
