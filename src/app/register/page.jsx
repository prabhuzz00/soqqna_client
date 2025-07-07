"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Breadcrumb from "@/components/Breadcrumb";
import { MyContext } from "@/context/ThemeProvider";
import { postData } from "@/utils/api";
import { useTranslation } from "@/utils/useTranslation";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    // phone: "",
    password: "",
  });

  const context = useContext(MyContext);
  const router = useRouter();
  const { t } = useTranslation();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const valideValue = Object.values(formFields).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await postData("/api/user/register", formFields);
      setIsLoading(false);
      if (res?.success) {
        setOtpSent(true);
        context.alertBox("success", res.message || "OTP sent successfully");
      } else {
        context.alertBox("error", res?.message || "Something went wrong");
      }
    } catch (err) {
      setIsLoading(false);
      context.alertBox("error", "Something went wrong. Please try again.");
    }
  };

  const handleOtpVerify = async () => {
    setIsLoading(true);
    try {
      const res = await postData("/api/user/verifyEmail", {
        email: formFields.email,
        otp,
      });
      setIsLoading(false);
      if (res?.success) {
        context.alertBox(
          "success",
          res.message || "Email verified successfully"
        );
        router.push("/login");
      } else {
        context.alertBox("error", res?.message || "Invalid or expired OTP");
      }
    } catch (err) {
      setIsLoading(false);
      context.alertBox("error", "Something went wrong during verification.");
    }
  };

  const handleAuthenticatedSession = useCallback(
    async (sessionData) => {
      if (isProcessing) return;
      setIsProcessing(true);
      const fields = {
        name: sessionData.user.name,
        email: sessionData.user.email,
        password: null,
        avatar: sessionData.user.image,
      };
      try {
        const res = await postData("/api/user/authWithGoogle", fields);
        Cookies.set("token", res.token, { expires: 30 });
        Cookies.set("useremail", fields.email);
        Cookies.set("accessToken", res?.data?.accesstoken);
        Cookies.set("refreshToken", res?.data?.refreshToken);
        context.setIsLogin(true);
        context.alertBox("success", "Login Successfully.");
        setTimeout(() => router.push("/"), 2000);
      } catch (error) {
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

  return (
    <>
      <Breadcrumb
        paths={[{ label: t("register.registerButton"), href: "/" }]}
      />
      <section className="section py-5 sm:py-10">
        <div className="container">
          <div className="card shadow-md w-full sm:w-[400px] m-auto rounded-md bg-white p-5 px-10">
            <h3 className="text-center text-[18px] text-black">
              {t("register.title")}
            </h3>
            <form className="w-full mt-5" onSubmit={handleSubmit}>
              {!otpSent ? (
                <>
                  <div className="form-group w-full mb-5">
                    <TextField
                      type="text"
                      id="name"
                      name="name"
                      value={formFields.name}
                      label={t("register.fullName")}
                      onChange={onChangeInput}
                      className="w-full mb-5"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-group w-full mb-5">
                    <TextField
                      type="email"
                      id="email"
                      name="email"
                      value={formFields.email}
                      label={t("register.email")}
                      onChange={onChangeInput}
                      className="w-full mb-5"
                      disabled={isLoading}
                    />
                  </div>
                 
                  <div className="relative form-group w-full mb-5">
                    <TextField
                      type={isPasswordShow ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formFields.password}
                      label={t("register.password")}
                      onChange={onChangeInput}
                      className="w-full"
                      disabled={isLoading}
                    />
                    <Button
                      className="!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black"
                      onClick={() => setIsPasswordShow(!isPasswordShow)}
                    >
                      {isPasswordShow === false ? (
                        <IoMdEye className="text-[20px] opacity-75" />
                      ) : (
                        <IoMdEyeOff className="text-[20px] opacity-75" />
                      )}
                    </Button>
                  </div>

                  <div className="form-group mb-4 text-[14px]">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formFields.terms || false}
                        onChange={(e) =>
                          setFormFields((prev) => ({
                            ...prev,
                            terms: e.target.checked,
                          }))
                        }
                      />
                      <span>
                        I agree to the{" "}
                        <Link
                          href="/terms-condition"
                          className="text-blue-600 underline"
                        >
                          terms and conditions
                        </Link>
                        .
                      </span>
                    </label>
                  </div>
                  <Button
                    type="submit"
                    disabled={!valideValue || !formFields.terms}
                    className="btn-org btn-lg w-full flex gap-3"
                  >
                    {isLoading ? (
                      <CircularProgress color="inherit" />
                    ) : (
                      t("register.registerButton")
                    )}
                  </Button>
                </>
              ) : (
                <div className="w-full mt-5">
                  <div className="form-group w-full mb-5">
                    <TextField
                      type="text"
                      value={otp}
                      label="Enter OTP"
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full mb-5"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // prevent form-like behavior
                          handleOtpVerify(); // call the OTP handler
                        }
                      }}
                    />
                  </div>
                  <Button
                    onClick={handleOtpVerify}
                    className="btn-org btn-lg w-full"
                  >
                    {isLoading ? (
                      <CircularProgress color="inherit" />
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                </div>
              )}
              <p className="text-center mt-3">
                {t("register.alreadyHaveAccount")}{" "}
                <Link
                  className="link text-[14px] font-[600] text-primary"
                  href="/login"
                >
                  {t("register.login")}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
