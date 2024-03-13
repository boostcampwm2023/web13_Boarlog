import { useRecoilValue, useRecoilState } from "recoil";
import { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useLocation } from "react-router-dom";
import axios from "axios";

import { ICanvasData, loadCanvasData, updateCanvasSize } from "@/utils/fabricCanvasUtil";

import CloseIcon from "@/assets/svgs/close.svg?react";
import ScriptIcon from "@/assets/svgs/whiteboard/script.svg?react";

import progressMsTimeState from "@/stores/stateProgressMsTime";
import isQuestionLogOpenState from "@/stores/stateIsQuestionLogOpen";

import LogToggleButton from "@/components/Button/LogToggleButton";
import LogContainer from "@/components/LogContainer/LogContainer";
import Header from "@/components/Header/Header";
import ProgressBar from "./components/ProgressBar";
import { useToast } from "@/components/Toast/useToast";

const Review = () => {
  const [progressBarState, setProgressBarState] = useState<"disabled" | "playing" | "paused">("disabled");
  const isQuestionLogOpen = useRecoilValue(isQuestionLogOpenState);
  const [progressMsTime, setProgressMsTime] = useRecoilState(progressMsTimeState);
  const showToast = useToast();

  const loadedDataRef = useRef<ICanvasData[]>();
  const scriptListRef = useRef<Array<{ start: string; text: string }>>();
  const onFrameIdRef = useRef<number | null>(null); // 마이크 볼륨 측정 타이머 id
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  let fabricCanvasRef = useRef<fabric.Canvas>();
  let canvasCntRef = useRef<number>(0);
  let totalTimeRef = useRef<number>(0);

  const lectureId = new URLSearchParams(useLocation().search).get("id") || "nodata";
  let startTime = Date.now();
  let canvasData: ICanvasData = {
    objects: new Uint8Array(0),
    viewport: [0, 0, 0, 0, 0, 0],
    eventTime: 0,
    width: 0,
    height: 0
  };

  useEffect(() => {
    handleInitCanvas();
    handleLoadData();
    window.addEventListener("resize", handleResize);
    return () => {
      fabricCanvasRef.current!.dispose();
      window.addEventListener("resize", handleResize);
    };
  }, []);
  // 윈도우 리사이즈 이벤트 감지
  const handleInitCanvas = () => {
    if (!canvasContainerRef.current || !canvasRef.current) return;
    const canvasContainer = canvasContainerRef.current;
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasContainer.offsetWidth,
      height: canvasContainer.offsetHeight,
      selection: false
    });
    newCanvas.backgroundColor = "lightgray";

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
  };
  const handleLoadData = () => {
    axios
      .get(`${import.meta.env.VITE_API_SERVER_URL}/lecture/record/${lectureId}`)
      .then((result) => {
        console.log(result.data.logs);
        loadedDataRef.current = result.data.logs;
        scriptListRef.current = result.data.subtitles;
        localAudioRef.current!.src = result.data.audio_file;
        localAudioRef.current!.addEventListener("loadedmetadata", () => {
          totalTimeRef.current = localAudioRef.current!.duration * 1000;
        });
        setProgressBarState("paused");
      })
      .catch(() => {
        showToast({ message: "강의 데이터를 불러오는 데 실패했습니다.", type: "alert" });
      });
  };
  const handleResize = () => {
    updateCanvasSize({
      fabricCanvas: fabricCanvasRef.current!,
      whiteboardData: loadedDataRef.current![canvasCntRef.current]
    });
  };

  const onFrame = () => {
    const LECTURE_TOTAL_PRAMES = loadedDataRef.current!.length;
    const eventTime = loadedDataRef.current![canvasCntRef.current]?.eventTime;
    const elapsedTime = Date.now() - startTime;
    setProgressMsTime(elapsedTime);
    if (elapsedTime > eventTime && canvasCntRef.current < LECTURE_TOTAL_PRAMES) {
      loadCanvasData({
        fabricCanvas: fabricCanvasRef.current!,
        currentData: loadedDataRef.current![canvasCntRef.current - 1],
        newData: loadedDataRef.current![canvasCntRef.current]
      });
      canvasCntRef.current += 1;
    }
    if (elapsedTime < totalTimeRef.current) onFrameIdRef.current = window.requestAnimationFrame(onFrame);
    else {
      setProgressBarState("paused");
      setProgressMsTime(0);
      canvasCntRef.current = 0;
    }
  };

  const play = () => {
    if (!loadedDataRef.current) return;
    startTime = Date.now() - progressMsTime;
    if (canvasCntRef.current === 0) {
      canvasCntRef.current = 1;
      loadCanvasData({
        fabricCanvas: fabricCanvasRef.current!,
        currentData: canvasData,
        newData: loadedDataRef.current[0]
      });
    }
    onFrameIdRef.current = window.requestAnimationFrame(onFrame);
    localAudioRef.current!.play();
    setProgressBarState("playing");
  };
  const pause = () => {
    if (onFrameIdRef.current) window.cancelAnimationFrame(onFrameIdRef.current);

    localAudioRef.current!.pause();
    setProgressBarState("paused");
  };

  // target시간보다 작고 target시간과 가장 가까운 이벤트 시간을 가진 데이터의 인덱스를 반환하는 함수입니다.
  const findClosest = (data: ICanvasData[], target: number) => {
    // 시간 나면 binary search로 개선하겠습니다.
    let closestSmallerIndex = -1;

    for (let i = 0; i < data.length; i++) {
      if (
        data[i].eventTime < target &&
        (closestSmallerIndex === -1 || data[i].eventTime > data[closestSmallerIndex].eventTime)
      ) {
        closestSmallerIndex = i;
      }
    }

    return closestSmallerIndex >= 0 ? closestSmallerIndex : 0;
  };

  // logContainer에서 프롬프트를 클릭하거나 프로그래스 바를 클릭했을 때 진행시간을 조정하는 함수입니다.
  const updateProgressMsTime = (newProgressMsTime: number) => {
    setProgressMsTime(newProgressMsTime);
    pause();
    const newCanvasCntRef = findClosest(loadedDataRef.current!, newProgressMsTime);

    loadCanvasData({
      fabricCanvas: fabricCanvasRef.current!,
      currentData: canvasData,
      newData: loadedDataRef.current![newCanvasCntRef]
    });
    canvasCntRef.current = newCanvasCntRef + 1;

    startTime = Date.now() - newProgressMsTime;
    localAudioRef.current!.currentTime = newProgressMsTime / 1000;
  };

  return (
    <>
      <Header type="review" />
      <section className="relative w-screen h-[calc(100vh-5rem)]" ref={canvasContainerRef}>
        <canvas className="-z-10" ref={canvasRef} />
        <LogContainer
          type="prompt"
          className={`absolute top-2.5 right-2.5 ${isQuestionLogOpen ? "block" : "hidden"}`}
          scriptList={scriptListRef.current}
          updateProgressMsTime={updateProgressMsTime}
        />
        <LogToggleButton className="absolute top-2.5 right-2.5">
          {isQuestionLogOpen ? <CloseIcon /> : <ScriptIcon fill="black" />}
        </LogToggleButton>
        <ProgressBar
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2"
          totalTime={totalTimeRef.current}
          progressBarState={progressBarState}
          play={play}
          pause={pause}
          updateProgressMsTime={updateProgressMsTime}
        />
      </section>
      <audio playsInline ref={localAudioRef}></audio>
    </>
  );
};

export default Review;
