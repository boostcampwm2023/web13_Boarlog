// toastAtom.ts 파일
import { atom } from "recoil";
import { ToastMessage } from "./toastTypes";

export const toastListState = atom<ToastMessage[]>({
  key: "toastListState",
  default: []
});
