import { atom } from "recoil";
import { MutableRefObject } from "react";

const participantCanvasRefState = atom<MutableRefObject<HTMLCanvasElement | null>>({
  key: "participantCanvasRefState",
  default: { current: null }
});

export default participantCanvasRefState;
