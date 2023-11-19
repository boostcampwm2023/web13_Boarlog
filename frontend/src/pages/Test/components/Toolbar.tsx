import MouseIcon from "@/assets/svgs/whiteboard/mouse.svg?react";
import PenIcon from "@/assets/svgs/whiteboard/pen.svg?react";
import StickyNoteIcon from "@/assets/svgs/whiteboard/stickyNote.svg?react";
import ImageIcon from "@/assets/svgs/whiteboard/image.svg?react";
import EraserIcon from "@/assets/svgs/whiteboard/eraser.svg?react";
import HandIcon from "@/assets/svgs/whiteboard/hand.svg?react";

interface ToolbarProps {
  activeTool: string;
  setSelectMode: () => void;
  setPenMode: () => void;
  setHandMode: () => void;
  addRectangle: () => void;
  erase: () => void;
}

const Toolbar = ({ activeTool, setSelectMode, setPenMode, setHandMode, addRectangle, erase }: ToolbarProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-2 gap-1 rounded-[10px] bg-grayscale-lightgray border border-grayscale-lightgray shadow-md absolute top-2.5 left-2.5">
      <button
        className="flex p-2 items-center justify-center rounded-[10px] disabled:bg-boarlog-80 group"
        onClick={setSelectMode}
        disabled={activeTool === "select"}
        title="Select Tool"
      >
        <MouseIcon className="group-disabled:fill-white" />
      </button>
      <button
        className="flex p-2 items-center justify-center rounded-[10px] disabled:bg-boarlog-80 group"
        onClick={setPenMode}
        disabled={activeTool === "pen"}
        title="Pen Tool"
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
      <button
        className="flex p-2 items-center justify-center rounded-[10px] disabled:bg-boarlog-80 group"
        onClick={setHandMode}
        disabled={activeTool === "hand"}
        title="Hand Tool"
      >
        <HandIcon className="group-disabled:fill-white" />
      </button>
    </div>
  );
};

export default Toolbar;
