// "use client";
// import React, { useContext, useEffect, useState, useRef } from "react";
// import Image from "next/image";
// import { Button } from "@mui/material";
// import { BsFillBagCheckFill } from "react-icons/bs";
// import { FaPlus } from "react-icons/fa6";
// import Radio from "@mui/material/Radio";
// import axios from "axios";
// import CircularProgress from "@mui/material/CircularProgress";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { deleteData, postData, fetchDataFromApi } from "@/utils/api"; // MOD (added fetchDataFromApi)
// import Script from "next/script";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import Breadcrumb from "@/components/Breadcrumb";
// import { MyContext } from "@/context/ThemeProvider";

// const Checkout = () => {
//   /* ---------- state ---------- */
//   const [userData, setUserData] = useState(null);
//   const [isChecked, setIsChecked] = useState(0);
//   const [selectedAddress, setSelectedAddress] = useState("");
//   const [totalAmount, setTotalAmount] = useState(0); // cart subtotal
//   const [discountedAmount, setDiscountedAmount] = useState(0); // coupon-adjusted subtotal
//   const [shippingSetting, setShippingSetting] = useState({
//     // NEW
//     deliveryFee: 0,
//     FreeDeliveryFee: 0,
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [isJsBarcodeLoaded, setIsJsBarcodeLoaded] = useState(false);
//   const [barcode, setBarcode] = useState("");
//   const [couponCode, setCouponCode] = useState("");
//   const [couponMessage, setCouponMessage] = useState("");
//   const [couponError, setCouponError] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [availableCoupons, setAvailableCoupons] = useState([]);

//   /* ---------- hooks ---------- */
//   const context = useContext(MyContext);
//   const router = useRouter();
//   const invoiceRef = useRef();

//   /* ---------- helper for money ---------- */
//   const moneyFmt = (v) =>
//     v.toLocaleString("en-US", { style: "currency", currency: "USD" });

//   /* ---------- on mount: scroll, user, shipping ---------- */
//   useEffect(() => {
//     if (typeof window !== "undefined") window.scrollTo(0, 0);
//     setUserData(context?.userData);
//     setSelectedAddress(context?.userData?.address_details?.[0]?._id);

//     // NEW: fetch shipping settings once
//     fetchDataFromApi("/api/shipping-cost").then((res) => {
//       if (res?.success && res?.data) {
//         const { deliveryFee = 0, FreeDeliveryFee = 0 } = res.data;
//         setShippingSetting({ deliveryFee, FreeDeliveryFee });
//       }
//     });
//   }, [context?.userData]);

//   /* ---------- recalc subtotal when cart changes ---------- */
//   useEffect(() => {
//     const amt = context.cartData?.length
//       ? context.cartData
//           .map((i) => parseInt(i.price) * i.quantity)
//           .reduce((a, b) => a + b, 0)
//       : 0;

//     setTotalAmount(amt);
//     setDiscountedAmount(amt);
//     setAppliedCoupon(null);
//     setCouponCode("");
//     setCouponMessage("");
//     setCouponError("");
//   }, [context.cartData]);

//   /* ---------- fetch coupons ---------- */
//   useEffect(() => {
//     const fetchCoupons = async () => {
//       try {
//         const { data } = await axios.get(
//           `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons?isActive=true`
//         );
//         const valid = data.coupons.filter(
//           (c) => new Date(c.expiryDate) >= new Date()
//         );
//         setAvailableCoupons(valid);
//       } catch (err) {
//         console.error("Failed to fetch coupons:", err);
//       }
//     };
//     fetchCoupons();
//   }, []);

//   /* ---------- shipping + final calculations ---------- */
//   const shippingCost =
//     (appliedCoupon ? discountedAmount : totalAmount) >=
//     shippingSetting.FreeDeliveryFee
//       ? 0
//       : shippingSetting.deliveryFee; // NEW

//   const finalAmount =
//     (appliedCoupon ? discountedAmount : totalAmount) + shippingCost; // NEW

