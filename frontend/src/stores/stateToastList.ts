import { atom } from "recoil";
import { ToastMessage } from "../components/Toast/toastType";

export const toastListState = atom<ToastMessage[]>({
  key: "toastListState",
  default: []
});
