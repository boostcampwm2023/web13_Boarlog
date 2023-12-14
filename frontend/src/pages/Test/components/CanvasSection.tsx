import { fabric } from "fabric";
import { useRecoilValue, useRecoilState } from "recoil";
import { useEffect, useRef } from "react";

import Toolbar from "./Toolbar";
import StickyNoteEditPanel from "./StickyNoteEditPanel";
import QuestionList from "./QuestionList";

import questionListState from "./stateQuestionList";
import canvasInstanceState from "./stateCanvasInstance";
import isQuestionListOpenState from "./stateIsQuestionListOpen";
import instructorSocketRefState from "@/stores/stateInstructorSocketRef";
import stickyNoteEditPanelVisibilityState from "./stateStickyNoteEditPanelVisible";
import isMemoEditingState from "@/stores/stateIsMemoEditing";

const CanvasSection = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useRecoilState(canvasInstanceState);
  const socket = useRecoilValue(instructorSocketRefState);
  const isEditPanelVisible = useRecoilValue(stickyNoteEditPanelVisibilityState);
  const isQuestionListOpen = useRecoilValue(isQuestionListOpenState);
  const [questions, setQuestions] = useRecoilState(questionListState);
  const isMemoEditing = useRecoilValue(isMemoEditingState);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!socket) return;
    socket.on("asked", (data) => {
      setQuestions([{ content: data.content, questionId: data.questionId }, ...questions]);
    });
  }, [socket, questions]);

  useEffect(() => {
    if (!canvasContainerRef.current || !canvasRef.current) return;

    const canvasContainer = canvasContainerRef.current;
    // 캔버스 생성
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: canvasContainer.offsetWidth,
      height: canvasContainer.offsetHeight
    });

    setCanvas(newCanvas);

    newCanvas.backgroundColor = "white";

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

    // 처음 접속했을 때 캔버스에 그리기 가능하도록 설정
    newCanvas.freeDrawingBrush.width = 10;
    newCanvas.isDrawingMode = true;

    // 언마운트 시 캔버스 정리, 이벤트 제거
    return () => {
      newCanvas.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // delete 키를 이용해서 선택된 객체 삭제
    const handleDelete = ({ key, code }: { key: string; code: string }) => {
      if (!canvas) return;
      if (!(code === "Delete" || key === "Delete" || code === "Backspace" || key === "Backspace")) return;
      const activeObjects = canvas!.getActiveObjects();
      if (activeObjects && activeObjects.length > 0) {
        // 선택된 모든 객체 삭제
        activeObjects.forEach((obj) => {
          canvas!.remove(obj);
        });
        canvas!.discardActiveObject(); // 선택 해제
      }
    };

    if (isMemoEditing) {
      window.removeEventListener("keyup", handleDelete);
    } else {
      window.addEventListener("keyup", handleDelete);
    }

    return () => {
      window.removeEventListener("keyup", handleDelete);
    };
  }, [canvas, isMemoEditing]);

  return (
    <div className="relative w-screen h-[calc(100vh-5rem)]" ref={canvasContainerRef}>
      <canvas ref={canvasRef} />

      <Toolbar />
      {isQuestionListOpen && <QuestionList />}
      {isEditPanelVisible && <StickyNoteEditPanel />}
    </div>
  );
};

export default CanvasSection;
