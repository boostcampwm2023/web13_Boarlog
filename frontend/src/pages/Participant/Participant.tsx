import Header from "@/components/Header/Header";

import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";

import { fabric } from "fabric";
import participantCavasInstanceState from "@/stores/stateParticipantCanvasInstance";

const Participant = () => {
  //const canvasContainerRef = useRef<HTMLDivElement>(null);
  const setCanvas = useSetRecoilState(participantCavasInstanceState);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    //const canvasContainer = canvasContainerRef.current;
    // 캔버스 생성
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: 150,
      height: 300
    });
    newCanvas.backgroundColor = "gray";

    newCanvas.selection = false;
    newCanvas.defaultCursor = "default";

    /*
    const handleResize = () => {
      newCanvas.setDimensions({
        width: canvasContainer.offsetWidth,
        height: canvasContainer.offsetHeight
      });
      console.log("resize width", canvasContainer.offsetWidth);
    };
    window.addEventListener("resize", handleResize);
    */

    var rect = new fabric.Rect({
      left: 100,
      top: 50,
      fill: "red",
      width: 20,
      height: 20
    });

    // "add" rectangle onto canvas
    newCanvas.add(rect);

    setCanvas(newCanvas);

    newCanvas.backgroundColor = "gray";

    // 언마운트 시 캔버스 정리, 이벤트 제거
    return () => {
      newCanvas.dispose();
      //window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Header type="participant" />
      <canvas ref={canvasRef} />
    </>
  );
};

export default Participant;
