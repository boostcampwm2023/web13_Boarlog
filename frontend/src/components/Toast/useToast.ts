import { useRecoilState } from "recoil";
import { toastListState } from "./toastAtom";
import { ToastMessage } from "./toastTypes";

interface UseToastProps {
  message: string;
  type: "alert" | "success" | "default";
}

export const useToast = () => {
  const [toastList, setToastList] = useRecoilState(toastListState);

  const showToast = ({ message, type }: UseToastProps) => {
    const newToast: ToastMessage = { id: Date.now(), message, type };
    setToastList([...toastList, newToast]);

    setTimeout(() => {
      setToastList((currentList) => currentList.filter((toast) => toast.id !== newToast.id));
    }, 3000);
  };

  return showToast;
};
