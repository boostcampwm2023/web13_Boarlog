import { useRecoilValue } from "recoil";
import { useEffect, useRef } from "react";
import { fabric } from "fabric";

import CloseIcon from "@/assets/svgs/close.svg?react";
import ScriptIcon from "@/assets/svgs/whiteboard/script.svg?react";

import isQuestionLogOpenState from "@/stores/stateIsQuestionLogOpen";

import LogToggleButton from "@/components/Button/LogToggleButton";
import LogContainer from "@/components/LogContainer/LogContainer";
import Header from "@/components/Header/Header";
import ProgressBar from "./components/ProgressBar";

// 추후 해당 다시보기의 전체 플레이 타임을 받아올 수 있어야 할 것 같습니다.
const TOTAL_MS_TIME_OF_REVIEW = 60000;

const Review = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
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

    // 언마운트 시 캔버스 정리
    return () => {
      newCanvas.dispose();
    };
  }, []);

  return (
    <>
      <Header type="review" />
      <section className="relative w-screen h-[calc(100vh-5rem)]" ref={canvasContainerRef}>
        <canvas className="-z-10" ref={canvasRef} />
        <LogContainer
          type="prompt"
          className={`absolute top-2.5 right-2.5 ${isQuestionLogOpen ? "block" : "hidden"}`}
        />
        <LogToggleButton className="absolute top-2.5 right-2.5">
          {isQuestionLogOpen ? <CloseIcon /> : <ScriptIcon fill="black" />}
        </LogToggleButton>
        <ProgressBar className="absolute bottom-2.5 left-1/2 -translate-x-1/2" totalTime={TOTAL_MS_TIME_OF_REVIEW} />
      </section>
    </>
  );
};

export default Review;
