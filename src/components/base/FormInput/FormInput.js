import { Button, CircularProgress, Divider, Input, Paper, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

const FormInput = (props) => {
    const { helperText, label, disabled, defaultValue, onTextChange, onButtonClick } = props;
    // const buttonSx = {
    //     ...(success && {
    //         bgcolor: green[500],
    //         '&:hover': {
    //             bgcolor: green[700],
    //         },
    //     }),
    // };
    return (
        <Paper
            component="div"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}>
            <TextField
                helperText={helperText}
                disabled={disabled}
                label={label}
                value={defaultValue}
                onChange={onTextChange}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <Box sx={{ m: 1, position: 'relative' }}>
                <Button
                    variant="contained"
                    // sx={buttonSx}
                    disabled={disabled}
                    onClick={onButtonClick}
                >
                    Submit
                </Button>
                {loading && (
                    <CircularProgress
                        size={24}
                        sx={{
                            color: green[500],
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                    />
                )}
            </Box>
        </Paper>
    );
}

export default FormInput;