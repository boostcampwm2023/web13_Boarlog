import { atom } from "recoil";

const isQuestionLogOpenState = atom<boolean>({
  key: "isQuestionLogOpen",
  default: false
});

export default isQuestionLogOpenState;
