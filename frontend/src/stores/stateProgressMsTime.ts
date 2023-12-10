import { atom } from "recoil";

const progressMsTimeState = atom<number>({
  key: "progressMsTimeState",
  default: 0
});

export default progressMsTimeState;
