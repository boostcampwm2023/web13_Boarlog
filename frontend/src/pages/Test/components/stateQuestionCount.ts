import { atom } from "recoil";

const questionCountState = atom<number>({
  key: "questionCountState",
  default: 0
});

export default questionCountState;
