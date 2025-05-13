"use client";
import React, { useContext, useEffect, useState } from "react";
import OtpBox from "@/components/OtpBox";
import Button from "@mui/material/Button";
import { MyContext } from "@/context/ThemeProvider";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { postData } from "@/utils/api";

const VerifyAccount = () => {
  const [otp, setOtp] = useState("");
  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const router = useRouter();
  const context = useContext(MyContext);

  const verityOTP = (e) => {
    e.preventDefault();

    const actionType = Cookies.get("actionType");

    if (actionType !== "forgot-password") {
      postData("/api/user/verifyEmail", {
        email: Cookies.get("userphone"),
        otp: otp,
      }).then((res) => {
        if (res?.error === false) {
          context.alertBox("success", res?.message);
          Cookies.get("userphone");
          router.push("/login");
        } else {
          context.alertBox("error", res?.message);
        }
      });
    } else {
      postData("/api/user/verify-forgot-password-otp", {
        email: Cookies.get("userphone"),
        otp: otp,
      }).then((res) => {
        if (res?.error === false) {
          context.alertBox("success", res?.message);
          router.push("/forgot-password");
        } else {
          context.alertBox("error", res?.message);
        }
      });
    }
  };

  return (
    <section className="section py-5 lg:py-10">
      <div className="container">
        <div className="card shadow-md w-full sm:w-[400px] m-auto rounded-md bg-white p-5 px-10">
          <div className="text-center flex items-center justify-center">
            <img src="/verify3.png" width="80" alt="image" />
          </div>
          <h3 className="text-center text-[18px] text-black mt-4 mb-1">
            Verify OTP
          </h3>

          <p className="text-center mt-0 mb-4">
            OTP send to{" "}
            <span className="text-primary font-bold">
              {Cookies.get("userphone")}
            </span>
          </p>

          <form onSubmit={verityOTP}>
            <OtpBox length={6} onChange={handleOtpChange} />

            <div className="flex items-center justify-center mt-5 px-3">
              <Button type="submit" className="w-full btn-org btn-lg">
                Verify OTP
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default VerifyAccount;
