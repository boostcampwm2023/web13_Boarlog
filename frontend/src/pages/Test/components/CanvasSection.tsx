import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";

const LoginSection = () => {
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
        width: 187,
        height: 133,
        backgroundColor: "#FFE196"
      });

      canvas.add(text);
    }
  };
  const handlePenToggle = () => {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    setIsPenActive(!isPenActive);
  };

  return (
    <div className="relative w-[90vw] h-[90vh] overflow-hidden" ref={canvasContainerRef}>
      <canvas className="border border-alert-100" ref={canvasRef} />
      <div className="flex flex-col items-center justify-center flex-1 w-20 h-[257px] flex-shrink-0 rounded-[10px] bg-slate-800   shadow-md absolute top-2.5 left-2.5">
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
      </div>
    </div>
  );
};

export default LoginSection;
