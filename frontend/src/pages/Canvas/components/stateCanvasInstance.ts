import { atom } from "recoil";
import { fabric } from "fabric";

const cavasInstanceState = atom<fabric.Canvas | null>({
  key: "cavasInstanceState",
  default: null,
  dangerouslyAllowMutability: true
});

export default cavasInstanceState;
