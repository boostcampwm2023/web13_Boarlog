import { atom } from "recoil";
import { MutableRefObject } from "react";

const canvasRefState = atom<MutableRefObject<HTMLCanvasElement | null>>({
  key: "canvasRefState",
  default: { current: null }
});

export default canvasRefState;
