import React, { useState } from "react";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  showTooltip?: boolean;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = "",
  showTooltip = true,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center"
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button
        style={{
          backgroundColor: "#25D366",
          borderRadius: "50%",
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          border: "none",
          cursor: "pointer",
        }}
        title="Chat on WhatsApp"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.65.87 5.1 2.36 7.1L4 29l7.18-2.31C13.07 27.56 14.51 28 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.33 0-2.62-.26-3.8-.76l-.27-.11-4.26 1.37 1.4-4.13-.18-.28C7.41 18.04 7 16.54 7 15c0-5.06 4.13-9.18 9.18-9.18S25.36 9.94 25.36 15 21.23 25.18 16 25.18zm5.07-7.09c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.19-.44-2.26-1.41-.84-.75-1.41-1.67-1.57-1.95-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.54-.45-.47-.61-.48-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.32 0 1.37.99 2.7 1.13 2.88.14.18 1.95 2.98 4.73 4.06.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
        </svg>
      </button>
      {showTooltip && isHovering && (
        <span
          style={{
            marginLeft: 8,
            background: "#fff",
            color: "#25D366",
            padding: "6px 12px",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          Chat with us
        </span>
      )}
    </a>
  );
};

export default WhatsAppButton;
