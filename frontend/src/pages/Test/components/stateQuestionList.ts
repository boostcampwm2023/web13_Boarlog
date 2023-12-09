import { atom, selector } from "recoil";

const questionListState = atom<string[]>({
  key: "questionListState",
  default: []
});
export const questionCountState = selector<number>({
  key: "questionCountState",
  get: ({ get }) => get(questionListState).length
});

export default questionListState;
