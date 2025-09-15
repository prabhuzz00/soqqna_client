"use client";

import { MyContext } from "@/context/ThemeProvider";
import React, { useContext, useEffect, useState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { patchData, postData } from "@/utils/api";

import { useSession, signIn } from "next-auth/react";
import { useTranslation } from "@/utils/useTranslation";
import Breadcrumb from "@/components/Breadcrumb";

const LoginPage = () => {
  const context = useContext(MyContext);
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formFields, setFormsFields] = useState({
    identifier: "",
    password: "",
  });

  const { data: session, status } = useSession();

  const [redirectPath, setRedirectPath] = useState("/");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/";
      setRedirectPath(redirect);
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    const token = Cookies.get("accessToken");
    if (token !== undefined && token !== null && token !== "") {
      router.push("/");
    }
  }, [router]);

  const forgotPassword = () => {
    if (formFields.identifier === "") {
      context.alertBox("error", t("login.error_identifier_required"));
      return false;
    } else {
      const isEmail = formFields.identifier.includes("@");
      const payload = isEmail
  ? { email: formFields.identifier.toLowerCase() }
        : { phone: formFields.identifier };

      context.alertBox("success", `OTP send to ${formFields.identifier}`);

      postData("/api/user/forgot-password", payload).then((res) => {
        if (res?.error === false) {
          context.alertBox("success", res?.message);
          Cookies.set("userphone", formFields.identifier);
          Cookies.set("actionType", "forgot-password");
          router.push("/verifyAccount");
        } else {
          context.alertBox("error", res?.message);
        }
      });
    }
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormsFields(() => ({
      ...formFields,
      [name]: value,
    }));
  };

  const valideValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.identifier === "") {
      context.alertBox("error", t("login.error_identifier_required"));
      return false;
    }
    if (formFields.password === "") {
      context.alertBox("error", t("login.error_password_required"));
      return false;
    }

    const isEmail = formFields.identifier.includes("@");
    const payload = {
      password: formFields.password,
      ...(isEmail
  ? { email: formFields.identifier.toLowerCase() }
        : { phone: formFields.identifier }),
    };

    postData("/api/user/login", payload, { withCredentials: true }).then(
      (res) => {
        if (res?.error !== true) {
          setIsLoading(false);
          context.alertBox("success", res?.message);
          setFormsFields({
            identifier: "",
            password: "",
          });

          Cookies.set("accessToken", res?.data?.accesstoken);
          Cookies.set("refreshToken", res?.data?.refreshToken);

          context.setIsLogin(true);
          router.push(redirectPath);
        } else {
          context.alertBox("error", res?.message);
          setIsLoading(false);
        }
      }
    );
  };

  // Handles Google authenticated session
  const handleAuthenticatedGoogleSession = useCallback(
    async (sessionData) => {
      if (isProcessing) return;
      setIsProcessing(true);

      const fields = {
        name: sessionData.user.name,
        email: sessionData.user.email,
        avatar: sessionData.user.image,
        phone: "",
        role: "USER",
      };

      try {
        const res = await postData("/api/user/authWithGoogle", fields);

        Cookies.set("accessToken", res?.data?.accesstoken);
        Cookies.set("refreshToken", res?.data?.refreshToken);

        context.setIsLogin(true);
        context.alertBox("success", t("login.success_login"));

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } catch (error) {
        context.alertBox("error", "An error occurred during Google sign-in.");
      } finally {
        setIsProcessing(false);
      }
    },
    [context, router, t, isProcessing]
  );

  // Handles Facebook authenticated session
  const handleAuthenticatedFacebookSession = useCallback(
    async (sessionData) => {
      if (isProcessing) return;
      setIsProcessing(true);

      const fields = {
        name: sessionData.user.name,
        email: sessionData.user.email,
        avatar: sessionData.user.image,
        phone: "",
        role: "USER",
      };

      try {
        const res = await postData("/api/user/authWithFacebook", fields);

        Cookies.set("accessToken", res?.data?.accesstoken);
        Cookies.set("refreshToken", res?.data?.refreshToken);

        context.setIsLogin(true);
        // context.alertBox("success", "Facebook login successful!");

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } catch (error) {
        context.alertBox("error", "An error occurred during Facebook sign-in.");
      } finally {
        setIsProcessing(false);
      }
    },
    [context, router, isProcessing]
  );

  useEffect(() => {
    if (status === "authenticated" && session && !isProcessing) {
      // Detect provider from session (Google or Facebook)
      // If you use next-auth v4+ session includes provider info in session?.user?.provider or session?.provider
      // If not, heuristically check email domain or other properties, but ideally you should add provider info to session in your next-auth callbacks
      if (
        session?.provider === "facebook" ||
        session?.user?.provider === "facebook"
      ) {
        handleAuthenticatedFacebookSession(session);
      } else {
        handleAuthenticatedGoogleSession(session);
      }
    }
  }, [
    status,
    session,
    isProcessing,
    handleAuthenticatedGoogleSession,
    handleAuthenticatedFacebookSession,
  ]);

  const authWithGoogle = () => {
    signIn("google");
  };

  const authWithFacebook = () => {
    signIn("facebook");
  };

  return (
    <>
      <Breadcrumb
        paths={[
          {
            label: "Login",
            href: `/`,
          },
        ]}
      />
      <section className="py-5 section sm:py-10">
        <div className="container">
          <div className="card shadow-md w-full sm:w-[400px] m-auto rounded-md bg-white p-5 px-10">
            <h3 className="text-center text-[18px] text-black">
              {t("login.title")}
            </h3>

            <form className="w-full mt-5" onSubmit={handleSubmit}>
              <div className="w-full mb-5 form-group">
                <TextField
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formFields.identifier}
                  disabled={isLoading}
                  label={t("login.identifier_label")}
                  variant="outlined"
                  className="w-full"
                  onChange={onChangeInput}
                />
              </div>

              <div className="relative w-full mb-5 form-group">
                <TextField
                  type={isPasswordShow ? "text" : "password"}
                  id="password"
                  label={t("login.password_label")}
                  variant="outlined"
                  className="w-full"
                  name="password"
                  autoComplete="off"
                  value={formFields.password}
                  disabled={isLoading}
                  onChange={onChangeInput}
                />
                <Button
                  className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black"
                  onClick={() => setIsPasswordShow(!isPasswordShow)}
                >
                  {isPasswordShow ? (
                    <IoMdEyeOff className="text-[20px] opacity-75" />
                  ) : (
                    <IoMdEye className="text-[20px] opacity-75" />
                  )}
                </Button>
              </div>

              <a
                className="link cursor-pointer text-[14px] font-[600]"
                onClick={forgotPassword}
              >
                {t("login.forgot_password")}
              </a>

              <div className="flex items-center w-full mt-3 mb-3">
                <Button
                  type="submit"
                  disabled={!valideValue}
                  className="flex w-full gap-3 btn-org btn-lg"
                >
                  {isLoading ? (
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

              <div className="social-login-section mt-6">
                <div className="divider text-center mb-6">
                  <span className="bg-white px-2 text-gray-500">
                    {t("login.or_continue_with")}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* <Button
                    type="button"
                    onClick={authWithGoogle}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
                  >
                    <FcGoogle className="text-xl" />
                    <span>{t("login.google")}</span>
                  </Button> */}

                  <Button
                    type="button"
                    onClick={authWithFacebook}
                    className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-md hover:bg-[#1666d1]"
                  >
                    <FaFacebook className="text-xl" />
                    <span>{t("login.facebook")}</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
