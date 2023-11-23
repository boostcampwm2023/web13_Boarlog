import { atom } from "recoil";

export const micVolmeState = atom<number>({
  key: "micVolme",
  default: 1
});

export default micVolmeState;
