import { atom } from "recoil";

const isQuestionListOpenState = atom<boolean>({
  key: "isQuestionListOpenState",
  default: false
});

export default isQuestionListOpenState;
