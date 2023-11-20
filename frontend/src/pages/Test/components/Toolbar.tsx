import MouseIcon from "@/assets/svgs/whiteboard/mouse.svg?react";
import PenIcon from "@/assets/svgs/whiteboard/pen.svg?react";
import StickyNoteIcon from "@/assets/svgs/whiteboard/stickyNote.svg?react";
import ImageIcon from "@/assets/svgs/whiteboard/image.svg?react";
import EraserIcon from "@/assets/svgs/whiteboard/eraser.svg?react";
import HandIcon from "@/assets/svgs/whiteboard/hand.svg?react";

import ToolButton from "./ToolButton";

interface ToolbarProps {
  activeTool: string;
  setActiveTool: React.Dispatch<React.SetStateAction<string>>;
}

const Toolbar = ({ activeTool, setActiveTool }: ToolbarProps) => {
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
        onClick={() => setActiveTool("addstikynote")}
        disabled={activeTool === "addstikynote"}
        title="Add Stikynote (포스트잇 추가)"
      />

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
