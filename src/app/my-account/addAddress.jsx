// "use client";
// import React, { useState, useEffect, useContext } from "react";
// import Radio from "@mui/material/Radio";
// import RadioGroup from "@mui/material/RadioGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import FormControl from "@mui/material/FormControl";
// import FormLabel from "@mui/material/FormLabel";
// import { MyContext } from "@/context/ThemeProvider";
// import TextField from "@mui/material/TextField";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { Button } from "@mui/material";
// import CircularProgress from "@mui/material/CircularProgress";
// import { editData, fetchDataFromApi, postData } from "@/utils/api";

// const AddAddress = () => {
//   const [phone, setPhone] = useState("");
//   const [addressType, setAddressType] = useState("");

//   const [formFields, setFormsFields] = useState({
//     address_line1: "",
//     city: "",
//     state: "",
//     country: "",
//     pincode: "",
//     mobile: "",
//     userId: "",
//     addressType: "",
//     landmark: "",
//   });

//   const [isLoading, setIsLoading] = useState(false);

//   const context = useContext(MyContext);

//   useEffect(() => {
//     if (context?.userData?._id !== undefined) {
//       setFormsFields((prevState) => ({
//         ...prevState,
//         userId: context?.userData?._id,
//       }));
//     }

//     const cachedAddress = localStorage.getItem("userLocation");
//     setTimeout(() => {
//       if (cachedAddress) {
//         let parsedAddress;
//         try {
//           parsedAddress = JSON.parse(cachedAddress);
//           console.log("Parsed address from cache:", parsedAddress);
//         } catch (err) {
//           const parts = cachedAddress.split(",");
//           parsedAddress = {
//             address_line1: parts[0] ? parts[0].trim() : "",
//             city: parts[1] ? parts[1].trim() : "",
//             state: parts[2] ? parts[2].trim() : "",
//             country: parts[3] ? parts[3].trim() : "",
//             pincode: parts[4] ? parts[4].trim() : "",
//           };
//         }
//         if (parsedAddress) {
//           setFormsFields((prevState) => ({
//             ...prevState,
//             address_line1: parsedAddress.address.address_line_1 || "",
//             city: parsedAddress.address.city || "",
//             state: parsedAddress.address.state || "",
//             country: parsedAddress.address.country || "",
//             pincode: parsedAddress.address.pincode || "",
//           }));
//         }
//       }
//     }, 100);
//   }, [context?.userData]);

//   const onChangeInput = (e) => {
//     const { name, value } = e.target;
//     setFormsFields(() => {
//       return {
//         ...formFields,
//         [name]: value,
//       };
//     });
//   };

//   const handleChangeAddressType = (event) => {
//     setAddressType(event.target.value);
//     setFormsFields(() => ({
//       ...formFields,
//       addressType: event.target.value,
//     }));
//   };

//   useEffect(() => {
//     if (context?.addressMode === "edit") {
//       fetchAddress(context?.addressId);
//     }
//   }, [context?.addressMode]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formFields.address_line1 === "") {
//       context.alertBox("error", "Please enter Address Line 1");
//       return false;
//     }

//     if (formFields.city === "") {
//       context.alertBox("error", "Please enter Your city name");
//       return false;
//     }

//     if (formFields.state === "") {
//       context.alertBox("error", "Please enter your state");
//       return false;
//     }

//     if (formFields.country === "") {
//       context.alertBox("error", "Please enter your country");
//       return false;
//     }

//     if (phone === "" || phone?.length < 5) {
//       context.alertBox("error", "Please enter your 10 digit mobile number a");
//       return false;
//     }

//     if (formFields.landmark === "") {
//       context.alertBox("error", "Please enter landmark");
//       return false;
//     }

//     if (formFields.addressType === "") {
//       context.alertBox("error", "Please select address type");
//       return false;
//     }

//     if (context?.addressMode === "add") {
//       setIsLoading(true);
//       postData(`/api/address/add`, formFields, { withCredentials: true }).then(
//         (res) => {
//           console.log(res);
//           if (res?.error !== true) {
//             // Save cached address from response to localStorage
//             localStorage.setItem("cachedAddress", JSON.stringify(res?.address));

//             context.alertBox("success", res?.message);
//             setTimeout(() => {
//               context.setOpenAddressPanel(false);
//               setIsLoading(false);
//             }, 500);

//             context.getUserDetails();

//             setFormsFields({
//               address_line1: "",
//               city: "",
//               state: "",
//               pincode: "",
//               country: "",
//               mobile: "",
//               userId: "",
//               addressType: "",
//               landmark: "",
//             });

