import { useRecoilValue, useRecoilState } from "recoil";
import { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import { ICanvasData, loadCanvasData, updateCanvasSize } from "@/utils/fabricCanvasUtil";
import progressMsTimeState from "@/stores/stateProgressMsTime";

import axios from "axios";

import CloseIcon from "@/assets/svgs/close.svg?react";
import ScriptIcon from "@/assets/svgs/whiteboard/script.svg?react";

import isQuestionLogOpenState from "@/stores/stateIsQuestionLogOpen";

import LogToggleButton from "@/components/Button/LogToggleButton";
import LogContainer from "@/components/LogContainer/LogContainer";
import Header from "@/components/Header/Header";
import ProgressBar from "./components/ProgressBar";

// 추후 해당 다시보기의 전체 플레이 타임을 받아올 수 있어야 할 것 같습니다.
const TOTAL_MS_TIME_OF_REVIEW = 200000;

import SmallButton from "@/components/SmallButton/SmallButton";

const Review = () => {
  const isQuestionLogOpen = useRecoilValue(isQuestionLogOpenState);
  const [progressMsTime, setProgressMsTime] = useRecoilState(progressMsTimeState);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  let fabricCanvasRef = useRef<fabric.Canvas>();
  let canvasCntRef = useRef<number>(0);

  //let loadedData: ICanvasData[] | null = null;

  const [loadedData, setLoadedData] = useState<ICanvasData[] | null>(null);

  let startTime = Date.now();

  const onFrameIdRef = useRef<number | null>(null); // 마이크 볼륨 측정 타이머 id

  let canvasData: ICanvasData = {
    canvasJSON: "",
    viewport: [1, 0, 0, 1, 0, 0],
    eventTime: 0,
    width: 0,
    height: 0
  };

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

    var text = new fabric.Text("다시보기를 불러오고 있습니다", {
      fontSize: 18,
      textAlign: "center",
      originX: "center",
      originY: "center",
      left: canvasContainer.offsetWidth / 2,
      top: canvasContainer.offsetHeight / 2,
      selectable: false
    });
    newCanvas.add(text);

    fabricCanvasRef.current = newCanvas;

    axios("./dummyCanvasData.json")
      .then(({ data }) => {
        setLoadedData(data);
        //loadedData = data;
      })
      .catch((error) => {
        console.log("프롬프트에 표시할 스크립트 로딩 실패", error);
      });

    // 윈도우 리사이즈 이벤트 감지
    const handleResize = () => {
      updateCanvasSize({ fabricCanvas: fabricCanvasRef.current!, whiteboardData: loadedData![canvasCntRef.current] });
    };
    window.addEventListener("resize", handleResize);

    // 언마운트 시 캔버스 정리
    return () => {
      newCanvas.dispose();
    };
  }, []);

  const onFrame = () => {
    const LECTURE_TOTAL_PRAMES = loadedData!.length;
    const eventTime = loadedData![canvasCntRef.current].eventTime;
    const elapsedTime = Date.now() - startTime;
    setProgressMsTime(elapsedTime);
    if (elapsedTime > eventTime) {
      loadCanvasData({
        fabricCanvas: fabricCanvasRef.current!,
        currentData: loadedData![canvasCntRef.current - 1],
        newData: loadedData![canvasCntRef.current]
      });
      canvasCntRef.current += 1;
    }
    if (canvasCntRef.current < LECTURE_TOTAL_PRAMES) onFrameIdRef.current = window.requestAnimationFrame(onFrame);
    else console.log("다시보기 끝");
  };
  const play = () => {
    if (!loadedData) return;
    startTime = Date.now() - progressMsTime;

    if (canvasCntRef.current === 0) {
      canvasCntRef.current = 1;
      loadCanvasData({
        fabricCanvas: fabricCanvasRef.current!,
        currentData: canvasData,
        newData: loadedData[0]
      });
    }
    onFrameIdRef.current = window.requestAnimationFrame(onFrame);
  };
  const pause = () => {
    if (onFrameIdRef.current) window.cancelAnimationFrame(onFrameIdRef.current);
  };

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
        <SmallButton
          className={`absolute text-grayscale-white bg-boarlog-100 bottom-[70px] left-[200px]`}
          onClick={play}
        >
          재생
        </SmallButton>
        <SmallButton
          className={`absolute text-grayscale-white bg-boarlog-100 bottom-[70px] left-[250px]`}
          onClick={pause}
        >
          일시정지
        </SmallButton>
      </section>
    </>
  );
};

export default Review;
