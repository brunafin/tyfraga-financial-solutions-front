import Button from "../Button";

type ModalProps = {
  message: string;
  onClose: () => void;
};

const Modal = ({ message, onClose }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-message"
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm">
        <p id="modal-message" className="text-base text-text">
          {message}
        </p>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>OK</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
