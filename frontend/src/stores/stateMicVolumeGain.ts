import { atom } from "recoil";

export const micVolumeGainState = atom<number>({
  key: "micVolumeGainState",
  default: 1
});

export default micVolumeGainState;
