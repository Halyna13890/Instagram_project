import React, { useEffect } from "react";
import "./OverlaySidebar.css";

const OverlaySidebar = ({ isOpen, onClose, children }) => {
  // Закрытие сайдбара при клике на фон
  const handleBackdropClick = (e) => {
    // Проверяем, что клик был именно по фону
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    // Закрытие сайдбара при нажатии ESC
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <>
      <div
        className={`overlay-backdrop ${isOpen ? "show" : ""}`}
        onClick={handleBackdropClick} // Закрытие по клику на фон
      />
      
      <div className={`overlay-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content">{children}</div>
      </div>
    </>
  );
};

export default OverlaySidebar;
