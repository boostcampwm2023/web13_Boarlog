import { atom } from "recoil";

const stickyNoteInstance = atom<Object>({
  key: "stickyNoteInstance",
  default: undefined,
  dangerouslyAllowMutability: true
});

export default stickyNoteInstance;
