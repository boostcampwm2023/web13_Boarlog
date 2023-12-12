import { atom } from "recoil";

const isMemoEditingState = atom<boolean>({
  key: "isMemoEditingState",
  default: false
});

export default isMemoEditingState;
