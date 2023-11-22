import { useRecoilState } from "recoil";
import { toastListState } from "./toastAtom";
import { ToastMessage } from "./toastTypes";

export const useToast = () => {
  const [toastList, setToastList] = useRecoilState(toastListState);

  const showToast = (message: string) => {
    const newToast: ToastMessage = { id: Date.now(), message };
    setToastList([...toastList, newToast]);

    setTimeout(() => {
      setToastList((currentList) => currentList.filter((toast) => toast.id !== newToast.id));
    }, 3000);
  };

  return showToast;
};
