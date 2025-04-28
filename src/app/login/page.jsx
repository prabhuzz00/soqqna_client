"use client";
import { MyContext } from "@/context/ThemeProvider";
import React, { useContext, useEffect, useState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { postData } from "@/utils/api";

import { useSession, signIn } from "next-auth/react";
import { useTranslation } from "@/utils/useTranslation";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formFields, setFormsFields] = useState({
    phone: "",
    password: "",
  });

  const context = useContext(MyContext);
  const router = useRouter();
  const { t } = useTranslation();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure this runs only on client
      window.scrollTo(0, 0);
    }

    const token = Cookies.get("accessToken");

    if (token !== undefined && token !== null && token !== "") {
      router.push("/");
    }
  }, []);

  const forgotPassword = () => {
    if (formFields.phone === "") {
      context.alertBox("error", t("login.error_phone_required"));
      return false;
    } else {
      context.alertBox("success", `OTP send to ${formFields.phone}`);

      Cookies.set("userphone", formFields.phone);
      Cookies.set("actionType", "forgot-password");

      postData("/api/user/forgot-password", {
        phone: formFields.phone,
      }).then((res) => {
        if (res?.error === false) {
          context.alertBox("success", res?.message);
          router.push("/verifyAccount");
        } else {
          context.alertBox("error", res?.message);
        }
      });
    }
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormsFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const valideValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (formFields.phone === "") {
      context.alertBox("error", t("login.error_phone_required"));
      return false;
    }

    if (formFields.password === "") {
      context.alertBox("error", t("login.error_password_required"));
      return false;
    }

    postData("/api/user/login", formFields, { withCredentials: true }).then(
      (res) => {
        if (res?.error !== true) {
          setIsLoading(false);
          context.alertBox("success", res?.message);
          setFormsFields({
            phone: "",
            password: "",
          });

          Cookies.set("accessToken", res?.data?.accesstoken);
          Cookies.set("refreshToken", res?.data?.refreshToken);

          context.setIsLogin(true);

          router.push("/");
        } else {
          context.alertBox("error", res?.message);
          setIsLoading(false);
        }
      }
    );
  };

  const handleAuthenticatedSession = useCallback(
    async (sessionData) => {
      if (isProcessing) return;
      setIsProcessing(true);

      const fields = {
        name: sessionData.user.name,
        phone: sessionData.user.phone,
        password: null,
        avatar: sessionData.user.image,
        phone: "",
      };

      try {
        const res = await postData("/api/user/authWithGoogle", fields);

        Cookies.set("token", res.token, { expires: 30 });

        Cookies.set("userphone", fields.phone);
        Cookies.set("accessToken", res?.data?.accesstoken);
        Cookies.set("refreshToken", res?.data?.refreshToken);

        context.setIsLogin(true);
        context.alertBox("success", t("login.success_login"));

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (error) {
        console.error("Error posting data to backend:", error);

        context.alertBox("error", "An error occurred during sign-in.");
      } finally {
        setIsProcessing(false);
      }
    },
    [context, router, isProcessing]
  );

  useEffect(() => {
    if (status === "authenticated" && session && !isProcessing) {
      handleAuthenticatedSession(session);
    }
  }, [status, session, handleAuthenticatedSession, isProcessing]);

  const authWithGoogle = () => {
    signIn("google");
  };

  return (
    <section className="section py-5 sm:py-10">
      <div className="container">
        <div className="card shadow-md w-full sm:w-[400px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[18px] text-black">
            {t("login.title")}
          </h3>

          <form className="w-full mt-5" onSubmit={handleSubmit}>
            <div className="form-group w-full mb-5">
              <TextField
                type="phone"
                id="phone"
                name="phone"
                value={formFields.phone}
                disabled={isLoading === true ? true : false}
                label={t("login.phone_label")}
                variant="outlined"
                className="w-full"
                onChange={onChangeInput}
              />
            </div>

            <div className="form-group w-full mb-5 relative">
              <TextField
                type={isPasswordShow === false ? "password" : "text"}
                id="password"
                label={t("login.password_label")}
                variant="outlined"
                className="w-full"
                name="password"
                value={formFields.password}
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

            <a
              className="link cursor-pointer text-[14px] font-[600]"
              // onClick={forgotPassword}
            >
              {t("login.forgot_password")}
            </a>

            <div className="flex items-center w-full mt-3 mb-3">
              <Button
                type="submit"
                disabled={!valideValue}
                className="btn-org btn-lg w-full flex gap-3"
              >
                {isLoading === true ? (
                  <CircularProgress color="inherit" />
                ) : (
                  t("login.login_button")
                )}
              </Button>
            </div>

            <p className="text-center">
              {t("login.not_registered")}{" "}
              <Link
                className="link text-[14px] font-[600] text-primary"
                href="/register"
              >
                {" "}
                {t("login.sign_up")}
              </Link>
            </p>

            {/* <p className="text-center font-[500]">Or continue with social account</p> */}

            {/* <Button className="flex gap-3 w-full !bg-[#f1f1f1] btn-lg !text-black"
                            onClick={authWithGoogle}>
                            <FcGoogle className="text-[20px]" /> Login with Google</Button> */}
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
