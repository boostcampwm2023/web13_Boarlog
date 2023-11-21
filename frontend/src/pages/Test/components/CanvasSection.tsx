import { fabric } from "fabric";
import { useSetRecoilState } from "recoil";
import { useEffect, useRef } from "react";

import Toolbar from "./Toolbar";
import cavasInstanceState from "./stateCanvasInstance";

const CanvasSection = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setCanvas = useSetRecoilState(cavasInstanceState);

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

    // 언마운트 시 캔버스 정리, 이벤트 제거
    return () => {
      newCanvas.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-[100vw] h-[calc(100vh-6rem)]" ref={canvasContainerRef}>
      <canvas className="" ref={canvasRef} />
      <Toolbar />
    </div>
  );
};

export default CanvasSection;
