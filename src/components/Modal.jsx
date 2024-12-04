import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = forwardRef(function Modal({ children, buttonCaption }, ref) {
  const dialog = useRef();

  // Cung cấp phương thức open và close cho component cha thông qua ref
  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
      close() {
        dialog.current.close();
      },
    };
  });

  const handleClose = () => {
    dialog.current.close();
  };

  return createPortal(
    <dialog
      ref={dialog}
      className="backdrop:bg-stone-900/90 p-4 rounded-md shadow-md"
    >
      {children}
      <form method="dialog">
        <button type="button" onClick={handleClose}>
          {buttonCaption}
        </button>
      </form>
    </dialog>,
    document.getElementById("modal-root") // Đảm bảo phần tử này có trong HTML
  );
});

export default Modal;
