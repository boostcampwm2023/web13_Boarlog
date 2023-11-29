import { atom } from "recoil";

export const speakerVolumeState = atom<number>({
  key: "speakerVolume",
  default: 1
});

export default speakerVolumeState;
