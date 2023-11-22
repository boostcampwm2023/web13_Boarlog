import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { toastListState } from "./toastAtom";
import usePortal from "./usePortal";
import ReactDOM from "react-dom";
import SuccessIcon from "@/assets/svgs/toast/success.svg?react";
import AlertIcon from "@/assets/svgs/toast/alert.svg?react";
import DefaultIcon from "@/assets/svgs/toast/default.svg?react";

interface ToastProps {
  toastKey: number;
  message: string;
  type: "alert" | "success" | "default";
}

const Toast = ({ toastKey, message, type }: ToastProps) => {
  const [animation, setAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimation(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      key={toastKey}
      className={`rounded-xl medium-16 w-full text-grayscale-black px-4 py-4 flex flex-row items-center justify-start gap-3 shadow-ml ${
        animation ? "toast-fade-in" : "toast-fade-out"
      } ${type === "alert" && "bg-alert-10"} ${type === "success" && "bg-boarlog-10"} ${
        type === "default" && "bg-grayscale-lightgray"
      }`}
      style={{ transform: `translateY(-${top}px)`, transition: "transform 0.5s ease" }}
    >
      {type === "alert" && <AlertIcon className="fill-alert-100 w-5 h-5" />}
      {type === "success" && <SuccessIcon className="fill-boarlog-100 w-5 h-5" />}
      {type === "default" && <DefaultIcon className="fill-grayscale-black w-5 h-5" />}

      <p className="w-full break-all">{message}</p>
    </div>
  );
};

const ToastContainer = () => {
  const toastList = useRecoilValue(toastListState);
  const portalRoot = usePortal("toast-portal");

  return ReactDOM.createPortal(
    <div className="fixed w-11/12 max-w-xs bottom-3 left-1/2 -translate-x-1/2 space-y-3">
      {toastList.map((toast) => (
        <Toast key={toast.id} toastKey={toast.id} message={toast.message} type={toast.type} />
      ))}
    </div>,
    portalRoot
  );
};

export default ToastContainer;
