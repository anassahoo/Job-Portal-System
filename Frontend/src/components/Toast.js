import React from 'react';

// 1. The 'toast' object/function that your components are calling
export const toast = (message) => {
  console.log("Toast message: ", message);
};
// Adding common methods just in case your code calls toast.success() or toast.error()
toast.success = (msg) => console.log("Success: ", msg);
toast.error = (msg) => console.log("Error: ", msg);
toast.info = (msg) => console.log("Info: ", msg);
toast.warn = (msg) => console.log("Warning: ", msg);

// 2. The 'ToastContainer' component that App.js is looking for
export const ToastContainer = () => {
  return <div style={{ display: 'none' }}></div>;
};

// 3. The 'useToast' hook we added previously
export const useToast = () => {
  return toast;
};

// 4. Default export just in case
export default function Toast() {
  return null;
}