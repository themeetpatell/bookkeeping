import React from 'react';
import './button.css';

export const Button = ({ children, className = "", variant = "default", ...props }) => {
  return (
    <button 
      className={`btn ${variant === "default" ? "btn-default" : "btn-outline"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
