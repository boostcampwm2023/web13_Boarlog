import { useRecoilValue } from "recoil";
import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { ICanvasData, loadCanvasData } from "@/utils/fabricCanvasUtil";

import axios from "axios";

import CloseIcon from "@/assets/svgs/close.svg?react";
import ScriptIcon from "@/assets/svgs/whiteboard/script.svg?react";

import isQuestionLogOpenState from "@/stores/stateIsQuestionLogOpen";

import LogToggleButton from "@/components/Button/LogToggleButton";
import LogContainer from "@/components/LogContainer/LogContainer";
import Header from "@/components/Header/Header";
import ProgressBar from "./components/ProgressBar";

import SmallButton from "@/components/SmallButton/SmallButton";

const Review = () => {
  const isQuestionLogOpen = useRecoilValue(isQuestionLogOpenState);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  let fabricCanvasRef = useRef<fabric.Canvas>();
  let countRef = useRef<number>(0);

  let loadedData: ICanvasData[] | null = null;
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

    axios("./30secondTest.json")
      .then(({ data }) => {
        loadedData = data;
      })
      .catch((error) => {
        console.log("프롬프트에 표시할 스크립트 로딩 실패", error);
      });

    // 언마운트 시 캔버스 정리
    return () => {
      newCanvas.dispose();
    };
  }, []);

  const load = () => {
    console.log(loadedData![0]);
    loadCanvasData({
      fabricCanvas: fabricCanvasRef.current!,
      currentData: canvasData,
      newData: loadedData![3]
    });
  };

  const play = () => {
    if (!loadedData) return;
    startTime = Date.now();
    countRef.current = 1;
    const LECTURE_TOTAL_PRAMES = loadedData.length;

    loadCanvasData({
      fabricCanvas: fabricCanvasRef.current!,
      currentData: canvasData,
      newData: loadedData[0]
    });
    const onFrame = () => {
      const 데이터시간 = loadedData![countRef.current].eventTime;
      const 지난시간 = Date.now() - startTime;
      console.log(LECTURE_TOTAL_PRAMES, countRef.current, 데이터시간, 지난시간);
      if (지난시간 > 데이터시간) {
        loadCanvasData({
          fabricCanvas: fabricCanvasRef.current!,
          currentData: loadedData![countRef.current - 1],
          newData: loadedData![countRef.current]
        });
        countRef.current += 1;
      }
      if (countRef.current < LECTURE_TOTAL_PRAMES) onFrameIdRef.current = window.requestAnimationFrame(onFrame);
      else console.log("다시보기 끝");
    };
    onFrameIdRef.current = window.requestAnimationFrame(onFrame);
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
        <ProgressBar className="absolute bottom-2.5 left-1/2 -translate-x-1/2" />
        <SmallButton className={`absolute text-grayscale-white bg-boarlog-100 bottom-5 left-1/2`} onClick={load}>
          3
        </SmallButton>
        <SmallButton className={`absolute text-grayscale-white bg-boarlog-100 bottom-0 left-1/2`} onClick={play}>
          재생
        </SmallButton>
      </section>
    </>
  );
};

export default Review;
