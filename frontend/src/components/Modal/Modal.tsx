import Button from "../Button/Button";

interface ModalProps {
  confirmClick?: () => void;
  cancelText: string;
  confirmText: string;
  cancelButtonStyle: "black" | "gray" | "red" | "blue";
  confirmButtonStyle: "black" | "gray" | "red" | "blue";
  modalText: string;
  className?: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({
  confirmClick,
  cancelText,
  confirmText,
  cancelButtonStyle,
  confirmButtonStyle,
  modalText,
  isModalOpen,
  setIsModalOpen
}: ModalProps) => {
  return (
    <>
      <div
        className={`w-screen h-screen fixed top-0 left-0 dimmer ${
          isModalOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsModalOpen(false)}
      />
      <div
        className={`display-center flex flex-col items-center justify-center px-6 py-4 w-96 h-fit gap-4 rounded-xl bg-grayscale-white border-default duration-500 ${
          isModalOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <p className="py-6 medium-18">{modalText}</p>
        <menu className="flex flex-row w-full gap-4">
          <Button type="grow" value="cancel" onClick={() => setIsModalOpen(false)} buttonStyle={cancelButtonStyle}>
            {cancelText}
          </Button>
          <Button type="grow" value="default" onClick={confirmClick} buttonStyle={confirmButtonStyle}>
            {confirmText}
          </Button>
        </menu>
      </div>
    </>
  );
};

export default Modal;
