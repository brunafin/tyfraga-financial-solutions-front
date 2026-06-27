import Button from "../Button";

type ConfirmModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal = ({ message, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-message"
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm">
        <p id="confirm-modal-message" className="text-base text-text">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline_primary" onClick={onCancel}>
            Não
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Sim
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
