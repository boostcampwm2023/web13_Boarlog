import { atom } from "recoil";
import { ToastMessage } from "./toastType";

export const toastListState = atom<ToastMessage[]>({
  key: "toastListState",
  default: []
});
