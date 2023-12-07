import { atom } from "recoil";

const lectureCodeState = atom<number>({
  key: "lectureCodeState",
  default: 990705
});

export default lectureCodeState;
