import { atom } from "recoil";

export interface fabricObjectWithItem extends fabric.Object {
  item: Function;
}
export interface fabricObjectWithAddWithUpdate extends fabric.Object {
  addWithUpdate: Function;
}

const stickyNoteInstance = atom<fabricObjectWithItem>({
  key: "stickyNoteInstance",
  default: undefined,
  dangerouslyAllowMutability: true
});

export default stickyNoteInstance;
