import { createContext } from "react";

export type ModalContextType = {
  showAlert: (message: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
};

export const ModalContext = createContext<ModalContextType>({
  showAlert: () => Promise.resolve(),
  showConfirm: () => Promise.resolve(false),
});
