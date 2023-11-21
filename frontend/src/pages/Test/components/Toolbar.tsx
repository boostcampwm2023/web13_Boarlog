import MouseIcon from "@/assets/svgs/whiteboard/mouse.svg?react";
import PenIcon from "@/assets/svgs/whiteboard/pen.svg?react";
import StickyNoteIcon from "@/assets/svgs/whiteboard/stickyNote.svg?react";
import ImageIcon from "@/assets/svgs/whiteboard/image.svg?react";
import EraserIcon from "@/assets/svgs/whiteboard/eraser.svg?react";
import HandIcon from "@/assets/svgs/whiteboard/hand.svg?react";

import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { fabric } from "fabric";

import ToolButton from "./ToolButton";
import ColorPanel from "./ColorPanel";

import canvasInstanceState from "./stateCanvasInstance";

const Toolbar = () => {
  const [activeTool, setActiveTool] = useState("pen");
  const canvas = useRecoilValue(canvasInstanceState);

  useEffect(() => {
    if (!(canvas instanceof fabric.Canvas)) return;
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");

    switch (activeTool) {
      case "select":
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = "default";
        break;

      case "pen":
        canvas.freeDrawingBrush.width = 10;
        canvas.isDrawingMode = true;
        break;

      case "addstickynote":
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
        break;

      case "erase":
        break;

      case "hand":
        canvas.isDrawingMode = false;
        canvas.selection = false;
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
    <div className="flex flex-col items-center justify-center p-2 gap-1 rounded-[10px] bg-grayscale-lightgray border border-grayscale-lightgray shadow-md absolute top-2.5 left-2.5">
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
        onClick={() => setActiveTool("addstickynote")}
        disabled={activeTool === "addstickynote"}
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
