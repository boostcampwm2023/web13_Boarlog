import MouseIcon from "@/assets/svgs/whiteboard/mouse.svg?react";
import PenIcon from "@/assets/svgs/whiteboard/pen.svg?react";
import StickyNoteIcon from "@/assets/svgs/whiteboard/stickyNote.svg?react";
import ImageIcon from "@/assets/svgs/whiteboard/image.svg?react";
import EraserIcon from "@/assets/svgs/whiteboard/eraser.svg?react";
import HandIcon from "@/assets/svgs/whiteboard/hand.svg?react";
import AddStickyNoteCursorSVG from "@/assets/svgs/addStickyMemoCursor.svg";

import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { fabric } from "fabric";

import ToolButton from "./ToolButton";
import ColorPanel from "./ColorPanel";

import canvasInstanceState from "./stateCanvasInstance";

type ToolType = "select" | "pen" | "stickynote" | "image" | "eraser" | "hand";

const Toolbar = () => {
  const [activeTool, setActiveTool] = useState<ToolType>("pen");
  const canvas = useRecoilValue(canvasInstanceState);

  /**
   * @description 화이트 보드에 그려져 있는 요소들을 클릭을 통해 선택 가능한지 여부를 제어하기 위한 함수입니다.
   */
  const setIsObjectSelectable = (isSelectable: boolean) => {
    if (!(canvas instanceof fabric.Canvas)) return;
    canvas.forEachObject((object) => (object.selectable = isSelectable));
  };

  /**
   * @description 캔버스의 옵션을 리셋하는 함수입니다.
   * @description 그래픽 요소 선택 기능: off, 드로잉 모드: off, 드래그 블럭지정모드: off, 커서: 디폴트 포인터
   */
  const resetCanvasOption = () => {
    if (!(canvas instanceof fabric.Canvas)) return;
    setIsObjectSelectable(false);
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = "default";
  };

  const handleStickyNoteTool = () => {
    if (!(canvas instanceof fabric.Canvas)) return;

    canvas.defaultCursor = `url("${AddStickyNoteCursorSVG}"), auto`;

    canvas.on("mouse:down", ({ absolutePointer }: fabric.IEvent<MouseEvent>) => {
      if (!absolutePointer) return;
      const [mousePositionX, mousePositionY] = [absolutePointer.x, absolutePointer.y];

      const note = new fabric.Rect({
        left: mousePositionX,
        top: mousePositionY,
        width: 187,
        height: 133,
        fill: "#FFE196",
        stroke: "black",
        strokeWidth: 1
      });

      const text = new fabric.IText("텍스트 내용", {
        left: mousePositionX + 10,
        top: mousePositionY + 10,
        fill: "black",
        fontSize: 16
      });

      const stickyMemo = new fabric.Group([note, text]);

      canvas.add(stickyMemo);

      setActiveTool("select");
    });
  };

  useEffect(() => {
    if (!(canvas instanceof fabric.Canvas)) return;
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");
    resetCanvasOption();

    switch (activeTool) {
      case "select":
        setIsObjectSelectable(true);
        canvas.selection = true;
        canvas.defaultCursor = "default";
        break;

      case "pen":
        canvas.freeDrawingBrush.width = 10;
        canvas.isDrawingMode = true;
        break;

      case "stickynote":
        handleStickyNoteTool();
        break;

      case "image":
        break;

      case "eraser":
        break;

      case "hand":
        canvas.defaultCursor = "move";

        let panning = false;
        const handleMouseDown = () => {
          panning = true;
        };
        const handleMouseMove = (event: fabric.IEvent<MouseEvent>) => {
          if (panning) {
            const delta = new fabric.Point(event.e.movementX, event.e.movementY);
            canvas.relativePan(delta);
          }
        };
        const handleMouseUp = () => {
          panning = false;
        };
        canvas.on("mouse:down", handleMouseDown);
        canvas.on("mouse:move", handleMouseMove);
        canvas.on("mouse:up", handleMouseUp);
        break;
    }
  }, [activeTool]);

  return (
    <div className="flex flex-col items-center justify-center p-2 gap-1 rounded-xl bg-grayscale-lightgray border border-grayscale-lightgray shadow-md absolute top-2.5 left-2.5">
      <ToolButton
        icon={MouseIcon}
        onClick={() => setActiveTool("select")}
        disabled={activeTool === "select"}
        title="Select Tool"
      />
      <ToolButton
        icon={PenIcon}
        onClick={() => setActiveTool("pen")}
        disabled={activeTool === "pen"}
        title="Pen Tool"
      />
      <ToolButton
        icon={StickyNoteIcon}
        onClick={() => setActiveTool("stickynote")}
        disabled={activeTool === "stickynote"}
        title="Add Stikynote (포스트잇 추가)"
      />
      <ColorPanel className={`${activeTool === "pen" ? "block" : "hidden"}`} />
      <ToolButton
        icon={ImageIcon}
        onClick={() => setActiveTool("image")}
        disabled={activeTool === "image"}
        title="Image Tool"
      />
      <ToolButton
        icon={EraserIcon}
        onClick={() => setActiveTool("eraser")}
        disabled={activeTool === "eraser"}
        title="Eraser Tool"
      />
      <ToolButton
        icon={HandIcon}
        onClick={() => setActiveTool("hand")}
        disabled={activeTool === "hand"}
        title="Hand Tool"
      />
    </div>
  );
};

export default Toolbar;
