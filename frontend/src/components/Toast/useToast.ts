import { useSetRecoilState } from "recoil";
import { toastListState } from "./toastAtom";
import { ToastMessage } from "./toastType";
import { TOAST_AVAILABLE_TIME } from "./constants";

interface UseToastProps {
  message: string;
  type: "alert" | "success" | "default";
}

export const useToast = () => {
  const setToastList = useSetRecoilState(toastListState);

  const showToast = ({ message, type }: UseToastProps) => {
    const newToast: ToastMessage = { id: Date.now(), message, type };

    // 함수형 업데이트를 사용하여 toastList 상태를 변경
    setToastList((oldToastList) => [...oldToastList, newToast]);

    // 특정 시간 후에 toast를 제거
    setTimeout(() => {
      setToastList((currentList) => currentList.filter((toast) => toast.id !== newToast.id));
    }, TOAST_AVAILABLE_TIME);
  };

  return showToast;
};
