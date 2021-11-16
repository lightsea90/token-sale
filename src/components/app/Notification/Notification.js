import React from 'react'
import { Alert, AlertTitle, Container } from "@mui/material";
import './Notification.scss';
const Notification = (prop) => {
  return (
    <Alert severity={prop.type}>
        <AlertTitle>{prop.type}</AlertTitle>
        {prop.message}
      </Alert>
  );
}
export default Notification;