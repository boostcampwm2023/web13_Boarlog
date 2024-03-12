import { atom } from "recoil";
import { MutableRefObject } from "react";

const videoRefState = atom<MutableRefObject<HTMLVideoElement | null>>({
  key: "videoRefState",
  default: { current: null },
  dangerouslyAllowMutability: true
});

export default videoRefState;
