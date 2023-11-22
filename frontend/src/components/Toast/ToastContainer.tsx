import { useRecoilValue } from "recoil";
import { toastListState } from "./toastAtom";
import usePortal from "./usePortal";
import ReactDOM from "react-dom";

const ToastContainer = () => {
  const toastList = useRecoilValue(toastListState);
  const portalRoot = usePortal("toast-portal");

  return ReactDOM.createPortal(
    <div className="fixed w-11/12 max-w-xs bottom-3 left-1/2 -translate-x-1/2 space-y-3">
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className="rounded-xl text-grayscale-white semibold-18 w-full bg-grayscale-gray text-center px-4 py-3 shadow-sm"
        >
          {toast.message}
        </div>
      ))}
    </div>,
    portalRoot
  );
};

export default ToastContainer;
