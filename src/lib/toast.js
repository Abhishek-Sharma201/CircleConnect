// Simple custom toast system to replace react-toastify
// This provides a cleaner, more modern UI

let toastContainer = null;
let toastId = 0;

const createToastContainer = () => {
  if (toastContainer) return toastContainer;
  
  toastContainer = document.createElement("div");
  toastContainer.id = "custom-toast-container";
  toastContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: none;
  `;
  document.body.appendChild(toastContainer);
  return toastContainer;
};

const showToast = (message, type = "info") => {
  const container = createToastContainer();
  const id = ++toastId;
  
  const toast = document.createElement("div");
  toast.id = `toast-${id}`;
  toast.style.cssText = `
    padding: 16px 20px;
    border-radius: 8px;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    pointer-events: auto;
    animation: slideIn 0.3s ease-out;
    transition: all 0.3s ease;
  `;
  
  // Set colors based on type
  const colors = {
    success: { bg: "#10b981", text: "#ffffff" },
    error: { bg: "#ef4444", text: "#ffffff" },
    warning: { bg: "#f59e0b", text: "#ffffff" },
    info: { bg: "#3b82f6", text: "#ffffff" },
  };
  
  const color = colors[type] || colors.info;
  toast.style.backgroundColor = color.bg;
  toast.style.color = color.text;
  
  toast.textContent = message;
  
  // Add keyframe animation
  if (!document.getElementById("toast-animations")) {
    const style = document.createElement("style");
    style.id = "toast-animations";
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  container.appendChild(toast);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-in";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
};

export const toast = {
  success: (message) => showToast(message, "success"),
  error: (message) => showToast(message, "error"),
  warning: (message) => showToast(message, "warning"),
  info: (message) => showToast(message, "info"),
};
