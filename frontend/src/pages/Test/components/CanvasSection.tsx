import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";

import Toolbar from "./Toolbar";

const CanvasSection = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState("pen");

  useEffect(() => {
    if (!canvasContainerRef.current || !canvasRef.current) return;

    const canvasContainer = canvasContainerRef.current;
    // 캔버스 생성
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasContainer.offsetWidth,
      height: canvasContainer.offsetHeight
    });

    setCanvas(newCanvas);

    // 휠을 이용해서 줌인/줌아웃
    newCanvas.on("mouse:wheel", function (opt) {
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

  const setSelectMode = () => {
    if (!(canvas instanceof fabric.Canvas)) return;
    canvas.isDrawingMode = false;
    setActiveTool("select");
  };
  const setPenMode = () => {
    if (!(canvas instanceof fabric.Canvas)) return;
    canvas.freeDrawingBrush.width = 10;
    canvas.isDrawingMode = true;
    setActiveTool("pen");
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

      <Toolbar
        activeTool={activeTool}
        setSelectMode={setSelectMode}
        setPenMode={setPenMode}
        addRectangle={addRectangle}
        erase={erase}
      />
    </div>
  );
};

export default CanvasSection;
