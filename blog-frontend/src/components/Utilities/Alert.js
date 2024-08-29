import React from 'react';
import { toast } from 'react-toastify';

const Alert = ({ message, type }) => {
  toast[type](message);
  return null;
};

export default Alert;
