import { Button, CircularProgress, Divider, FormControl, Input, InputAdornment, InputLabel, OutlinedInput, Paper, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

const FormInput = (props) => {
    const { helperText, label, disabled, loading, buttonDisable, defaultValue, onTextChange, onButtonClick } = props;

    return (
        <Paper
            component="div"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', marginTop: '10px' }}>
            <FormControl disabled={disabled} fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor={`outlined-adornment-${label}`}>{label}</InputLabel>
                <OutlinedInput
                    id={`outlined-adornment-${label}`}
                    value={defaultValue}
                    onChange={onTextChange}
                    startAdornment={<InputAdornment position="start">NEAR</InputAdornment>}
                    label={label}
                />
            </FormControl>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <Box sx={{ m: 1, position: 'relative' }}>
                <Button
                    variant="contained"
                    // sx={buttonSx}
                    disabled={disabled || buttonDisable}
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