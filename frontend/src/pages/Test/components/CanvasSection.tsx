import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";

import MouseIcon from "@/assets/svgs/whiteboard/mouse.svg?react";
import PenIcon from "@/assets/svgs/whiteboard/pen.svg?react";
import StickyNoteIcon from "@/assets/svgs/whiteboard/stickyNote.svg?react";
import ImageIcon from "@/assets/svgs/whiteboard/image.svg?react";
import EraserIcon from "@/assets/svgs/whiteboard/eraser.svg?react";

const CanvasSection = () => {
  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [isMouseActive, setIsMouseActive] = useState(false);
  const [isPenActive, setIsPenActive] = useState(true);

  useEffect(() => {
    const canvasContainer = canvasContainerRef.current;
    // 캔버스 생성
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasContainer.offsetWidth,
      height: canvasContainer.offsetHeight
    });

    setCanvas(newCanvas);

    // 이벤트 처리

    newCanvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = newCanvas.getZoom();
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
      // 필요에 따라 다른 갱신 작업 수행
      newCanvas.renderAll();
    };
    window.addEventListener("resize", handleResize);

    const handleDelete = () => {
      const activeObjects = newCanvas.getActiveObjects();
      if (activeObjects && activeObjects.length > 0) {
        // 선택된 모든 객체 삭제
        activeObjects.forEach((obj) => {
          newCanvas.remove(obj);
        });
        newCanvas.discardActiveObject(); // 선택 해제
        //newCanvas.renderAll();
      }
    };
    window.addEventListener("keydown", (e) => {
      // Delete 키의 keyCode 또는 key를 확인하여 처리
      if (e.code === "Delete" || e.key === "Delete") {
        handleDelete();
      }
    });

    // 언마운트 시 캔버스 정리, 이벤트 제거
    return () => {
      newCanvas.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const addRectangle = () => {
    if (canvas) {
      // 버튼 클릭 시 새로운 사각형 추가
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: 187,
        height: 133,
        fill: "#FFE196",
        stroke: "black",
        strokeWidth: 1
      });

      canvas.add(rect);
    }
  };

  const addText = () => {
    if (canvas) {
      const text = new fabric.IText("편집 가능한 텍스트", {
        left: 300,
        top: 300,
        fill: "blue",
        fontSize: 20,
        fontFamily: "Pretendard",
        backgroundColor: "#FFE196"
      });

      canvas.add(text);
    }
  };

  const setDragMode = () => {
    canvas.isDrawingMode = false;
    setIsMouseActive(!isMouseActive);
    if (isPenActive) {
      setIsPenActive(!isPenActive);
    }
  };
  const setPenMode = () => {
    canvas.freeDrawingBrush.width = 10;
    canvas.isDrawingMode = true;
    setIsPenActive(!isPenActive);
    if (isMouseActive) {
      setIsMouseActive(!isMouseActive);
    }
  };

  const erase = () => {
    /*
    아 어렵다
    canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
    canvas.freeDrawingBrush.width = 10;
    canvas.isDrawingMode = true;
    //canvas.freeDrawingBrush.width = 40;
    //canvas.freeDrawingBrush.color = "white";
    //canvas.freeDrawingBrush.globalCompositeOperation = "destination-out";
    setIsPenActive(true);
    */
  };

  return (
    <div className="relative w-[100vw] h-[calc(100vh-6rem)]" ref={canvasContainerRef}>
      <canvas className="" ref={canvasRef} />
      <div className="flex flex-col items-center justify-center p-2 gap-1 rounded-[10px] bg-grayscale-lightgray border border-grayscale-lightgray shadow-md absolute top-2.5 left-2.5">
        <button
          className="flex p-2 items-center justify-center rounded-[10px] disabled:bg-boarlog-80 group"
          onClick={setDragMode}
          disabled={isMouseActive}
        >
          <MouseIcon className="group-disabled:fill-white" />
        </button>
        <button
          className="flex p-2 items-center justify-center rounded-[10px] disabled:bg-boarlog-80 group"
          onClick={setPenMode}
          disabled={isPenActive}
        >
          <PenIcon className="group-disabled:fill-white" />
        </button>
        <button className="flex p-2 items-center justify-center rounded-[10px]" onClick={addRectangle}>
          <StickyNoteIcon />
        </button>
        <button className="flex p-2 items-center justify-center rounded-[10px]" onClick={erase}>
          <ImageIcon />
        </button>
        <button className="flex p-2 items-center justify-center rounded-[10px]" onClick={erase}>
          <EraserIcon />
        </button>
      </div>
    </div>
  );
};

export default CanvasSection;
