import React from 'react'
import { Alert, AlertTitle, Container, Snackbar } from "@mui/material";
import './Notification.scss';
const Notification = (props) => {
    return (
        <Snackbar open={props.open} onClose={props.handleClose} key={'bottom' + 'right'}>
            <Alert severity={props.type} sx={{ width: '100%' }}>
                {props.message}
            </Alert>
        </Snackbar>
    );
}
export default Notification;