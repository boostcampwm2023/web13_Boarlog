import Header from "@/components/Header/Header";

import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";

import { fabric } from "fabric";
import participantCavasInstanceState from "@/stores/stateParticipantCanvasInstance";
import QuestionLogButton from "./components/QuestionLogButton";
import LogContainer from "@/components/LogContainer/LogContainer";
import isQuestionLogOpenState from "@/stores/stateIsQuestionLogOpen";
import { useRecoilValue } from "recoil";

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

    newCanvas.selection = false;
    newCanvas.defaultCursor = "default";

    // "화이트보드를 불러오고 있습니다" 텍스트 생성
    var text = new fabric.Text("화이트보드를 불러오고 있습니다", {
      fontSize: 18,
      textAlign: "center",
      originX: "center",
      originY: "center",
      left: canvasContainer.offsetWidth / 2,
      top: canvasContainer.offsetHeight / 2,
      selectable: false // 선택 불가능하도록 설정
    });

    // "add" rectangle onto canvas
    newCanvas.add(text);

    setCanvas(newCanvas);

    // 언마운트 시 캔버스 정리, 이벤트 제거
    return () => {
      newCanvas.dispose();
      //window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Header type="participant" />
      <div className="relative w-[100vw] h-[calc(100vh-5rem)]" ref={canvasContainerRef}>
        <canvas ref={canvasRef} />
        <LogContainer
          type="question"
          className={`absolute top-2.5 right-2.5 ${isQuestionLogOpen ? "block" : "hidden"}`}
        />
        <QuestionLogButton className="absolute top-2.5 right-2.5" />
      </div>
    </>
  );
};

export default Participant;
