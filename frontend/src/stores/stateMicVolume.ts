import { atom } from "recoil";

const micVolumeState = atom<number>({
  key: "micVolumeState",
  default: 0
});

export default micVolumeState;
