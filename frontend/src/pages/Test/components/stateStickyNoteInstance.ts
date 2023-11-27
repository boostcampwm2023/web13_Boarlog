import { atom } from "recoil";

const stickyNoteInstance = atom<fabric.Object>({
  key: "stickyNoteInstance",
  default: undefined,
  dangerouslyAllowMutability: true
});

export default stickyNoteInstance;
