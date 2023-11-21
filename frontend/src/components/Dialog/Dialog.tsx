import Button from "../Button/Button";

interface DialogProps {
  cancelClick?: () => void;
  confirmClick?: () => void;
  cancelText: string;
  confirmText: string;
  cancelButtonClass: string;
  confirmButtonClass: string;
  dialogText: string;
  className?: string;
}

const Dialog = ({
  cancelClick,
  confirmClick,
  cancelText,
  confirmText,
  cancelButtonClass,
  confirmButtonClass,
  dialogText
}: DialogProps) => {
  return (
    <dialog open>
      <div className="flex flex-col items-center justify-center px-6 py-4 w-96 h-fit gap-4 rounded-xl bg-grayscale-white border-default duration-500">
        <form method="dialog" className="py-6 medium-18">
          {dialogText}
        </form>
        <menu className="flex flex-row w-full gap-4">
          <Button type="grow" onClick={cancelClick} className={cancelButtonClass}>
            {cancelText}
          </Button>
          <Button type="grow" onClick={confirmClick} className={confirmButtonClass}>
            {confirmText}
          </Button>
        </menu>
      </div>
    </dialog>
  );
};

export default Dialog;
