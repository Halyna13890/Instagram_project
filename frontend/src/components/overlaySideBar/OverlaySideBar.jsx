import React, { useEffect } from "react";
import "./OverlaySidebar.css";

const OverlaySidebar = ({ isOpen, onClose, children }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
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
        onClick={handleBackdropClick}
      />

      
      <div className={`overlay-sidebar ${isOpen ? "open" : ""}`}>
      
        <div className="sidebar-content">{children}</div>
      </div>
    </>
  );
};

export default OverlaySidebar;