import { atom, selector } from "recoil";

const questionListState = atom<Array<{ content: string; questionId: string }>>({
  key: "questionListState",
  default: [],
  dangerouslyAllowMutability: true
});
export const questionCountState = selector<number>({
  key: "questionCountState",
  get: ({ get }) => get(questionListState).length
});

export default questionListState;
