import React, { useEffect } from "react";
import "../Styles/styles.css";

const ModalGram = ({ isOpen, closeModal, imgSrc }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="modal-gram" role="dialog" aria-modal="true">
      <button className="modal-gram__close" onClick={closeModal}>
        Close
      </button>
      <div className="modal-gram__image-box">
        <img src={imgSrc} alt="Instagram post preview" />
      </div>
    </div>
  );
};

export default ModalGram;