//             setAddressType("");
//             setPhone("");
//           } else {
//             context.alertBox("error", res?.message);
//             setIsLoading(false);
//           }
//         }
//       );
//     }

//     if (context?.addressMode === "edit") {
//       setIsLoading(true);
//       editData(`/api/address/${context?.addressId}`, formFields, {
//         withCredentials: true,
//       }).then((res) => {
//         // Save cached address from response to localStorage
//         localStorage.setItem("cachedAddress", JSON.stringify(res?.address));

//         fetchDataFromApi(
//           `/api/address/get?userId=${context?.userData?._id}`
//         ).then((res) => {
//           setTimeout(() => {
//             setIsLoading(false);
//             context.setOpenAddressPanel(false);
//           }, 500);
//           context?.getUserDetails(res.data);

//           setFormsFields({
//             address_line1: "",
//             city: "",
//             state: "",
//             pincode: "",
//             country: "",
//             mobile: "",
//             userId: "",
//             addressType: "",
//             landmark: "",
//           });

//           setAddressType("");
//           setPhone("");
//         });
//       });
//     }
//   };

//   const fetchAddress = (id) => {
//     fetchDataFromApi(`/api/address/${id}`).then((res) => {
//       setFormsFields({
//         address_line1: res?.address?.address_line1,
//         city: res?.address?.city,
//         state: res?.address?.state,
//         pincode: res?.address?.pincode,
//         country: res?.address?.country,
//         mobile: res?.address?.mobile,
//         userId: res?.address?.userId,
//         addressType: res?.address?.addressType,
//         landmark: res?.address?.landmark,
//       });

//       const ph = `"${res?.address?.mobile}"`;
//       setPhone(ph);
//       setAddressType(res?.address?.addressType);
//     });
//   };

//   return (
//     <form className="p-8 py-3 pb-8 px-4" onSubmit={handleSubmit}>
//       <div className="col w-[100%] mb-4">
//         <TextField
//           className="w-full"
//           label="Address Line 1"
//           variant="outlined"
//           size="small"
//           name="address_line1"
//           onChange={onChangeInput}
//           value={formFields.address_line1}
//         />
//       </div>

//       <div className="col w-[100%] mb-4">
//         <TextField
//           className="w-full"
//           label="City"
//           variant="outlined"
//           size="small"
//           name="city"
//           onChange={onChangeInput}
//           value={formFields.city}
//         />
//       </div>

//       <div className="col w-[100%] mb-4">
//         <TextField
//           className="w-full"
//           label="State"
//           variant="outlined"
//           size="small"
//           name="state"
//           onChange={onChangeInput}
//           value={formFields.state}
//         />
//       </div>

//       <div className="col w-[100%] mb-4">
//         <TextField
//           className="w-full"
//           label="Pincode"
//           variant="outlined"
//           size="small"
//           name="pincode"
//           onChange={onChangeInput}
//           value={formFields.pincode}
//         />
//       </div>

//       <div className="col w-[100%] mb-4">
//         <TextField
//           className="w-full"
//           label="Country"
//           variant="outlined"
//           size="small"
//           name="country"
//           onChange={onChangeInput}
//           value={formFields.country}
//         />
//       </div>

//       <div className="col w-[100%] mb-4">
//         <PhoneInput
//           defaultCountry="+963"
//           value={phone}
//           onChange={(phone) => {
//             setPhone(phone);
//             setFormsFields((prevState) => ({
//               ...prevState,
//               mobile: phone,
//             }));
//           }}
//           excludeCountries={["il", "IL"]} // Try both lowercase and uppercase ISO codes
//         />
//       </div>

//       <div className="col w-[100%] mb-4">
//         <TextField
//           className="w-full"
//           label="Landmark"
//           variant="outlined"
//           size="small"
//           name="landmark"
//           onChange={onChangeInput}
//           value={formFields.landmark}
//         />
//       </div>

//       <div className="flex gap-5 pb-5 flex-col">
//         <FormControl>
//           <FormLabel id="demo-row-radio-buttons-group-label">
//             Address Type
//           </FormLabel>
//           <RadioGroup
//             row
//             aria-labelledby="demo-row-radio-buttons-group-label"
//             name="row-radio-buttons-group"
//             className="flex items-center gap-5"
//             value={addressType}
//             onChange={handleChangeAddressType}
//           >
//             <FormControlLabel value="Home" control={<Radio />} label="Home" />
//             <FormControlLabel
//               value="Office"
//               control={<Radio />}
//               label="Office"
//             />
//           </RadioGroup>
//         </FormControl>
//       </div>

//       <div className="flex items-center gap-5">
//         <Button
//           type="submit"
//           className="btn-org btn-lg w-full flex gap-2 items-center"
//         >
//           {isLoading === true ? <CircularProgress color="inherit" /> : "Save"}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default AddAddress;

