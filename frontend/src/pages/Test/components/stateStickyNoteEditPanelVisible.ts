import { atom } from "recoil";

const stickyNoteEditPanelVisibilityState = atom<boolean>({
  key: "stateStickyNoteEditPanelShow",
  default: false
});

export default stickyNoteEditPanelVisibilityState;
