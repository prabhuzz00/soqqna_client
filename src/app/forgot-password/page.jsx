"use client";
import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { MyContext } from "@/context/ThemeProvider";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "@/utils/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isPasswordShow2, setIsPasswordShow2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormsFields] = useState({
    email: Cookies.get("userphone"),
    newPassword: "",
    confirmPassword: "",
  });

  const context = useContext(MyContext);
  const router = useRouter();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormsFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const isStrongPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  };

  const valideValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.newPassword === "") {
      context.alertBox("error", "Please enter new password");
      setIsLoading(false);
      return false;
    }

    if (formFields.confirmPassword === "") {
      context.alertBox("error", "Please enter confirm password");
      setIsLoading(false);
      return false;
    }

    if (formFields.confirmPassword !== formFields.newPassword) {
      context.alertBox("error", "Password and confirm password not match");
      setIsLoading(false);
      return false;
    }

    if (!isStrongPassword(formFields.newPassword)) {
      context.alertBox(
        "error",
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      );
      setIsLoading(false);
      return;
    }

    console.log(formFields);

    postData(`/api/user/forgot-password/change-password`, formFields).then(
      (res) => {
        console.log(res);
        if (res?.error === false) {
          Cookies.remove("userphone");
          Cookies.remove("actionType");
          context.alertBox("success", res?.message);
          setIsLoading(false);
          router.push("/login");
        } else {
          context.alertBox("error", res?.message);
        }
      }
    );
  };

  return (
    <section className="section py-5 lg:py-10">
      <div className="container">
        <div className="card shadow-md w-full sm:w-[400px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[18px] text-black">
            Forgot Password
          </h3>

          <form className="w-full mt-5" onSubmit={handleSubmit}>
            <div className="form-group w-full mb-5 relative">
              <TextField
                type={isPasswordShow === false ? "password" : "text"}
                id="password"
                label="New Password"
                variant="outlined"
                className="w-full"
                name="newPassword"
                autoComplete="off"
                value={formFields.newPassword}
                disabled={isLoading === true ? true : false}
                onChange={onChangeInput}
              />

              <Button
                className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black"
                onClick={() => {
                  setIsPasswordShow(!isPasswordShow);
                }}
              >
                {isPasswordShow === false ? (
                  <IoMdEye className="text-[20px] opacity-75" />
                ) : (
                  <IoMdEyeOff className="text-[20px] opacity-75" />
                )}
              </Button>
            </div>

            <div className="form-group w-full mb-5 relative">
              <TextField
                type={isPasswordShow2 === false ? "password" : "text"}
                id="confirm_password"
                label="Confirm Password"
                variant="outlined"
                className="w-full"
                name="confirmPassword"
                autoComplete="off"
                value={formFields.confirmPassword}
                disabled={isLoading === true ? true : false}
                onChange={onChangeInput}
              />
              <Button
                className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black"
                onClick={() => {
                  setIsPasswordShow2(!isPasswordShow2);
                }}
              >
                {isPasswordShow2 === false ? (
                  <IoMdEye className="text-[20px] opacity-75" />
                ) : (
                  <IoMdEyeOff className="text-[20px] opacity-75" />
                )}
              </Button>
            </div>

            <div className="flex items-center w-full mt-3 mb-3">
              <Button
                type="submit"
                disabled={!valideValue}
                className="btn-org btn-lg w-full flex gap-3"
              >
                {isLoading === true ? (
                  <CircularProgress color="inherit" />
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
