"use client";
import React, { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "@/context/ThemeProvider";
import { vendorPostData } from "@/utils/api";
import { useRouter } from "next/navigation";
import PasswordField from "../../components/PasswordField";
import { useTranslation } from "@/utils/useTranslation";

const BecomeVendor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    storeName: "",
    storeDescription: "",
    ownerName: "",
    emailAddress: "",
    password: "",
    phoneNumber: "",
    storeAddress: "",
    storeLogo: null,
    storeBanner: null,
    productCategories: [],
    commissionRate: "",
    paymentDetails: "",
    taxIdentificationNumber: "",
    termsAgreement: false,
    isVerified: false,
    status: true,
  });

  const context = useContext(MyContext);
  const router = useRouter();
  const { t } = useTranslation();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onChangeFile = (e) => {
    const { name, files } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const onChangeCategories = (e) => {
    setFormFields((prev) => ({
      ...prev,
      productCategories: e.target.value,
    }));
  };

  const onChangeTerms = (e) => {
    setFormFields((prev) => ({
      ...prev,
      termsAgreement: e.target.checked,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "storeName",
      "storeDescription",
      "ownerName",
      "emailAddress",
      "password",
      "phoneNumber",
      "storeAddress",
      "commissionRate",
      "paymentDetails",
      "termsAgreement",
    ];
    return requiredFields.every((field) => {
      if (field === "termsAgreement") return formFields[field] === true;
      if (field === "password") return formFields[field].length >= 6;
      return formFields[field] !== "";
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      context.alertBox(
        "error",
        "Please fill all required fields, agree to terms, and ensure password is at least 6 characters."
      );
      setIsLoading(false);
      return;
    }

    console.log("formFields:", formFields);

    const formData = new FormData();
    Object.keys(formFields).forEach((key) => {
      if (key === "productCategories") {
        formData.append(key, JSON.stringify(formFields[key] || []));
      } else if (key === "storeLogo" || key === "storeBanner") {
        if (formFields[key]) {
          formData.append(key, formFields[key]);
        }
      } else {
        formData.append(key, formFields[key]);
      }
    });

    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const res = await vendorPostData("/api/vendor", formData);
      if (res?.error) {
        context.alertBox("error", res?.message);
      } else {
        context.alertBox(
          "success",
          "Vendor application submitted successfully."
        );
        setFormFields({
          storeName: "",
          storeDescription: "",
          ownerName: "",
          emailAddress: "",
          password: "",
          phoneNumber: "",
          storeAddress: "",
          storeLogo: null,
          storeBanner: null,
          productCategories: [],
          commissionRate: "",
          paymentDetails: "",
          taxIdentificationNumber: "",
          termsAgreement: false,
          isVerified: false,
          status: true,
        });
        // router.push("/vendor-confirmation");
      }
    } catch (error) {
      context.alertBox("error", "An error occurred during submission.");
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section py-5 sm:py-10">
      <div className="container">
        <div className="card shadow-md w-full sm:w-[600px] m-auto rounded-md bg-white p-5 px-10">
          <h3 className="text-center text-[18px] text-black">
            {t("addvendor.becomeVendor")}
          </h3>

          <form className="w-full mt-5" onSubmit={handleSubmit}>
            <div className="form-group w-full mb-5">
              <TextField
                type="text"
                id="storeName"
                name="storeName"
                value={formFields.storeName}
                disabled={isLoading}
                label={t("addvendor.storeName")}
                variant="outlined"
                className="w-full"
                onChange={onChangeInput}
                required
              />
            </div>

            <div className="form-group w-full mb-5">
              <TextField
                type="text"
                id="storeDescription"
                name="storeDescription"
                value={formFields.storeDescription}
                disabled={isLoading}
                label={t("addvendor.storeDescription")}
                variant="outlined"
                multiline
                rows={4}
                className="w-full"
                onChange={onChangeInput}
                required
              />
            </div>

            <div className="form-group w-full mb-5">
              <TextField
                type="text"
                id="ownerName"
                name="ownerName"
                value={formFields.ownerName}
                disabled={isLoading}
                label={t("addvendor.ownerName")}
                variant="outlined"
                className="w-full"
                onChange={onChangeInput}
                required
              />
            </div>

            <div className="form-group w-full mb-5">
              <TextField
                type="email"
                id="emailAddress"
                name="emailAddress"
                value={formFields.emailAddress}
                disabled={isLoading}
                label={t("addvendor.emailAddress")}
                variant="outlined"
                className="w-full"
                onChange={onChangeInput}
                required
              />
            </div>

            <div className="form-group w-full mb-5">
              <PasswordField
                id="password"
                name="password"
                value={formFields.password}
                onChange={onChangeInput}
                disabled={isLoading}
                label={t("addvendor.password")}
                required
              />
            </div>

            <div className="form-group w-full mb-5">
              <TextField
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formFields.phoneNumber}
                disabled={isLoading}
                label={t("addvendor.phoneNumber")}
                variant="outlined"
                className="w-full"
                onChange={onChangeInput}
                required
              />
            </div>

            <div className="form-group w-full mb-5">
              <TextField
                type="text"
                id="storeAddress"
                name="storeAddress"
                value={formFields.storeAddress}
                disabled={isLoading}
                label={t("addvendor.storeAddress")}
                variant="outlined"
                className="w-full"
                onChange={onChangeInput}
                required
              />
            </div>

            <div className="form-group w-full mb-5">
              <Button
                variant="contained"
                component="label"
                disabled={isLoading}
              >
                {t("addvendor.uploadStoreLogo")}
                <input
                  type="file"
                  name="storeLogo"
                  hidden
                  accept="image/*"
                  onChange={onChangeFile}
                />
              </Button>
              {formFields.storeLogo && <p>{formFields.storeLogo.name}</p>}
            </div>

            <div className="form-group w-full mb-5">
              <Button
                variant="contained"
                component="label"
                disabled={isLoading}
              >
                {t("addvendor.uploadStoreBanner")}
                <input
                  type="file"
                  name="storeBanner"
                  hidden
                  accept="image/*"
                  onChange={onChangeFile}
                />
              </Button>
              {formFields.storeBanner && <p>{formFields.storeBanner.name}</p>}
            </div>

            <div className="form-group w-full mb-5">
              <FormControl fullWidth>
                <InputLabel id="product-categories-label">
                  {t("addvendor.storeName")}
                </InputLabel>
                <Select
                  labelId="product-categories-label"
                  id="productCategories"
                  name="productCategories"
                  multiple
                  value={formFields.productCategories}
                  onChange={onChangeCategories}
                  label={t("addvendor.productCategories")}
                  disabled={isLoading}
                >
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="clothing">Clothing</MenuItem>
                  <MenuItem value="home">Home & Garden</MenuItem>
                  <MenuItem value="books">Books</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* <div className="form-group w-full mb-5">
              <TextField
                type="number"
                id="commissionRate"
                name="commissionRate"
                value={formFields.commissionRate}
                disabled={isLoading}
                label="Commission Rate (%)"
                variant="outlined"
                className="w-full"
                onChange={onChangeInput}
                required
              />
            </div> */}

            <div className="form-group w-full mb-5">
              <TextField
                type="text"
                id="paymentDetails"
                name="paymentDetails"
                value={formFields.paymentDetails}
                disabled={isLoading}
                label={t("addvendor.paymentDetails")}
                variant="outlined"
                className="w-full"
                onChange={onChangeInput}
                required
              />
            </div>

            <div className="form-group w-full mb-5">
              <TextField
                type="text"
                id="taxIdentificationNumber"
                name="taxIdentificationNumber"
                value={formFields.taxIdentificationNumber}
                disabled={isLoading}
                label={t("addvendor.taxIdentificationNumber")}
                variant="outlined"
                className="w-full"
                onChange={onChangeInput}
              />
            </div>

            <div className="form-group w-full mb-5">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formFields.termsAgreement}
                    onChange={onChangeTerms}
                    name="termsAgreement"
                    disabled={isLoading}
                  />
                }
                label={t("addvendor.agreeTerms")}
              />
            </div>

            <div className="flex items-center w-full mt-3 mb-3">
              <Button
                type="submit"
                disabled={isLoading || !validateForm()}
                className="btn-org btn-lg w-full flex gap-3"
              >
                {isLoading ? (
                  <CircularProgress color="inherit" />
                ) : (
                  t("addvendor.submitApplication")
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BecomeVendor;
