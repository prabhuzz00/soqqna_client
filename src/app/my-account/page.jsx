"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import AccountSidebar from "../../components/AccountSidebar";
import { MyContext } from "@/context/ThemeProvider";
import CircularProgress from "@mui/material/CircularProgress";
import { Collapse } from "react-collapse";
// import { PhoneInput } from 'react-international-phone';
// import 'react-international-phone/style.css';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Ensure styles are imported

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { editData, postData } from "@/utils/api";
import { useTranslation } from "@/utils/useTranslation";
import Breadcrumb from "@/components/Breadcrumb";

const MyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [userId, setUserId] = useState("");
  const [isChangePasswordFormShow, setisChangePasswordFormShow] =
    useState(false);
  const [phone, setPhone] = useState("");

  const [formFields, setFormsFields] = useState({
    name: "",
    // email: "",
    phone: "",
  });

  const [changePassword, setChangePassword] = useState({
    // email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const context = useContext(MyContext);
  const router = useRouter();
  const { t } = useTranslation();

  // useEffect(() => {
  //   const token = Cookies.get("accessToken");

  //   if (token === null) {
  //     router.push("/");
  //   }
  // }, [context?.isLogin]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (context?.isLogin === false) {
      router.push("/login");
    }
  }, [context?.isLogin, router]);

  useEffect(() => {
    if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
      setUserId(context?.userData?._id);
      setTimeout(() => {
        setFormsFields({
          name: context?.userData?.name,
          // email: context?.userData?.email,
          phone: context?.userData?.phone,
        });
      }, 200);
      const ph = `"${context?.userData?.phone}"`;
      setPhone(ph);

      setChangePassword({
        // email: context?.userData?.email,
      });
    }
  }, [context?.userData]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormsFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });

    setChangePassword(() => {
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

    if (formFields.name === "") {
      context.alertBox("error", "Please enter full name");
      return false;
    }

    // if (formFields.email === "") {
    //   context.alertBox("error", "Please enter email id");
    //   return false;
    // }

    if (formFields.phone === "") {
      context.alertBox("error", "Please enter phone number");
      return false;
    }

    editData(`/api/user/${userId}`, formFields, { withCredentials: true }).then(
      (res) => {
        if (res?.error !== true) {
          setIsLoading(false);
          context.alertBox("success", res?.data?.message);
        } else {
          context.alertBox("error", res?.data?.message);
          setIsLoading(false);
        }
      }
    );
  };

  const valideValue2 = Object.values(formFields).every((el) => el);

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();

    setIsLoading2(true);

    if (changePassword.oldPassword === "") {
      context.alertBox("error", "Please enter old password");
      return false;
    }

    if (changePassword.newPassword === "") {
      context.alertBox("error", "Please enter new password");
      return false;
    }

    if (changePassword.confirmPassword === "") {
      context.alertBox("error", "Please enter confirm password");
      return false;
    }

    if (changePassword.confirmPassword !== changePassword.newPassword) {
      context.alertBox("error", "password and confirm password not match");
      return false;
    }

    postData(`/api/user/reset-password`, changePassword, {
      withCredentials: true,
    }).then((res) => {
      if (res?.error !== true) {
        setIsLoading2(false);
        context.alertBox("success", res?.message);
      } else {
        context.alertBox("error", res?.message);
        setIsLoading2(false);
      }
    });
  };

  return (
    <>
      <Breadcrumb
        paths={[
          {
            label: "My Profile",
            href: `/`,
          },
        ]}
      />
      <section className="py-3 lg:py-10 w-full">
        <div className="container flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-[20%]">
            <AccountSidebar />
          </div>

          <div className="col2 w-full lg:w-[50%]">
            <div className="card bg-white p-5 shadow-md rounded-md mb-5">
              <div className="flex items-center pb-3">
                <h2 className="pb-0">{t("myaccount.myProfile")}</h2>
                <Button
                  className="!ml-auto !font-bold"
                  onClick={() =>
                    setisChangePasswordFormShow(!isChangePasswordFormShow)
                  }
                >
                  {t("myaccount.changePassword")}
                </Button>
              </div>
              <hr />

              <form className="mt-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ">
                  <div className="col">
                    <TextField
                      label={t("myaccount.fullName")}
                      variant="outlined"
                      size="small"
                      className="w-full"
                      name="name"
                      value={formFields.name}
                      disabled={isLoading === true ? true : false}
                      onChange={onChangeInput}
                    />
                  </div>

                  {/* <div className="col">
                  <TextField
                    type="email"
                    label={t("myaccount.email")}
                    variant="outlined"
                    size="small"
                    className="w-full"
                    name="email"
                    value={formFields.email}
                    disabled={true}
                    onChange={onChangeInput}
                  />
                </div> */}

                  <div className="col">
                    <PhoneInput
                      defaultCountry="+963"
                      value={phone}
                      disabled={isLoading === true ? true : false}
                      onChange={(phone) => {
                        setPhone(phone);
                        setFormsFields({
                          phone: phone,
                        });
                      }}
                      excludeCountries={["il", "IL"]} // Try both lowercase and uppercase ISO codes
                    />
                  </div>
                </div>

                <br />

                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={!valideValue}
                    className="btn-org btn-sm w-[150px]"
                  >
                    {isLoading === true ? (
                      <CircularProgress color="inherit" />
                    ) : (
                      t("myaccount.updateProfile")
                    )}
                  </Button>
                </div>
              </form>
            </div>

            <Collapse isOpened={isChangePasswordFormShow}>
              <div className="card bg-white p-5 shadow-md rounded-md">
                <div className="flex items-center pb-3">
                  <h2 className="pb-0">{t("myaccount.changePassword")}</h2>
                </div>
                <hr />

                <form className="mt-8" onSubmit={handleSubmitChangePassword}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {context?.userData?.signUpWithGoogle === false && (
                      <div className="col">
                        <TextField
                          label={t("myaccount.oldPassword")}
                          variant="outlined"
                          size="small"
                          className="w-full"
                          name="oldPassword"
                          value={changePassword.oldPassword}
                          disabled={isLoading2 === true ? true : false}
                          onChange={onChangeInput}
                        />
                      </div>
                    )}

                    <div className="col">
                      <TextField
                        type="text"
                        label={t("myaccount.newPassword")}
                        variant="outlined"
                        size="small"
                        className="w-full"
                        name="newPassword"
                        value={changePassword.newPassword}
                        onChange={onChangeInput}
                      />
                    </div>

                    <div className="col">
                      <TextField
                        label={t("myaccount.confirmPassword")}
                        variant="outlined"
                        size="small"
                        className="w-full"
                        name="confirmPassword"
                        value={changePassword.confirmPassword}
                        onChange={onChangeInput}
                      />
                    </div>
                  </div>

                  <br />

                  <div className="flex items-center gap-4">
                    <Button type="submit" className="btn-org btn-sm w-[200px]">
                      {isLoading2 === true ? (
                        <CircularProgress color="inherit" />
                      ) : (
                        t("myaccount.changePassword")
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Collapse>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyAccount;
