import { fabric } from "fabric";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useRef } from "react";

import Toolbar from "./Toolbar";
import StickyNoteEditPanel from "./StickyNoteEditPanel";
import cavasInstanceState from "./stateCanvasInstance";
import stickyNoteEditPanelVisibilityState from "./stateStickyNoteEditPanelVisible";

import canvasRefState from "./stateCanvasRef";

const CanvasSection = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const setCanvas = useSetRecoilState(cavasInstanceState);
  const isEditPanelVisible = useRecoilValue(stickyNoteEditPanelVisibilityState);

  const setCanvasRef = useSetRecoilState(canvasRefState);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    /*
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#009ac8";

    // create / rectangle / at a 100, 100 point, with 20x20 dimensions.
    ctx.fillRect(1, 1, 202, 205);

    var canvas = new fabric.Canvas(canvasRef.current);

    // create a rectangle object
    var rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: "red",
      width: 20,
      height: 20
    });

    // "add" rectangle onto canvas
    canvas.add(rect);

    console.log("보낸다이", canvasRef.current);
    setCanvasRef({ current: canvasRef.current });
    */
  }, [setCanvasRef, canvasRef]);

  useEffect(() => {
    if (!canvasContainerRef.current || !canvasRef.current) return;

    const canvasContainer = canvasContainerRef.current;
    // 캔버스 생성

    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasContainer.offsetWidth,
      height: canvasContainer.offsetHeight
    });

    newCanvas.backgroundColor = "lightgray";
    newCanvas.renderAll();

    // 휠을 이용해서 줌인/줌아웃
    newCanvas.on("mouse:wheel", (opt) => {
      const delta = opt.e.deltaY;
      let zoom = newCanvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      newCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    // 윈도우 리사이즈 이벤트 감지
    const handleResize = () => {
      newCanvas.setDimensions({
        width: canvasContainer.offsetWidth,
        height: canvasContainer.offsetHeight
      });
    };
    window.addEventListener("resize", handleResize);

    // delete 키를 이용해서 선택된 객체 삭제
    const handleDelete = () => {
      const activeObjects = newCanvas.getActiveObjects();
      if (activeObjects && activeObjects.length > 0) {
        // 선택된 모든 객체 삭제
        activeObjects.forEach((obj) => {
          newCanvas.remove(obj);
        });
        newCanvas.discardActiveObject(); // 선택 해제
      }
    };
    window.addEventListener("keydown", (e) => {
      if (e.code === "Delete" || e.key === "Delete") {
        handleDelete();
      }
    });

    // 처음 접속했을 때 캔버스에 그리기 가능하도록 설정
    newCanvas.freeDrawingBrush.width = 10;
    newCanvas.isDrawingMode = true;

    console.log("보낸다이", canvasRef.current);
    setCanvasRef({ current: canvasRef.current });

    // 언마운트 시 캔버스 정리, 이벤트 제거
    return () => {
      newCanvas.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-[100vw] h-[calc(100vh-6rem)]" ref={canvasContainerRef}>
      <canvas ref={canvasRef} />
      <Toolbar />
      {isEditPanelVisible && <StickyNoteEditPanel />}
    </div>
  );
};

export default CanvasSection;
