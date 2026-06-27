import { useCallback, useMemo, useRef, useState } from "react";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/Modal/ConfirmModal";
import { ModalContext } from "./ModalContext";

type ModalState =
  | { type: "alert"; message: string }
  | { type: "confirm"; message: string };

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState | null>(null);
  const resolveRef = useRef<((value?: boolean) => void) | null>(null);

  const showAlert = useCallback((text: string) => {
    return new Promise<void>((resolve) => {
      resolveRef.current = () => resolve();
      setModal({ type: "alert", message: text });
    });
  }, []);

  const showConfirm = useCallback((text: string) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = (confirmed) => resolve(!!confirmed);
      setModal({ type: "confirm", message: text });
    });
  }, []);

  const handleClose = useCallback((confirmed?: boolean) => {
    setModal(null);
    resolveRef.current?.(confirmed);
    resolveRef.current = null;
  }, []);

  const value = useMemo(
    () => ({ showAlert, showConfirm }),
    [showAlert, showConfirm],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modal?.type === "alert" && (
        <Modal message={modal.message} onClose={() => handleClose()} />
      )}
      {modal?.type === "confirm" && (
        <ConfirmModal
          message={modal.message}
          onConfirm={() => handleClose(true)}
          onCancel={() => handleClose(false)}
        />
      )}
    </ModalContext.Provider>
  );
}
