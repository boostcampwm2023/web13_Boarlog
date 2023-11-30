import { atom } from "recoil";

const clickedQuestionContentsState = atom<string | undefined>({
  key: "clickedQuestionContentsState",
  default: ""
});

export default clickedQuestionContentsState;
