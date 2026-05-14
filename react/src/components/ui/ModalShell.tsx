import type { ReactNode } from "react";

type ModalShellProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
};

export function ModalShell({
  title,
  children,
  onClose,
  footer,
}: ModalShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close modal"
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
        type="button"
        onClick={onClose}
      />
      <section
        aria-labelledby="modal-title"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg rounded-lg border border-primary-300 bg-primary-500 shadow-2xl"
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4 border-b border-primary-300 px-5 py-4">
          <h2 className="text-lg font-semibold text-default" id="modal-title">
            {title}
          </h2>
          <button
            aria-label="Close"
            className="rounded-md border border-primary-300 px-2 py-1 text-sm font-medium text-muted hover:bg-primary-400 hover:text-default"
            type="button"
            onClick={onClose}
          >
            X
          </button>
        </header>
        <div className="px-5 py-4">{children}</div>
        {footer ? (
          <footer className="flex flex-wrap justify-end gap-2 border-t border-primary-300 px-5 py-4">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}
