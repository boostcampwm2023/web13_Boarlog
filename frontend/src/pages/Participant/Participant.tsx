import { useEffect, useRef } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { fabric } from "fabric";

import Header from "@/components/Header/Header";
import participantCavasInstanceState from "@/stores/stateParticipantCanvasInstance";
import QuestionLogButton from "./components/QuestionLogButton";
import LogContainer from "@/components/LogContainer/LogContainer";
import isQuestionLogOpenState from "@/stores/stateIsQuestionLogOpen";

const Participant = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const setCanvas = useSetRecoilState(participantCavasInstanceState);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isQuestionLogOpen = useRecoilValue(isQuestionLogOpenState);
  useEffect(() => {
    if (!canvasContainerRef.current || !canvasRef.current) return;

    const canvasContainer = canvasContainerRef.current;
    // 캔버스 생성
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasContainer.offsetWidth,
      height: canvasContainer.offsetHeight,
      selection: false
    });
    newCanvas.backgroundColor = "lightgray";
    newCanvas.defaultCursor = "default";

    var text = new fabric.Text("화이트보드를 불러오고 있습니다", {
      fontSize: 18,
      textAlign: "center",
      originX: "center",
      originY: "center",
      left: canvasContainer.offsetWidth / 2,
      top: canvasContainer.offsetHeight / 2,
      selectable: false
    });
    newCanvas.add(text);

    setCanvas(newCanvas);

    // 언마운트 시 캔버스 정리
    return () => {
      newCanvas.dispose();
    };
  }, []);

  return (
    <>
      <Header type="participant" />
      <section className="relative w-screen h-[calc(100vh-5rem)]" ref={canvasContainerRef}>
        <canvas ref={canvasRef} />
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
