import { atom } from "recoil";
import { MutableRefObject } from "react";

const videoRefState = atom<MutableRefObject<HTMLVideoElement | null>>({
  key: "videoRefState",
  default: { current: null }
});

export default videoRefState;
