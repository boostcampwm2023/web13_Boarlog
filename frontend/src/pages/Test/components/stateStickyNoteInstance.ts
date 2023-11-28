import { atom } from "recoil";

export interface fabricObjectWithItem extends fabric.Object {
  item: Function;
}

const stickyNoteInstance = atom<fabricObjectWithItem>({
  key: "stickyNoteInstance",
  default: undefined,
  dangerouslyAllowMutability: true
});

export default stickyNoteInstance;
