import { createPortal } from "react-dom";
import LogoCoin from "../LogoCoin";

const Loader = () => {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex min-h-dvh min-w-full items-center justify-center bg-primary/80">
      <div className="rounded-full bg-white p-2.5">
        <LogoCoin className="size-14 animate-spin" gradientId="loaderCoinGradient" />
      </div>
    </div>,
    document.body,
  );
};

export default Loader;