//   /* ---------- PayPal integration ---------- */
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_APP_PAYPAL_CLIENT_ID}&disable-funding=card`;
//     script.async = true;
//     script.onload = () => {
//       window.paypal
//         .Buttons({
//           createOrder: async () => {
//             // currency conversion INR ➜ USD
//             const resp = await fetch(
//               "https://v6.exchangerate-api.com/v6/8f85eea95dae9336b9ea3ce9/latest/INR"
//             );
//             const j = await resp.json();
//             let converted = 0;
//             if (j.result === "success") {
//               const usdToInr = j.conversion_rates.USD;
//               converted = (finalAmount * usdToInr).toFixed(2); // MOD
//             }

//             const headers = {
//               Authorization: `Bearer ${Cookies.get("accessToken")}`,
//               "Content-Type": "application/json",
//             };

//             const { data } = await axios.get(
//               `${process.env.NEXT_PUBLIC_APP_API_URL}/api/order/create-order-paypal?userId=${context?.userData?._id}&totalAmount=${converted}`,
//               { headers }
//             );
//             return data.id;
//           },
//           onApprove: async (d) => onApprovePayment(d),
//           onError: (err) => {
//             router.push("/my-orders/failed");
//             console.error("PayPal onError:", err);
//           },
//         })
//         .render("#paypal-button-container");
//     };
//     document.body.appendChild(script);

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [context?.cartData, context?.userData, selectedAddress, finalAmount]); // MOD deps

//   /* ---------- coupon logic ---------- */
//   const applyCoupon = async (code) => {
//     setCouponMessage("");
//     setCouponError("");
//     if (!code) return setCouponError("Please enter a coupon code");

//     const token =
//       Cookies.get("accessToken") || localStorage.getItem("accessToken");
//     if (!token) {
//       setCouponError("Please log in to apply a coupon");
//       router.push("/login");
//       return;
//     }

//     try {
//       const { data } = await axios.post(
//         `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons/validate`,
//         { code, orderAmount: totalAmount },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setAppliedCoupon({
//         code,
//         discount: data.discount,
//         couponId: data.couponId,
//       });
//       setDiscountedAmount(totalAmount - data.discount);
//       setCouponMessage(data.message);
//       setCouponCode(code);
//     } catch (err) {
//       setCouponError(err.response?.data?.error);
//       setAppliedCoupon(null);
//       setDiscountedAmount(totalAmount);
//     }
//   };

//   const handleCouponSelect = (c) => applyCoupon(c.code);

//   /* ---------- payment helpers ---------- */
//   const onApprovePayment = async (data) => {
//     const info = {
//       userId: context?.userData?._id,
//       products: context?.cartData,
//       payment_status: "COMPLETE",
//       delivery_address: selectedAddress,
//       totalAmount: finalAmount, // MOD
//       couponId: appliedCoupon?.couponId || null,
//       date: new Date().toLocaleString("en-US", {
//         month: "short",
//         day: "2-digit",
//         year: "numeric",
//       }),
//     };

//     const headers = {
//       Authorization: `Bearer ${Cookies.get("accessToken")}`,
//       "Content-Type": "application/json",
//     };

//     await axios
//       .post(
//         `${process.env.NEXT_PUBLIC_APP_API_URL}/api/order/capture-order-paypal`,
//         { ...info, paymentId: data.orderID },
//         { headers }
//       )
//       .then((res) => {
//         context.alertBox("success", res?.data?.message);
//         if (appliedCoupon?.couponId) {
//           axios.post(
//             `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons/${appliedCoupon.couponId}/use`,
//             {},
//             { headers }
//           );
//         }
//         deleteData(`/api/cart/emptyCart/${context?.userData?._id}`).then(() =>
//           context.getCartItems()
//         );
//         router.push("/my-orders/success");
//       });
//   };
//   const editAddress = (id) => {
//     context?.setOpenAddressPanel(true);
//     context?.setAddressMode("edit");
//     context?.setAddressId(id);
//   };

//   const handleChange = (e, index) => {
//     if (e.target.checked) {
//       setIsChecked(index);
//       setSelectedAddress(e.target.value);
//     }
//   };

//   /* ---------- Razorpay checkout ---------- */
//   const checkout = (e) => {
//     e.preventDefault();
//     if (!userData?.address_details?.length)
//       return context.alertBox("error", "Please add address");

//     const opts = {
//       key: process.env.NEXT_PUBLIC_APP_RAZORPAY_KEY_ID,
//       key_secret: process.env.NEXT_PUBLIC_APP_RAZORPAY_KEY_SECRET,
//       amount: parseInt(finalAmount * 100), // MOD
//       currency: "USD",
//       order_receipt: context?.userData?.name,
//       name: "Advanced UI Techniques",
//       description: "for testing purpose",
//       handler: function (response) {
//         const payLoad = {
//           userId: context?.userData?._id,
//           products: context?.cartData,
//           paymentId: response.razorpay_payment_id,
//           payment_status: "COMPLETED",
//           delivery_address: selectedAddress,
//           totalAmt: finalAmount, // MOD
//           couponId: appliedCoupon?.couponId || null,
//           date: new Date().toLocaleString("en-US", {
//             month: "short",
//             day: "2-digit",
//             year: "numeric",
//           }),
//         };

//         postData(`/api/order/create`, payLoad).then((res) => {
//           if (res.error) {
//             context.alertBox("error", res.message);
//             router.push("/my-orders/failed");
//           } else {
//             context.alertBox("success", res.message);
//             if (appliedCoupon?.couponId) {
//               axios.post(
//                 `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons/${appliedCoupon.couponId}/use`,
//                 {},
//                 {
//                   headers: {
//                     Authorization: `Bearer ${Cookies.get("accessToken")}`,
//                     "Content-Type": "application/json",
//                   },
//                 }
//               );
//             }
//             deleteData(`/api/cart/emptyCart/${context?.userData?._id}`).then(
//               () => context.getCartItems()
//             );
//             router.push("/my-orders/success");
//           }
//         });
//       },
//       theme: { color: "#ff5252" },
//     };

//     new window.Razorpay(opts).open();
//   };

//   /* ---------- Cash on Delivery ---------- */
//   const cashOnDelivery = () => {
//     if (!userData?.address_details?.length)
//       return context.alertBox("error", "Please add address");

//     setIsLoading(true);

//     const stamp = Date.now().toString();
//     const rand = Math.floor(1e8 + Math.random() * 9e8).toString();
//     const genBarcode = (stamp + rand).slice(0, 20);
//     setBarcode(genBarcode);

//     const payLoad = {
//       userId: context?.userData?._id,
//       products: context?.cartData,
//       paymentId: "",
//       payment_status: "CASH ON DELIVERY",
//       delivery_address: selectedAddress,
//       totalAmt: finalAmount, // MOD
//       barcode: genBarcode,
//       couponId: appliedCoupon?.couponId || null,
//       couponCode: appliedCoupon?.code || null,
//       couponDiscount: appliedCoupon?.discount || null,
//       date: new Date().toLocaleString("en-US", {
//         month: "short",
//         day: "2-digit",
//         year: "numeric",
//       }),
//     };

//     postData(`/api/order/create`, payLoad).then((res) => {
//       setIsLoading(false);
//       if (res.error) return context.alertBox("error", res.message);

//       context.alertBox("success", res.message);
//       if (appliedCoupon?.couponId) {
//         axios.post(
//           `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons/${appliedCoupon.couponId}/use`,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${Cookies.get("accessToken")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//       }
//       deleteData(`/api/cart/emptyCart/${context?.userData?._id}`).then(() =>
//         context.getCartItems()
//       );
//       router.push("/my-orders/success");
//     });
//   };

//   /* ---------- JSX ---------- */
//   return (
//     <>
//       <Breadcrumb paths={[{ label: "Checkout", href: "/" }]} />

//       <section className="py-3 lg:py-10 px-3">
//         <form onSubmit={checkout}>
//           <div className="w-full lg:w-[70%] m-auto flex flex-col md:flex-row gap-5">
//             {/* ---------- LEFT column (addresses) ---------- */}

//             <div className="leftCol w-full md:w-[60%]">
//               <div className="card bg-white shadow-md p-5 rounded-md w-full">
//                 <div className="flex items-center justify-between">
//                   <h2>Select Delivery Address</h2>
//                   {userData?.address_details?.length !== 0 && (
//                     <Button
//                       variant="outlined"
//                       className="btn !font-bold"
//                       onClick={() => {
//                         context?.setOpenAddressPanel(true);
//                         context?.setAddressMode("add");
//                       }}
//                     >
//                       <FaPlus />
//                       ADD {context?.windowWidth < 767 ? "" : " NEW ADDRESS"}
//                     </Button>
//                   )}
//                 </div>
//                 <br />

//                 <div className="flex flex-col gap-4">
//                   {userData?.address_details?.length !== 0 ? (
//                     userData?.address_details?.map((address, index) => (
//                       <label
//                         className={`flex gap-3 p-4 border border-[rgba(0,0,0,0.1)] rounded-md relative ${
//                           isChecked === index && "bg-[#fff2f2]"
//                         }`}
//                         key={index}
//                       >
//                         <div>
//                           <Radio
//                             size="small"
//                             onChange={(e) => handleChange(e, index)}
//                             checked={isChecked === index}
//                             value={address?._id}
//                           />
//                         </div>
//                         <div className="info">
//                           <span className="inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md">
//                             {address?.addressType}
//                           </span>
//                           <h3>{userData?.name}</h3>
//                           <p className="mt-0 mb-0">
//                             {address?.address_line1 +
//                               " " +
//                               address?.city +
//                               " " +
//                               address?.country +
//                               " " +
//                               address?.state +
//                               " " +
//                               address?.landmark +
//                               " " +
//                               "+ " +
//                               address?.mobile}
//                           </p>
//                           <p className="mb-0 font-[500]">
//                             {userData?.mobile !== null
//                               ? "+" + userData?.mobile
//                               : "+" + address?.mobile}
//                           </p>
//                         </div>
//                         <Button
//                           variant="text"
//                           className="!absolute top-[15px] right-[15px] !font-bold"
//                           size="small"
//                           onClick={() => editAddress(address?._id)}
//                         >
//                           EDIT
//                         </Button>
//                       </label>
//                     ))
//                   ) : (
//                     <>
//                       <div className="flex items-center mt-5 justify-between flex-col p-5">
//                         <Image
//                           src="/map.png"
//                           width={100}
//                           height={100}
//                           alt="map"
//                         />
//                         <h2 className="text-center">
//                           No Addresses found in your account!
//                         </h2>
//                         <p className="mt-0">Add a delivery address.</p>
//                         <Button
//                           className="btn-org"
//                           onClick={() => {
//                             context?.setOpenAddressPanel(true);
//                             context?.setAddressMode("add");
//                           }}
//                         >
//                           ADD ADDRESS
//                         </Button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* ---------- RIGHT column (order summary) ---------- */}
//             <div className="rightCol w-full md:w-[40%]">
//               <div className="card shadow-md bg-white p-5 rounded-md">
//                 <h2 className="mb-4">Your Order</h2>

//                 <div className="flex items-center justify-between py-3 border-t border-b border-[rgba(0,0,0,0.1)]">
//                   <span className="text-[14px] font-[600]">Product</span>
//                   <span className="text-[14px] font-[600]">Subtotal</span>
//                 </div>

//                 <div
//                   ref={invoiceRef}
//                   className="mb-5 overflow-x-hidden pr-2 invoice-content"
//                 >
//                   {context?.cartData?.length !== 0 &&
//                     context.cartData.map((item, index) => (
//                       <div
//                         className="flex items-center justify-between py-2"
//                         key={index}
//                       >
//                         <div className="part1 flex items-center gap-3">
//                           <div className="img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer">
//                             <Image
//                               src={item?.image}
//                               width={50}
//                               height={50}
//                               className="w-full transition-all group-hover:scale-105"
//                               alt={item?.productTitle}
//                             />
//                           </div>
//                           <div className="info">
//                             <h4
//                               className="text-[14px]"
//                               title={item?.productTitle}
//                             >
//                               {item?.productTitle}
//                             </h4>
//                             <span className="text-[13px]">
//                               Qty: {item?.quantity}
//                             </span>
//                           </div>
//                         </div>
//                         <span className="text-[14px] font-[500]">
//                           {moneyFmt(item.quantity * item.price)}
//                         </span>
//                       </div>
//                     ))}

//                   {/* ---------- SUMMARY footer ---------- */}
//                   <div className="invoice-footer">
//                     {appliedCoupon && (
//                       <h3>
//                         <strong>Discount:</strong>{" "}
//                         {moneyFmt(appliedCoupon.discount)}
//                       </h3>
//                     )}
//                     <h3>
//                       <strong>Shipping:</strong>{" "}
//                       {shippingCost === 0 ? "FREE" : moneyFmt(shippingCost)}
//                     </h3>
//                     <h3>
//                       <strong>Grand Total:</strong> {moneyFmt(finalAmount)}
//                     </h3>
//                   </div>
//                 </div>

//                 <div className="flex items-center flex-col gap-3 mb-2">
//                   <Button
//                     type="submit"
//                     className="btn-org btn-lg w-full flex gap-2 items-center"
//                   >
//                     <BsFillBagCheckFill className="text-[20px]" /> Checkout
//                   </Button>

//                   <div
//                     id="paypal-button-container"
//                     className={`${
//                       userData?.address_details?.length === 0
//                         ? "pointer-events-none"
//                         : ""
//                     }`}
//                   ></div>

//                   <Button
//                     type="button"
//                     className="btn-dark btn-lg w-full flex gap-2 items-center"
//                     onClick={cashOnDelivery}
//                   >
//                     {isLoading ? (
//                       <CircularProgress />
//                     ) : (
//                       <>
//                         <BsFillBagCheckFill className="text-[20px]" />
//                         Cash on Delivery
//                       </>
//                     )}
//                   </Button>

//                   {/* ---------- Coupon UI remains unchanged ---------- */}
//                   <div className="coupon-section mt-4 w-full">
//                     <h3 className="text-[14px] font-[600] mb-2">
//                       Apply Coupon
//                     </h3>
//                     <div className="flex gap-2 mb-3">
//                       <input
//                         type="text"
//                         value={couponCode}
//                         onChange={(e) =>
//                           setCouponCode(e.target.value.toUpperCase())
//                         }
//                         placeholder="Enter coupon code"
//                         className="border border-[rgba(0,0,0,0.1)] rounded-md p-2 w-full"
//                       />
//                       <Button
//                         variant="contained"
//                         className="btn-org"
//                         onClick={() => applyCoupon(couponCode)}
//                         disabled={isLoading}
//                       >
//                         Apply
//                       </Button>
//                     </div>
//                     {couponMessage && (
//                       <p className="text-green-600 text-[13px] mb-2">
//                         {couponMessage}
//                       </p>
//                     )}
//                     {couponError && (
//                       <p className="text-red-600 text-[13px] mb-2">
//                         {couponError}
//                       </p>
//                     )}
//                     {availableCoupons.length > 0 && (
//                       <div className="coupon-list">
//                         <h4 className="text-[13px] font-[500] mb-2">
//                           Available Coupons
//                         </h4>
//                         <div className="flex flex-col gap-2">
//                           {availableCoupons.map((coupon) => (
//                             <div
//                               key={coupon._id}
//                               className={`border border-[rgba(0,0,0,0.1)] p-3 rounded-md cursor-pointer hover:bg-[#fff2f2] ${
//                                 appliedCoupon?.couponId === coupon._id
//                                   ? "bg-[#fff2f2]"
//                                   : ""
//                               }`}
//                               onClick={() => handleCouponSelect(coupon)}
//                             >
//                               <p className="text-[14px] font-[600]">
//                                 {coupon.code}
//                               </p>
//                               <p className="text-[13px]">
//                                 {coupon.discountType === "percentage"
//                                   ? `${coupon.discountValue}% off`
//                                   : `${coupon.discountValue.toLocaleString(
//                                       "en-US",
//                                       {
//                                         style: "currency",
//                                         currency: "USD",
//                                       }
//                                     )} off`}{" "}
//                                 {coupon.maxDiscountAmount
//                                   ? `(up to ${coupon.maxDiscountAmount.toLocaleString(
//                                       "en-US",
//                                       {
//                                         style: "currency",
//                                         currency: "USD",
//                                       }
//                                     )})`
//                                   : ""}
//                               </p>
//                               <p className="text-[12px] text-gray-600">
//                                 Min. order:{" "}
//                                 {coupon.minOrderAmount.toLocaleString("en-US", {
//                                   style: "currency",
//                                   currency: "USD",
//                                 })}
//                               </p>
//                               <p className="text-[12px] text-gray-600">
//                                 Expires:{" "}
//                                 {new Date(
//                                   coupon.expiryDate
//                                 ).toLocaleDateString()}
//                               </p>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </section>

//       <Script
//         src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"
//         onLoad={() => setIsJsBarcodeLoaded(true)}
//       />
//       <Script src="https://checkout.razorpay.com/v1/checkout.js" />

//       <style jsx>{`
//         .invoice-content {
//           padding: 20px;
//           font-family: Arial, sans-serif;
//           width: 100%;
//         }
//         .invoice-footer {
//           margin-top: 20px;
//           border-top: 2px solid #000;
//           padding-top: 10px;
//         }
//         .invoice-footer h3 {
//           font-size: 18px;
//           margin: 0;
//         }
//         .coupon-section input {
//           text-transform: uppercase;
//         }
//         .coupon-list {
//           max-height: 200px;
//           overflow-y: auto;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Checkout;

"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormLabel,
} from "@mui/material";
import Image from "next/image";
import { Button } from "@mui/material";
import { BsFillBagCheckFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import Radio from "@mui/material/Radio";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { deleteData, postData, fetchDataFromApi } from "@/utils/api"; // MOD (added fetchDataFromApi)
import Script from "next/script";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Breadcrumb from "@/components/Breadcrumb";
import { MyContext } from "@/context/ThemeProvider";
import { SERVICE_ZONES } from "@/context/serviceZones";

export const validateCOD = (addr) => {
  if (!addr) return { ok: false }; // no address at all

  const city = (addr.city || "").toLowerCase();
  const state = (addr.state || "").toLowerCase();
  const line1 = (addr.address_line1 || "").toLowerCase();

  const cityKey = Object.keys(SERVICE_ZONES).find((k) => {
    const low = k.toLowerCase();
    return city.includes(low) || state.includes(low);
  });

  if (cityKey) {
    const match = SERVICE_ZONES[cityKey].find((a) =>
      line1.includes(a.toLowerCase())
    );
    if (match) return { ok: true, pickup: match }; // fully served street
  }
  // otherwise: need a manual pick-up selection
  return {
    ok: false,
    cityKey,
    areas: cityKey ? SERVICE_ZONES[cityKey] : [],
  };
};

const Checkout = () => {
  /* ---------- state ---------- */
  const [userData, setUserData] = useState(null);
  const [isChecked, setIsChecked] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [totalAmount, setTotalAmount] = useState(0); // cart subtotal
  const [discountedAmount, setDiscountedAmount] = useState(0); // coupon-adjusted subtotal
  const [shippingSetting, setShippingSetting] = useState({
    // NEW
    deliveryFee: 0,
    FreeDeliveryFee: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isJsBarcodeLoaded, setIsJsBarcodeLoaded] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  const [showPickupModal, setShowPickupModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState(""); // modal step 1
  const [pickupChoices, setPickupChoices] = useState([]); // modal step 2
  const [selectedPickup, setSelectedPickup] = useState(""); // user’s choice
  const [pendingCOD, setPendingCOD] = useState(null); // remembers addr & amt

  /* ---------- hooks ---------- */
  const context = useContext(MyContext);
  const router = useRouter();
  const invoiceRef = useRef();

  /* ---------- helper for money ---------- */
  const moneyFmt = (v) =>
    v.toLocaleString("en-US", { style: "currency", currency: "USD" });

  /* ---------- on mount: scroll, user, shipping ---------- */
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
    setUserData(context?.userData);
    setSelectedAddress(context?.userData?.address_details?.[0]?._id);

    // NEW: fetch shipping settings once
    fetchDataFromApi("/api/shipping-cost").then((res) => {
      if (res?.success && res?.data) {
        const { deliveryFee = 0, FreeDeliveryFee = 0 } = res.data;
        setShippingSetting({ deliveryFee, FreeDeliveryFee });
      }
    });
  }, [context?.userData]);

  /* ---------- recalc subtotal when cart changes ---------- */
  useEffect(() => {
    const amt = context.cartData?.length
      ? context.cartData
          .map((i) => parseInt(i.price) * i.quantity)
          .reduce((a, b) => a + b, 0)
      : 0;

    setTotalAmount(amt);
    setDiscountedAmount(amt);
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMessage("");
    setCouponError("");
  }, [context.cartData]);

  /* ---------- fetch coupons ---------- */
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons?isActive=true&isAdmin=false`
        );
        const valid = data.coupons.filter(
          (c) => new Date(c.expiryDate) >= new Date()
        );
        setAvailableCoupons(valid);
      } catch (err) {
        console.error("Failed to fetch coupons:", err);
      }
    };
    fetchCoupons();
  }, []);

  /* ---------- shipping + final calculations ---------- */
  const shippingCost =
    (appliedCoupon ? discountedAmount : totalAmount) >=
    shippingSetting.FreeDeliveryFee
      ? 0
      : shippingSetting.deliveryFee; // NEW

  const finalAmount =
    (appliedCoupon ? discountedAmount : totalAmount) + shippingCost; // NEW

  /* ---------- PayPal integration ---------- */
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_APP_PAYPAL_CLIENT_ID}&disable-funding=card`;
    script.async = true;
    script.onload = () => {
      window.paypal
        .Buttons({
          createOrder: async () => {
            // currency conversion INR ➜ USD
            const resp = await fetch(
              "https://v6.exchangerate-api.com/v6/8f85eea95dae9336b9ea3ce9/latest/INR"
            );
            const j = await resp.json();
            let converted = 0;
            if (j.result === "success") {
              const usdToInr = j.conversion_rates.USD;
              converted = (finalAmount * usdToInr).toFixed(2); // MOD
            }

            const headers = {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
              "Content-Type": "application/json",
            };

            const { data } = await axios.get(
              `${process.env.NEXT_PUBLIC_APP_API_URL}/api/order/create-order-paypal?userId=${context?.userData?._id}&totalAmount=${converted}`,
              { headers }
            );
            return data.id;
          },
          onApprove: async (d) => onApprovePayment(d),
          onError: (err) => {
            router.push("/my-orders/failed");
            console.error("PayPal onError:", err);
          },
        })
        .render("#paypal-button-container");
    };
    document.body.appendChild(script);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.cartData, context?.userData, selectedAddress, finalAmount]); // MOD deps

  /* ---------- coupon logic ---------- */
  const applyCoupon = async (code) => {
    setCouponMessage("");
    setCouponError("");
    if (!code) return setCouponError("Please enter a coupon code");

    const token =
      Cookies.get("accessToken") || localStorage.getItem("accessToken");
    if (!token) {
      setCouponError("Please log in to apply a coupon");
      router.push("/login");
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons/validate`,
        { code, orderAmount: totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppliedCoupon({
        code,
        discount: data.discount,
        couponId: data.couponId,
      });
      setDiscountedAmount(totalAmount - data.discount);
      setCouponMessage(data.message);
      setCouponCode(code);
    } catch (err) {
      setCouponError(err.response?.data?.error);
      setAppliedCoupon(null);
      setDiscountedAmount(totalAmount);
    }
  };

  const handleCouponSelect = (c) => applyCoupon(c.code);

  /* ---------- payment helpers ---------- */
  const onApprovePayment = async (data) => {
    const info = {
      userId: context?.userData?._id,
      products: context?.cartData,
      payment_status: "COMPLETE",
      delivery_address: selectedAddress,
      totalAmount: finalAmount, // MOD
      couponId: appliedCoupon?.couponId || null,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    const headers = {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
      "Content-Type": "application/json",
    };

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/order/capture-order-paypal`,
        { ...info, paymentId: data.orderID },
        { headers }
      )
      .then((res) => {
        context.alertBox("success", res?.data?.message);
        if (appliedCoupon?.couponId) {
          axios.post(
            `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons/${appliedCoupon.couponId}/use`,
            {},
            { headers }
          );
        }
        deleteData(`/api/cart/emptyCart/${context?.userData?._id}`).then(() =>
          context.getCartItems()
        );
        router.push("/my-orders/success");
      });
  };
  const editAddress = (id) => {
    context?.setOpenAddressPanel(true);
    context?.setAddressMode("edit");
    context?.setAddressId(id);
  };

  const handleChange = (e, index) => {
    if (e.target.checked) {
      setIsChecked(index);
      setSelectedAddress(e.target.value);
    }
  };

  /* ---------- Razorpay checkout ---------- */
  const checkout = (e) => {
    e.preventDefault();
    if (!userData?.address_details?.length)
      return context.alertBox("error", "Please add address");

    const opts = {
      key: process.env.NEXT_PUBLIC_APP_RAZORPAY_KEY_ID,
      key_secret: process.env.NEXT_PUBLIC_APP_RAZORPAY_KEY_SECRET,
      amount: parseInt(finalAmount * 100), // MOD
      currency: "USD",
      order_receipt: context?.userData?.name,
      name: "Advanced UI Techniques",
      description: "for testing purpose",
      handler: function (response) {
        const payLoad = {
          userId: context?.userData?._id,
          products: context?.cartData,
          paymentId: response.razorpay_payment_id,
          payment_status: "COMPLETED",
          delivery_address: selectedAddress,
          totalAmt: finalAmount, // MOD
          couponId: appliedCoupon?.couponId || null,
          date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
        };

        postData(`/api/order/create`, payLoad).then((res) => {
          if (res.error) {
            context.alertBox("error", res.message);
            router.push("/my-orders/failed");
          } else {
            context.alertBox("success", res.message);
            if (appliedCoupon?.couponId) {
              axios.post(
                `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons/${appliedCoupon.couponId}/use`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                    "Content-Type": "application/json",
                  },
                }
              );
            }
            deleteData(`/api/cart/emptyCart/${context?.userData?._id}`).then(
              () => context.getCartItems()
            );
            router.push("/my-orders/success");
          }
        });
      },
      theme: { color: "#ff5252" },
    };

    new window.Razorpay(opts).open();
  };

  /* ---------- Cash on Delivery ---------- */
  const cashOnDelivery = () => {
    if (!userData?.address_details?.length)
      return context.alertBox("error", "Please add address");

    const addr = userData?.address_details?.find(
      (a) => a._id === selectedAddress
    );

    const v = validateCOD(addr);
    if (!v.ok) {
      // open the modal instead of proceeding
      setSelectedCity(v.cityKey || "");
      setPickupChoices(v.cityKey ? v.areas : []);
      setSelectedPickup("");
      setShowPickupModal(true);
      setPendingCOD({ addr, finalAmount }); // stash payload pieces
      return; // stop here; wait for modal
    }

    const pickupPoint = v.pickup || null;

    setIsLoading(true);

    const stamp = Date.now().toString();
    const rand = Math.floor(1e8 + Math.random() * 9e8).toString();
    const genBarcode = (stamp + rand).slice(0, 20);
    setBarcode(genBarcode);

    const payLoad = {
      userId: context?.userData?._id,
      products: context?.cartData,
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: selectedAddress,
      totalAmt: finalAmount, // MOD
      barcode: genBarcode,
      couponId: appliedCoupon?.couponId || null,
      couponCode: appliedCoupon?.code || null,
      couponDiscount: appliedCoupon?.discount || null,
      pickupPoint: "DoorStep",
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    postData(`/api/order/create`, payLoad).then((res) => {
      setIsLoading(false);
      if (res.error) return context.alertBox("error", res.message);

      context.alertBox("success", res.message);
      if (appliedCoupon?.couponId) {
        axios.post(
          `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons/${appliedCoupon.couponId}/use`,
          {},
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      context.clearCart();
      router.push("/my-orders/success");
    });
  };

  /* ---------- JSX ---------- */
  return (
    <>
      <Breadcrumb paths={[{ label: "Checkout", href: "/" }]} />

      <section className="py-3 lg:py-10 px-3">
        <form onSubmit={checkout}>
          <div className="w-full lg:w-[70%] m-auto flex flex-col md:flex-row gap-5">
            {/* ---------- LEFT column (addresses) ---------- */}

            <div className="leftCol w-full md:w-[60%]">
              <div className="card bg-white shadow-md p-5 rounded-md w-full">
                <div className="flex items-center justify-between">
                  <h2>Select Delivery Address</h2>
                  {userData?.address_details?.length !== 0 && (
                    <Button
                      variant="outlined"
                      className="btn !font-bold"
                      onClick={() => {
                        context?.setOpenAddressPanel(true);
                        context?.setAddressMode("add");
                      }}
                    >
                      <FaPlus />
                      ADD {context?.windowWidth < 767 ? "" : " NEW ADDRESS"}
                    </Button>
                  )}
                </div>
                <br />

                <div className="flex flex-col gap-4">
                  {userData?.address_details?.length !== 0 ? (
                    userData?.address_details?.map((address, index) => (
                      <label
                        className={`flex gap-3 p-4 border border-[rgba(0,0,0,0.1)] rounded-md relative ${
                          isChecked === index && "bg-[#fff2f2]"
                        }`}
                        key={index}
                      >
                        <div>
                          <Radio
                            size="small"
                            onChange={(e) => handleChange(e, index)}
                            checked={isChecked === index}
                            value={address?._id}
                          />
                        </div>
                        <div className="info">
                          <span className="inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md">
                            {address?.addressType}
                          </span>
                          <h3>{userData?.name}</h3>
                          <p className="mt-0 mb-0">
                            {address?.address_line1 +
                              " " +
                              address?.city +
                              " " +
                              address?.country +
                              " " +
                              address?.state +
                              " " +
                              address?.landmark +
                              " " +
                              "+ " +
                              address?.mobile}
                          </p>
                          <p className="mb-0 font-[500]">
                            {userData?.mobile !== null
                              ? "+" + userData?.mobile
                              : "+" + address?.mobile}
                          </p>
                        </div>
                        <Button
                          variant="text"
                          className="!absolute top-[15px] right-[15px] !font-bold"
                          size="small"
                          onClick={() => editAddress(address?._id)}
                        >
                          EDIT
                        </Button>
                      </label>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center mt-5 justify-between flex-col p-5">
                        <Image
                          src="/map.png"
                          width={100}
                          height={100}
                          alt="map"
                        />
                        <h2 className="text-center">
                          No Addresses found in your account!
                        </h2>
                        <p className="mt-0">Add a delivery address.</p>
                        <Button
                          className="btn-org"
                          onClick={() => {
                            context?.setOpenAddressPanel(true);
                            context?.setAddressMode("add");
                          }}
                        >
                          ADD ADDRESS
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ---------- RIGHT column (order summary) ---------- */}
            <div className="rightCol w-full md:w-[40%]">
              <div className="card shadow-md bg-white p-5 rounded-md">
                <h2 className="mb-4">Your Order</h2>

                <div className="flex items-center justify-between py-3 border-t border-b border-[rgba(0,0,0,0.1)]">
                  <span className="text-[14px] font-[600]">Product</span>
                  <span className="text-[14px] font-[600]">Subtotal</span>
                </div>

                <div
                  ref={invoiceRef}
                  className="mb-5 overflow-x-hidden !p-0 pr-2 invoice-content"
                >
                  {context?.cartData?.length !== 0 &&
                    context.cartData.map((item, index) => (
                      <div
                        className="flex items-center justify-between py-2"
                        key={index}
                      >
                        <div className="part1 flex items-center gap-3">
                          <div className="img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer">
                            <Image
                              src={item?.image}
                              width={50}
                              height={50}
                              className="w-full transition-all group-hover:scale-105"
                              alt={item?.productTitle}
                            />
                          </div>
                          <div className="info">
                            <h4
                              className="text-[14px]"
                              title={item?.productTitle}
                            >
                              {item?.productTitle}
                            </h4>
                            <span className="text-[13px]">
                              Qty: {item?.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="text-[14px] font-[500]">
                          {moneyFmt(item.quantity * item.price)}
                        </span>
                      </div>
                    ))}

                  {/* ---------- SUMMARY footer ---------- */}
                  <div className="invoice-footer">
                    {appliedCoupon && (
                      <h3 className="!text-[16px] flex items-center justify-between py-1">
                        <span className="font-[600]">Discount:</span>{" "}
                        <span className="font-[500] text-[14px]">
                          {" "}
                          {moneyFmt(appliedCoupon.discount)}
                        </span>
                      </h3>
                    )}
                    <h3 className="!text-[16px] flex items-center justify-between py-1">
                      <span className="font-[600]">Shipping:</span>{" "}
                      <span className="font-[500] text-[14px]">
                        {" "}
                        {shippingCost === 0 ? "FREE" : moneyFmt(shippingCost)}
                      </span>
                    </h3>
                    <h3 className="!text-[16px] flex items-center justify-between py-1">
                      <span className="font-[600]">Grand Total:</span>
                      <span className="font-[500] text-[14px]">
                        {moneyFmt(finalAmount)}
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center flex-col gap-3 mb-2">
                  {/* <Button
                    type="submit"
                    className="btn-org btn-lg w-full flex gap-2 items-center"
                  >
                    <BsFillBagCheckFill className="text-[20px]" /> Checkout
                  </Button> */}

                  <Button
                    type="button"
                    className="btn-dark btn-lg w-full flex gap-2 items-center"
                    onClick={cashOnDelivery}
                  >
                    {isLoading ? (
                      <CircularProgress />
                    ) : (
                      <>
                        <BsFillBagCheckFill className="text-[20px]" />
                        Cash on Delivery
                      </>
                    )}
                  </Button>

                  {/* ---------- Coupon UI remains unchanged ---------- */}
                  <div className="coupon-section mt-4 w-full">
                    <h3 className="text-[14px] font-[600] mb-2">
                      Apply Coupon
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter coupon code"
                        className="border border-[rgba(0,0,0,0.1)] rounded-sm p-2 w-full h-[35px] focus:outline-none text-[14px] focus:border-[rgba(0,0,0,0.3)]"
                      />
                      <Button
                        variant="contained"
                        className="btn-org btn-sm"
                        onClick={() => applyCoupon(couponCode)}
                        disabled={isLoading}
                      >
                        Apply
                      </Button>
                    </div>
                    {couponMessage && (
                      <p className="text-green-600 text-[13px] mb-2">
                        {couponMessage}
                      </p>
                    )}
                    {couponError && (
                      <p className="text-red-600 text-[13px] mb-2">
                        {couponError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {availableCoupons.length > 0 && (
                <div className="coupon-list card p-3 rounded-md bg-white shadow-md mt-3">
                  <h4 className="text-[16px] font-[500] mb-2">
                    Available Coupons
                  </h4>
                  <div className="flex flex-col gap-2">
                    {availableCoupons.map((coupon) => (
                      <div
                        key={coupon._id}
                        className={` ${
                          appliedCoupon?.couponId === coupon._id
                            ? "bg-[#fff2f2]"
                            : ""
                        }`}
                        onClick={() => handleCouponSelect(coupon)}
                      >
                        <p className="text-[14px] font-[600]">{coupon.code}</p>
                        <p className="text-[14px] text-gray-700 !my-0">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}% off`
                            : `${coupon.discountValue.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })} off`}{" "}
                          {coupon.maxDiscountAmount
                            ? `(up to ${coupon.maxDiscountAmount.toLocaleString(
                                "en-US",
                                {
                                  style: "currency",
                                  currency: "USD",
                                }
                              )})`
                            : ""}
                        </p>
                        <p className="text-[14px] text-gray-700 !my-0">
                          Min. order:{" "}
                          {coupon.minOrderAmount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </p>
                        <p className="text-[14px] text-gray-700 !my-0">
                          Expires:{" "}
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </section>

      <Script
        src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"
        onLoad={() => setIsJsBarcodeLoaded(true)}
      />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <style jsx>{`
        .invoice-content {
          padding: 20px;
          font-family: Arial, sans-serif;
          width: 100%;
        }
        .invoice-footer {
          border-top: 2px solid rgba(0, 0, 0, 0.1);
          padding-top: 10px;
        }
        .invoice-footer h3 {
          font-size: 18px;
          margin: 0;
        }
        .coupon-section input {
          text-transform: uppercase;
        }
        .coupon-list {
          max-height: 200px;
          overflow-y: auto;
        }
        .coupon-list::-webkit-scrollbar-thumb {
          background: #ccc !important;
        }
      `}</style>

      {/* ---------- Pickup-point modal ---------- */}
      <Dialog
        open={showPickupModal}
        onClose={() => {
          setShowPickupModal(false);
          setSelectedCity("");
          setSelectedPickup("");
        }}
      >
        <DialogTitle>Select a pickup point</DialogTitle>

        <DialogContent sx={{ pt: 2, minWidth: 320 }}>
          {/* Step 1 – City */}
          <FormLabel sx={{ mb: 1, fontWeight: 500 }}>
            City / Governorate
          </FormLabel>
          <Select
            size="small"
            fullWidth
            value={selectedCity}
            onChange={(e) => {
              const city = e.target.value;
              setSelectedCity(city);
              setPickupChoices(SERVICE_ZONES[city]);
              setSelectedPickup("");
            }}
          >
            {Object.keys(SERVICE_ZONES).map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>

          {/* Step 2 – Area */}
          {pickupChoices.length > 0 && (
            <>
              <FormLabel sx={{ mt: 3, mb: 1, fontWeight: 500 }}>
                Area / Street
              </FormLabel>
              <Select
                size="small"
                fullWidth
                value={selectedPickup}
                onChange={(e) => setSelectedPickup(e.target.value)}
              >
                {pickupChoices.map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button
            variant="contained"
            disabled={!selectedCity || !selectedPickup}
            onClick={() => {
              setShowPickupModal(false);

              const stamp = Date.now().toString();
              const rand = Math.floor(1e8 + Math.random() * 9e8).toString();
              const genBarcode = (stamp + rand).slice(0, 20);
              setBarcode(genBarcode);

              const { addr, finalAmount } = pendingCOD;
              const payLoad = {
                userId: context?.userData?._id,
                products: context?.cartData,
                paymentId: "",
                payment_status: "CASH ON DELIVERY",
                barcode: genBarcode,
                delivery_address: addr?._id,
                totalAmt: finalAmount,
                pickupPoint: selectedPickup, // ★ new field ★
                couponId: appliedCoupon?.couponId || null,
                couponCode: appliedCoupon?.code || null,
                couponDiscount: appliedCoupon?.discount || null,
                date: new Date().toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }),
              };

              postData(`/api/order/create`, payLoad).then((res) => {
                setIsLoading(false);
                if (res.error) return context.alertBox("error", res.message);

                context.alertBox("success", res.message);
                if (appliedCoupon?.couponId) {
                  axios.post(
                    `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons/${appliedCoupon.couponId}/use`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );
                }
                context.clearCart();
                router.push("/my-orders/success");
              });
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Checkout;
