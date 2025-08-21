/**
 * Notification utility functions for toast messages
 */

let toastContainer = null;

const createToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

const createToast = (message, type = 'info', duration = 3000) => {
  const container = createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    background: ${getToastColor(type)};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    font-size: 14px;
    font-weight: 500;
    max-width: 300px;
    word-wrap: break-word;
    animation: slideIn 0.3s ease-out;
    cursor: pointer;
  `;
  
  toast.textContent = message;
  
  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
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
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  
  if (!document.head.querySelector('style[data-toast-styles]')) {
    style.setAttribute('data-toast-styles', 'true');
    document.head.appendChild(style);
  }
  
  container.appendChild(toast);
  
  // Remove toast after duration
  const removeToast = () => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      if (toast.parentNode) {
        container.removeChild(toast);
      }
    }, 300);
  };
  
  toast.addEventListener('click', removeToast);
  
  if (duration > 0) {
    setTimeout(removeToast, duration);
  }
  
  return toast;
};

const getToastColor = (type) => {
  const colors = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  return colors[type] || colors.info;
};

export const toast = {
  success: (message, duration) => createToast(message, 'success', duration),
  error: (message, duration) => createToast(message, 'error', duration),
  warning: (message, duration) => createToast(message, 'warning', duration),
  info: (message, duration) => createToast(message, 'info', duration)
};

export default toast;
