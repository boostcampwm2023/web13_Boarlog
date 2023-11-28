import { atom } from "recoil";

export const speakerVolmeState = atom<number>({
  key: "speakerVolme",
  default: 1
});

export default speakerVolmeState;
