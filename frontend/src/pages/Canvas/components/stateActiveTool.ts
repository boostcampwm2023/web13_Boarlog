import { atom } from "recoil";

type ToolType = "select" | "pen" | "stickyNote" | "image" | "eraser" | "hand";

const activeToolState = atom<ToolType>({
  key: "activeToolState",
  default: "pen"
});

export default activeToolState;
