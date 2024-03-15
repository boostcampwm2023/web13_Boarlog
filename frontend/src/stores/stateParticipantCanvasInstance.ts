import { atom } from "recoil";
import { fabric } from "fabric";

const participantCanvasInstanceState = atom<fabric.Canvas | null>({
  key: "participantCanvasInstanceState",
  default: null,
  dangerouslyAllowMutability: true
});

export default participantCanvasInstanceState;
