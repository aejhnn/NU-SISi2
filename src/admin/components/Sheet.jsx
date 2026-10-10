import { useEffect, useId, useRef } from "react";
import { CloseIcon } from "./icons";
import { button } from "./styles";

/**
 * A panel that slides in from the right as a modal dialog: the page behind it is inert, Escape
 * and a click on the backdrop close it. Mount it to open, unmount it to close.
 */
export function Sheet({ title, onClose, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    // StrictMode runs this twice; opening an already open dialog would throw.
    if (dialog.open) return;
    dialog.showModal();
    // showModal() focuses the first button (Close). React's autoFocus never reaches the DOM, so a
    // panel marks the field that should get the cursor instead.
    dialog.querySelector("[data-autofocus]")?.focus();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      // Escape closes the dialog natively; keep React's state in step.
      onClose={onClose}
      // Clicks on the dialog element itself land on its backdrop.
      onClick={(event) => event.target === dialogRef.current && onClose()}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-xl bg-white p-0 text-ink shadow-2xl backdrop:bg-ink/40 motion-safe:animate-sheet-in"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-6 py-4">
          <h2 id={titleId} className="truncate text-lg font-bold">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className={`${button("ghost", "icon")} -mr-2`}>
            <CloseIcon className="size-5" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </dialog>
  );
}

export function SheetBody({ children }) {
  return <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">{children}</div>;
}

export function SheetFooter({ children }) {
  return (
    <div className="flex justify-end gap-2 border-t border-hairline bg-white px-6 py-4">{children}</div>
  );
}
