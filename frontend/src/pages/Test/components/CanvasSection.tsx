import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";

const CanvasSection = () => {
  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [isPenActive, setIsPenActive] = useState(false);

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

  // 펜모드 토글
  const handlePenToggle = () => {
    canvas.freeDrawingBrush.width = 10;
    canvas.isDrawingMode = !canvas.isDrawingMode;
    setIsPenActive(!isPenActive);
  };

  const erase = () => {
    canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
    canvas.freeDrawingBrush.width = 10;
    canvas.isDrawingMode = true;
    //canvas.freeDrawingBrush.width = 40;
    //canvas.freeDrawingBrush.color = "white";

    //canvas.freeDrawingBrush.globalCompositeOperation = "destination-out";

    //
    setIsPenActive(true);
  };

  return (
    <div className="relative w-[100vw] h-[80vh]" ref={canvasContainerRef}>
      <canvas className="border border-alert-100" ref={canvasRef} />
      <div className="flex flex-col items-center justify-center flex-1 w-20 h-[300px] flex-shrink-0 rounded-[10px] bg-slate-800   shadow-md absolute top-2.5 left-2.5">
        <button className=" w-8 h-8 text-white" onClick={addRectangle}>
          사각
        </button>
        <br />
        <button className="w-8 h-8 text-white" onClick={addText}>
          T
        </button>
        <br />
        <button className=" w-8 h-8 text-white" onClick={handlePenToggle}>
          {isPenActive ? "취소" : "펜"}
        </button>
        <br />
        <button className="w-8 h-8 text-white" onClick={erase}>
          지워
        </button>
      </div>
    </div>
  );
};

export default CanvasSection;
