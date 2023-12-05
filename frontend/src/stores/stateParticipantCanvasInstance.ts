import { atom } from "recoil";
import { fabric } from "fabric";

const participantCavasInstanceState = atom<fabric.Canvas | null>({
  key: "participantCavasInstanceState",
  default: null,
  dangerouslyAllowMutability: true
});

export default participantCavasInstanceState;
