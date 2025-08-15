"use client";
import React, { useEffect, useState, useContext } from "react";
import { MyContext } from "@/context/ThemeProvider";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Button, CircularProgress } from "@mui/material";
import { fetchDataFromApi, postData, editData } from "@/utils/api";

const AddAddress = () => {
  const context = useContext(MyContext);

  const [serviceZones, setServiceZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  const [formFields, setFormFields] = useState({
    city: "",
    area: "",
    address_line1: "",
    landmark: "",
    mobile: "",
    addressType: "",
    userId: "",
  });

  useEffect(() => {
    if (context?.userData?._id) {
      setFormFields((prev) => ({ ...prev, userId: context.userData._id }));
    }

    fetchDataFromApi("/api/service-zones")
      .then((res) => {
        if (res?.error) {
          context.alertBox(
            "error",
            res.message || "Failed to fetch service zones"
          );
        } else if (res.success && res.data) {
          const zones = Object.keys(res.data).map((cityKey) => ({
            name: cityKey,
            ...res.data[cityKey],
          }));
          setServiceZones(zones);
        }
      })
      .catch(() => {
        context.alertBox("error", "Failed to fetch service zones");
      });
  }, [context?.userData]);

  useEffect(() => {
    if (context?.addressMode === "edit" && context?.addressId) {
      fetchDataFromApi(`/api/address/${context.addressId}`).then((res) => {
        const data = res?.address || {};
        setFormFields({
          city: data.city || "",
          area: data.area || "",
          address_line1: data.address_line1 || "",
          landmark: data.landmark || "",
          mobile: String(data.mobile || ""),
          addressType: data.addressType || "",
          userId: data.userId || "",
        });
        setPhone(String(data.mobile || ""));

        const zone = serviceZones.find((z) => z.name === data.city);
        if (zone) setSelectedZone(zone);
      });
    }
  }, [context?.addressMode, serviceZones]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    const zone = serviceZones.find((z) => z.name === cityName);
    setSelectedZone(zone);
    setFormFields((prev) => ({
      ...prev,
      city: cityName,
      area: "",
      addressType: zone?.doorStepService ? "Home Delivery" : "PickupPoint",
    }));
  };

  const handleAreaChange = (e) => {
    const areaName = e.target.value;
    setFormFields((prev) => ({
      ...prev,
      area: areaName,
    }));

    // Find the area object
    const areaObj = selectedZone?.areas?.find((a) => a.name === areaName);
    setSelectedArea(areaObj);

    setFormFields((prev) => ({
      ...prev,
      addressType: areaObj?.doorStep ? "Home Delivery" : "PickupPoint",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isDoorStep = selectedZone?.doorStepService;

    if (!formFields.city || !formFields.area || !formFields.mobile) {
      return context.alertBox("error", "Please fill required fields.");
    }

    if (isDoorStep && (!formFields.address_line1 || !formFields.landmark)) {
      return context.alertBox("error", "Please fill street and landmark.");
    }

    setIsLoading(true);
    try {
      const url =
        context.addressMode === "edit"
          ? `/api/address/${context.addressId}`
          : `/api/address/add`;

      const action = context.addressMode === "edit" ? editData : postData;
      const res = await action(url, formFields, { withCredentials: true });

      if (res?.error) {
        context.alertBox("error", res.message);
      } else {
        context.alertBox("success", res.message);
        context.setOpenAddressPanel(false);
        context.getUserDetails();
      }
    } catch (err) {
      context.alertBox("error", "Failed to save address.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="p-6 space-y-4" onSubmit={handleSubmit}>
      <TextField
        select
        fullWidth
        label="Select City"
        name="city"
        value={formFields.city}
        onChange={handleCityChange}
      >
        {serviceZones.map((zone) => (
          <MenuItem key={zone.name} value={zone.name}>
            {zone.name}
          </MenuItem>
        ))}
      </TextField>

      {selectedZone && (
        <>
          <TextField
            select
            fullWidth
            label="Select Area"
            name="area"
            value={formFields.area}
            onChange={handleAreaChange}
          >
            {selectedZone.areas?.map((area, i) => (
              <MenuItem key={i} value={area.name}>
                {area.name}
              </MenuItem>
            ))}
          </TextField>

          {selectedArea?.doorStep && (
            <>
              <TextField
                fullWidth
                label="Street"
                name="address_line1"
                value={formFields.address_line1}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Landmark"
                name="landmark"
                value={formFields.landmark}
                onChange={handleChange}
              />
            </>
          )}

          <PhoneInput
            country={"sy"}
            value={phone}
            onChange={(value) => {
              setPhone(value);
              setFormFields((prev) => ({ ...prev, mobile: value }));
            }}
          />

          <Button
            type="submit"
            variant="contained"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Save Address"}
          </Button>
        </>
      )}
    </form>
  );
};

export default AddAddress;