// "use client";
// import React, { useEffect, useState, useContext } from "react";
// import { MyContext } from "@/context/ThemeProvider";
// import TextField from "@mui/material/TextField";
// import MenuItem from "@mui/material/MenuItem";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { Button, CircularProgress } from "@mui/material";
// import { fetchDataFromApi, postData } from "@/utils/api";

// const AddAddress = () => {
//   const context = useContext(MyContext);

//   const [serviceZones, setServiceZones] = useState([]);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [phone, setPhone] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const [formFields, setFormFields] = useState({
//     city: "",
//     area: "",
//     street: "",
//     landmark: "",
//     mobile: "",
//     addressType: "",
//     userId: "",
//   });

//   useEffect(() => {
//     if (context?.userData?._id) {
//       setFormFields((prev) => ({ ...prev, userId: context.userData._id }));
//     }

//     fetchDataFromApi("/api/service-zones")
//       .then((res) => {
//         if (res?.error) {
//           context.alertBox(
//             "error",
//             res.message || "Failed to fetch service zones"
//           );
//         } else if (res.success && res.data) {
//           const zones = Object.keys(res.data).map((cityKey) => ({
//             name: cityKey,
//             ...res.data[cityKey],
//           }));
//           setServiceZones(zones);
//         }
//       })
//       .catch(() => {
//         context.alertBox("error", "Failed to fetch service zones");
//       });
//   }, [context?.userData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormFields((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCityChange = (e) => {
//     const cityName = e.target.value;
//     const zone = serviceZones.find((z) => z.name === cityName);
//     setSelectedZone(zone);
//     setFormFields((prev) => ({
//       ...prev,
//       city: cityName,
//       area: "",
//       addressType: zone.doorStepService ? "Home Delivery" : "PickupPoint",
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formFields.city || !formFields.area || !formFields.mobile) {
//       return context.alertBox("error", "Please fill required fields.");
//     }

//     if (
//       selectedZone?.doorStepService &&
//       (!formFields.street || !formFields.landmark)
//     ) {
//       return context.alertBox(
//         "error",
//         "Please fill all fields for Home Delivery."
//       );
//     }

//     setIsLoading(true);
//     try {
//       const res = await postData("/api/address/add", formFields, {
//         withCredentials: true,
//       });
//       if (res?.error) {
//         context.alertBox("error", res.message);
//       } else {
//         context.alertBox("success", res.message);
//         context.setOpenAddressPanel(false);
//         context.getUserDetails();
//       }
//     } catch (err) {
//       context.alertBox("error", "Failed to save address.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form className="p-6 space-y-4" onSubmit={handleSubmit}>
//       <TextField
//         select
//         fullWidth
//         label="Select City"
//         name="city"
//         value={formFields.city}
//         onChange={handleCityChange}
//       >
//         {serviceZones.map((zone) => (
//           <MenuItem key={zone.name} value={zone.name}>
//             {zone.name}
//           </MenuItem>
//         ))}
//       </TextField>

//       {selectedZone && (
//         <>
//           <TextField
//             select
//             fullWidth
//             label="Select Area"
//             name="area"
//             value={formFields.area}
//             onChange={handleChange}
//           >
//             {selectedZone.areas?.map((area, i) => (
//               <MenuItem key={i} value={area}>
//                 {area}
//               </MenuItem>
//             ))}
//           </TextField>

//           {selectedZone.doorStepService && (
//             <>
//               <TextField
//                 fullWidth
//                 label="Street"
//                 name="street"
//                 value={formFields.street}
//                 onChange={handleChange}
//               />
//               <TextField
//                 fullWidth
//                 label="Landmark"
//                 name="landmark"
//                 value={formFields.landmark}
//                 onChange={handleChange}
//               />
//             </>
//           )}

//           <PhoneInput
//             country={"in"}
//             value={phone}
//             onChange={(value) => {
//               setPhone(value);
//               setFormFields((prev) => ({ ...prev, mobile: value }));
//             }}
//           />

//           <Button
//             type="submit"
//             variant="contained"
//             className="w-full"
//             disabled={isLoading}
//           >
//             {isLoading ? <CircularProgress size={24} /> : "Save Address"}
//           </Button>
//         </>
//       )}
//     </form>
//   );
// };

// export default AddAddress;

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
            onChange={handleChange}
          >
            {selectedZone.areas?.map((area, i) => (
              <MenuItem key={i} value={area}>
                {area}
              </MenuItem>
            ))}
          </TextField>

          {selectedZone.doorStepService && (
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
