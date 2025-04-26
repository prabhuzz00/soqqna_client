"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";

const PasswordField = ({ value, onChange, disabled, id, name, label, required }) => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  return (
    <TextField
      type={isPasswordShow ? "text" : "password"}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      label={label}
      variant="outlined"
      fullWidth
      required={required}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setIsPasswordShow(!isPasswordShow)}
              disabled={disabled}
              edge="end"
              sx={{ color: "grey.600" }}
            >
              {isPasswordShow ? <FaEyeSlash size={18} /> : <FaRegEye size={18} />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      inputProps={{
        sx: {
          "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 1000px white inset",
            WebkitTextFillColor: "black",
          },
        },
      }}
    />
  );
};

export default PasswordField;