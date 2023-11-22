import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { toastListState } from "./toastAtom";
import usePortal from "./usePortal";
import ReactDOM from "react-dom";

interface ToastProps {
  toastKey: number;
  message: string;
}

const Toast = ({ toastKey, message }: ToastProps) => {
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
      className={`rounded-xl text-grayscale-white semibold-18 w-full bg-grayscale-black text-center px-4 py-3 shadow-sm ${
        animation ? "toast-fade-in" : "toast-fade-out"
      }`}
      style={{ transform: `translateY(-${top}px)`, transition: "transform 0.5s ease" }}
    >
      {message}
    </div>
  );
};

const ToastContainer = () => {
  const toastList = useRecoilValue(toastListState);
  const portalRoot = usePortal("toast-portal");

  return ReactDOM.createPortal(
    <div className="fixed w-11/12 max-w-xs bottom-3 left-1/2 -translate-x-1/2 space-y-3">
      {toastList.map((toast) => (
        <Toast key={toast.id} toastKey={toast.id} message={toast.message} />
      ))}
    </div>,
    portalRoot
  );
};

export default ToastContainer;
