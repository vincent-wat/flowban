import React from "react";
import "../CSS/PopupMenu.css";

export default function PopupMenu({ isOpen, onClose, options }) {
  if (!isOpen) return null;

  return (
    <div className="popup-menu">
      <ul>
        {options.map((option, index) => (
          <li key={index} onClick={option.onClick}>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
