import { atom } from "recoil";

const clickedQuestionContentsState = atom<{ content: string; questionId: string } | undefined>({
  key: "clickedQuestionContentsState",
  default: undefined,
  dangerouslyAllowMutability: true
});

export default clickedQuestionContentsState;
