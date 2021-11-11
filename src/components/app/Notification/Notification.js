import { Alert } from "@mui/material";
import { useEffect, useState } from "react";
import NotificationType from "../../../constants/NotificationType";
import './Notification.scss';
export default Notification = (prop) => {
  let [type, setType] = useState(prop.type || NotificationType.SUCCESS);
  let [message, setMessage] = useState(prop.message || '');
  return (
    <aside>
      <Alert severity={type}>
        <AlertTitle>{type}</AlertTitle>
        {message}
      </Alert>
    </aside>
  );
};