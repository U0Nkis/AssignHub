import { toast } from 'react-toastify';

const defaultOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Success notification
export const showSuccess = (message, options = {}) => {
  toast.success(message, { ...defaultOptions, ...options });
};

// Error notification
export const showError = (message, options = {}) => {
  toast.error(message, { ...defaultOptions, ...options });
};

// Warning notification
export const showWarning = (message, options = {}) => {
  toast.warning(message, { ...defaultOptions, ...options });
};

// Info notification
export const showInfo = (message, options = {}) => {
  toast.info(message, { ...defaultOptions, ...options });
};

// Custom notification
export const showCustom = (message, type = 'default', options = {}) => {
  toast(message, { ...defaultOptions, type, ...options });
};

// Promise notification
export const showPromise = (promise, {
  pending = 'Loading...',
  success = 'Success!',
  error = 'Error!',
} = {}) => {
  return toast.promise(promise, {
    pending,
    success,
    error,
  });
};

// Dismiss all notifications
export const dismissAll = () => {
  toast.dismiss();
};

// Dismiss specific notification
export const dismiss = (toastId) => {
  toast.dismiss(toastId);
};

// Update notification
export const update = (toastId, {
  render,
  type,
  isLoading,
  autoClose,
  closeButton,
} = {}) => {
  toast.update(toastId, {
    render,
    type,
    isLoading,
    autoClose,
    closeButton,
  });
}; 