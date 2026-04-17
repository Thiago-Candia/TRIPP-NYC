import React, { useEffect } from "react";
import "../Styles/styles.css";

const ModalGram = ({ isOpen, closeModal, imgSrc }) => {

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
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
    <div className="modal-gram">
      <div className="modal-gram__image-box">
        <img src={imgSrc} alt="" />
      </div>
      <div>
        wwww
        <div className="modal-gram__item">
          <span>Hola</span>
        </div>
        <div className="modal-gram__item"></div>
        <div className="modal-gram__item"></div>
        <div className="modal-gram__item"></div>
      </div>
    </div>
  );
};

export default ModalGram;
