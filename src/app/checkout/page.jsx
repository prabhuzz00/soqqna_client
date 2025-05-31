// "use client";
// import React, { useContext, useEffect, useState, useRef } from "react";
// import { Button } from "@mui/material";
// import { BsFillBagCheckFill } from "react-icons/bs";
// import { MyContext } from "@/context/ThemeProvider";
// import { FaPlus } from "react-icons/fa6";
// import Radio from "@mui/material/Radio";
// import axios from "axios";
// import CircularProgress from "@mui/material/CircularProgress";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { deleteData, postData } from "@/utils/api";
// import Script from "next/script";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import Breadcrumb from "@/components/Breadcrumb";

// const Checkout = () => {
//   const [userData, setUserData] = useState(null);
//   const [isChecked, setIsChecked] = useState(0);
//   const [selectedAddress, setSelectedAddress] = useState("");
//   const [totalAmount, setTotalAmount] = useState(0); // Store as number
//   const [isLoading, setIsloading] = useState(false);
//   const [isJsBarcodeLoaded, setIsJsBarcodeLoaded] = useState(false); // Track script load
//   const [barcode, setBarcode] = useState("");
//   const context = useContext(MyContext);
//   const router = useRouter();

//   const invoiceRef = useRef();

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       window.scrollTo(0, 0);
//     }
//     setUserData(context?.userData);
//     setSelectedAddress(context?.userData?.address_details[0]?._id);
//   }, [context?.userData, userData]);

//   useEffect(() => {
//     const amount =
//       context.cartData?.length !== 0
//         ? context.cartData
//             ?.map((item) => parseInt(item.price) * item.quantity)
//             .reduce((total, value) => total + value, 0)
//         : 0;
//     setTotalAmount(amount); // Store as number
//   }, [context.cartData]);

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_APP_PAYPAL_CLIENT_ID}&disable-funding=card`;
//     script.async = true;
//     script.onload = () => {
//       window.paypal
//         .Buttons({
//           createOrder: async () => {
//             const resp = await fetch(
//               "https://v6.exchangerate-api.com/v6/8f85eea95dae9336b9ea3ce9/latest/INR"
//             );
//             const respData = await resp.json();
//             let convertedAmount = 0;

//             if (respData.result === "success") {
//               const usdToInrRate = respData.conversion_rates.USD;
//               convertedAmount = (totalAmount * usdToInrRate).toFixed(2);
//             }

//             const headers = {
//               Authorization: `Bearer ${Cookies.get("accessToken")}`,
//               "Content-Type": "application/json",
//             };

//             const data = {
//               userId: context?.userData?._id,
//               totalAmount: convertedAmount,
//             };

//             const response = await axios.get(
//               process.env.NEXT_PUBLIC_APP_API_URL +
//                 `/api/order/create-order-paypal?userId=${data?.userId}&totalAmount=${data?.totalAmount}`,
//               { headers }
//             );

//             return response?.data?.id;
//           },
//           onApprove: async (data) => {
//             await onApprovePayment(data);
//           },
//           onError: (err) => {
//             router.push("/my-orders/failed");
//             console.error("PayPal Checkout onError:", err);
//           },
//         })
//         .render("#paypal-button-container");
//     };
//     document.body.appendChild(script);
//   }, [context?.cartData, context?.userData, selectedAddress]);

//   const onApprovePayment = async (data) => {
//     const user = context?.userData;

//     const info = {
//       userId: user?._id,
//       products: context?.cartData,
//       payment_status: "COMPLETE",
//       delivery_address: selectedAddress,
//       totalAmount: totalAmount, // Pass raw number
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
//         process.env.NEXT_PUBLIC_APP_API_URL + "/api/order/capture-order-paypal",
//         {
//           ...info,
//           paymentId: data.orderID,
//         },
//         { headers }
//       )
//       .then((res) => {
//         context.alertBox("success", res?.data?.message);
//         generateInvoice(info); // Generate invoice after success
//         router.push("/my-orders/success");
//         deleteData(`/api/cart/emptyCart/${context?.userData?._id}`).then(
//           (res) => {
//             context?.getCartItems();
//           }
//         );
//       });
//   };

//   const generateInvoice = async (orderInfo) => {
//     // Generate 20-digit barcode
//     const timestamp = Date.now().toString(); // 13 digits
//     const randomPart = Math.floor(
//       100000000 + Math.random() * 900000000
//     ).toString(); // 9 digits
//     const barcode = (timestamp + randomPart).slice(0, 20); // Exactly 20 digits

//     // Create a temporary div for the invoice content
//     const tempDiv = document.createElement("div");
//     tempDiv.style.padding = "20px";
//     tempDiv.style.fontFamily = "Arial, sans-serif";
//     tempDiv.innerHTML = `
//       <h1>Invoice</h1>
//       <p><strong>Customer:</strong> ${userData?.name || "N/A"}</p>
//       <p><strong>Address:</strong> ${
//         userData?.address_details?.find((addr) => addr._id === selectedAddress)
//           ?.address_line1 +
//           ", " +
//           userData?.address_details?.find(
//             (addr) => addr._id === selectedAddress
//           )?.city +
//           ", " +
//           userData?.address_details?.find(
//             (addr) => addr._id === selectedAddress
//           )?.state +
//           ", " +
//           userData?.address_details?.find(
//             (addr) => addr._id === selectedAddress
//           )?.country || "N/A"
//       }</p>
//       <p><strong>Date:</strong> ${orderInfo.date}</p>
//       <p><strong>Payment Status:</strong> ${orderInfo.payment_status}</p>
//       <p><strong>Barcode:</strong> <svg id="barcode"></svg></p>
//       <hr />
//       ${invoiceRef.current.innerHTML}
//     `;

//     document.body.appendChild(tempDiv);

//     // Generate barcode only if JsBarcode is loaded
//     if (typeof JsBarcode !== "undefined" && isJsBarcodeLoaded) {
//       JsBarcode("#barcode", barcode, {
//         format: "CODE128",
//         width: 2,
//         height: 40,
//         displayValue: true,
//       });

//       html2canvas(tempDiv, { scale: 2, useCORS: true }).then((canvas) => {
//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");
//         const imgProps = pdf.getImageProperties(imgData);
//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//         pdf.save(`invoice_${orderInfo.date.replace(/\//g, "-")}.pdf`);
//         document.body.removeChild(tempDiv); // Clean up
//       });
//     } else {
//       console.error("JsBarcode is not loaded yet");
//       document.body.removeChild(tempDiv); // Clean up if failed
//     }
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

//   const checkout = (e) => {
//     e.preventDefault();

//     if (userData?.address_details?.length !== 0) {
//       var options = {
//         key: process.env.NEXT_PUBLIC_APP_RAZORPAY_KEY_ID,
//         key_secret: process.env.NEXT_PUBLIC_APP_RAZORPAY_KEY_SECRET,
//         amount: parseInt(totalAmount * 100),
//         currency: "INR",
//         order_receipt: context?.userData?.name,
//         name: "Advanced UI Techniques",
//         description: "for testing purpose",
//         handler: function (response) {
//           const paymentId = response.razorpay_payment_id;

//           const user = context?.userData;

//           const payLoad = {
//             userId: user?._id,
//             products: context?.cartData,
//             paymentId: paymentId,
//             payment_status: "COMPLETED",
//             delivery_address: selectedAddress,
//             totalAmt: totalAmount, // Pass raw number
//             date: new Date().toLocaleString("en-US", {
//               month: "short",
//               day: "2-digit",
//               year: "numeric",
//             }),
//           };

//           postData(`/api/order/create`, payLoad).then((res) => {
//             context.alertBox("success", res?.message);
//             if (res?.error === false) {
//               // generateInvoice(payLoad); // Generate invoice after success
//               deleteData(`/api/cart/emptyCart/${user?._id}`).then((res) => {
//                 context?.getCartItems();
//               });
//               router.push("/my-orders/success");
//             } else {
//               router.push("/my-orders/failed");
//               context.alertBox("error", res?.message);
//             }
//           });
//         },
//         theme: {
//           color: "#ff5252",
//         },
//       };

//       var pay = new window.Razorpay(options);
//       pay.open();
//     } else {
//       context.alertBox("error", "Please add address");
//     }
//   };

//   const cashOnDelivery = () => {
//     const user = context?.userData;
//     setIsloading(true);

//     const timestamp = Date.now().toString(); // 13 digits
//     const randomPart = Math.floor(
//       100000000 + Math.random() * 900000000
//     ).toString(); // 9 digits
//     const generatedBarcode = (timestamp + randomPart).slice(0, 20); // Exactly 20 digits

//     setBarcode(generatedBarcode); // save barcode first

//     if (userData?.address_details?.length !== 0) {
//       const payLoad = {
//         userId: user?._id,
//         products: context?.cartData,
//         paymentId: "",
//         payment_status: "CASH ON DELIVERY",
//         delivery_address: selectedAddress,
//         totalAmt: totalAmount, // Pass raw number
//         barcode: generatedBarcode, // use the newly generated barcode directly
//         date: new Date().toLocaleString("en-US", {
//           month: "short",
//           day: "2-digit",
//           year: "numeric",
//         }),
//       };

//       postData(`/api/order/create`, payLoad).then((res) => {
//         context.alertBox("success", res?.message);
//         if (res?.error === false) {
//           deleteData(`/api/cart/emptyCart/${user?._id}`).then((res) => {
//             context?.getCartItems();
//             setIsloading(false);
//           });
//         } else {
//           setIsloading(false);
//           context.alertBox("error", res?.message);
//         }
//         router.push("/my-orders/success");
//       });
//     } else {
//       context.alertBox("error", "Please add address");
//       setIsloading(false);
//     }
//   };

//   return (
//     <>
//       <Breadcrumb
//         paths={[
//           {
//             label: "Checkout",
//             href: `/`,
//           },
//         ]}
//       />
//       <section className="py-3 lg:py-10 px-3">
//         <form onSubmit={checkout}>
//           <div className="w-full lg:w-[70%] m-auto flex flex-col md:flex-row gap-5">
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
//                         <img src="/map.png" width="100" />
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
//                     context?.cartData?.map((item, index) => (
//                       <div
//                         className="flex items-center justify-between py-2"
//                         key={index}
//                       >
//                         <div className="part1 flex items-center gap-3">
//                           <div className="img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer">
//                             <img
//                               src={item?.image}
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
//                           {(item?.quantity * item?.price).toLocaleString(
//                             "en-US",
//                             {
//                               style: "currency",
//                               currency: "INR",
//                             }
//                           )}
//                         </span>
//                       </div>
//                     ))}
//                   <div className="invoice-footer">
//                     <h3>
//                       <strong>Total Amount:</strong>{" "}
//                       {totalAmount.toLocaleString("en-US", {
//                         style: "currency",
//                         currency: "INR",
//                       })}
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
//       `}</style>
//     </>
//   );
// };

// export default Checkout;

"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Button } from "@mui/material";
import { BsFillBagCheckFill } from "react-icons/bs";
import { MyContext } from "@/context/ThemeProvider";
import { FaPlus } from "react-icons/fa6";
import Radio from "@mui/material/Radio";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { deleteData, postData } from "@/utils/api";
import Script from "next/script";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Breadcrumb from "@/components/Breadcrumb";

const Checkout = () => {
  const [userData, setUserData] = useState(null);
  const [isChecked, setIsChecked] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isJsBarcodeLoaded, setIsJsBarcodeLoaded] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const context = useContext(MyContext);
  const router = useRouter();

  const invoiceRef = useRef();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    setUserData(context?.userData);
    setSelectedAddress(context?.userData?.address_details[0]?._id);
  }, [context?.userData]);

  useEffect(() => {
    const amount =
      context.cartData?.length !== 0
        ? context.cartData
            .map((item) => parseInt(item.price) * item.quantity)
            .reduce((total, value) => total + value, 0)
        : 0;
    setTotalAmount(amount);
    setDiscountedAmount(amount);
    // Reset coupon when cart changes
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMessage("");
    setCouponError("");
  }, [context.cartData]);

  // Fetch available coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons?isActive=true`
        );
        const validCoupons = response.data.coupons.filter(
          (coupon) => new Date(coupon.expiryDate) >= new Date()
        );
        setAvailableCoupons(validCoupons);
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_APP_PAYPAL_CLIENT_ID}&disable-funding=card`;
    script.async = true;
    script.onload = () => {
      window.paypal
        .Buttons({
          createOrder: async () => {
            const resp = await fetch(
              "https://v6.exchangerate-api.com/v6/8f85eea95dae9336b9ea3ce9/latest/INR"
            );
            const respData = await resp.json();
            let convertedAmount = 0;

            if (respData.result === "success") {
              const usdToInrRate = respData.conversion_rates.USD;
              convertedAmount = (discountedAmount * usdToInrRate).toFixed(2);
            }

            const headers = {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
              "Content-Type": "application/json",
            };

            const data = {
              userId: context?.userData?._id,
              totalAmount: convertedAmount,
            };

            const response = await axios.get(
              process.env.NEXT_PUBLIC_APP_API_URL +
                `/api/order/create-order-paypal?userId=${data?.userId}&totalAmount=${data?.totalAmount}`,
              { headers }
            );

            return response?.data?.id;
          },
          onApprove: async (data) => {
            await onApprovePayment(data);
          },
          onError: (err) => {
            router.push("/my-orders/failed");
            console.error("PayPal Checkout onError:", err);
          },
        })
        .render("#paypal-button-container");
    };
    document.body.appendChild(script);
  }, [context?.cartData, context?.userData, selectedAddress, discountedAmount]);

  const applyCoupon = async (code) => {
    setCouponMessage("");
    setCouponError("");
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      const token =
        Cookies.get("accessToken") || localStorage.getItem("accessToken");
      console.log("ApplyCoupon - Token:", token ? "Token present" : "No token");
      if (!token) {
        setCouponError("Please log in to apply a coupon");
        console.log("ApplyCoupon - No token found");
        router.push("/login");
        return;
      }

      console.log("ApplyCoupon - Request:", { code, orderAmount: totalAmount });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons/validate`,
        {
          code: code,
          orderAmount: totalAmount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { discount, couponId, message } = response.data;
      setAppliedCoupon({ code, discount, couponId });
      setDiscountedAmount(totalAmount - discount);
      setCouponMessage(message);
      setCouponCode(code);
    } catch (error) {
      setCouponError(error.response?.data?.error);
      setAppliedCoupon(null);
      setDiscountedAmount(totalAmount);
      setCouponCode("");
    }
  };

  const handleCouponSelect = (coupon) => {
    applyCoupon(coupon.code);
  };

  const onApprovePayment = async (data) => {
    const user = context?.userData;

    const info = {
      userId: user?._id,
      products: context?.cartData,
      payment_status: "COMPLETE",
      delivery_address: selectedAddress,
      totalAmount: discountedAmount,
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
        process.env.NEXT_PUBLIC_APP_API_URL + "/api/order/capture-order-paypal",
        {
          ...info,
          paymentId: data.orderID,
        },
        { headers }
      )
      .then((res) => {
        context.alertBox("success", res?.data?.message);
        generateInvoice(info);
        if (appliedCoupon?.couponId) {
          axios.post(
            `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons/${appliedCoupon.couponId}/use`,
            {},
            { headers }
          );
        }
        router.push("/my-orders/success");
        deleteData(`/api/cart/emptyCart/${context?.userData?._id}`).then(
          (res) => {
            context?.getCartItems();
          }
        );
      });
  };

  const generateInvoice = async (orderInfo) => {
    const timestamp = Date.now().toString();
    const randomPart = Math.floor(
      100000000 + Math.random() * 900000000
    ).toString();
    const barcode = (timestamp + randomPart).slice(0, 20);

    const tempDiv = document.createElement("div");
    tempDiv.style.padding = "20px";
    tempDiv.style.fontFamily = "Arial, sans-serif";
    tempDiv.innerHTML = `
      <h1>Invoice</h1>
      <p><strong>Customer:</strong> ${userData?.name || "N/A"}</p>
      <p><strong>Address:</strong> ${
        userData?.address_details?.find((addr) => addr._id === selectedAddress)
          ?.address_line1 +
          ", " +
          userData?.address_details?.find(
            (addr) => addr._id === selectedAddress
          )?.city +
          ", " +
          userData?.address_details?.find(
            (addr) => addr._id === selectedAddress
          )?.state +
          ", " +
          userData?.address_details?.find(
            (addr) => addr._id === selectedAddress
          )?.country || "N/A"
      }</p>
      <p><strong>Date:</strong> ${orderInfo.date}</p>
      <p><strong>Payment Status:</strong> ${orderInfo.payment_status}</p>
      ${
        appliedCoupon
          ? `<p><strong>Coupon Applied:</strong> ${
              appliedCoupon.code
            } (Discount: ${appliedCoupon.discount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })})</p>`
          : ""
      }
      <p><strong>Barcode:</strong> <svg id="barcode"></svg></p>
      <hr />
      ${invoiceRef.current.innerHTML}
    `;

    document.body.appendChild(tempDiv);

    if (typeof JsBarcode !== "undefined" && isJsBarcodeLoaded) {
      JsBarcode("#barcode", barcode, {
        format: "CODE128",
        width: 2,
        height: 40,
        displayValue: true,
      });

      html2canvas(tempDiv, { scale: 2, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice_${orderInfo.date.replace(/\//g, "-")}.pdf`);
        document.body.removeChild(tempDiv);
      });
    } else {
      console.error("JsBarcode is not loaded yet");
      document.body.removeChild(tempDiv);
    }
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

  const checkout = (e) => {
    e.preventDefault();

    if (userData?.address_details?.length !== 0) {
      var options = {
        key: process.env.NEXT_PUBLIC_APP_RAZORPAY_KEY_ID,
        key_secret: process.env.NEXT_PUBLIC_APP_RAZORPAY_KEY_SECRET,
        amount: parseInt(discountedAmount * 100),
        currency: "USD",
        order_receipt: context?.userData?.name,
        name: "Advanced UI Techniques",
        description: "for testing purpose",
        handler: function (response) {
          const paymentId = response.razorpay_payment_id;

          const user = context?.userData;

          const payLoad = {
            userId: user?._id,
            products: context?.cartData,
            paymentId: paymentId,
            payment_status: "COMPLETED",
            delivery_address: selectedAddress,
            totalAmt: discountedAmount,
            couponId: appliedCoupon?.couponId || null,
            date: new Date().toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
          };

          postData(`/api/order/create`, payLoad).then((res) => {
            context.alertBox("success", res?.message);
            if (res?.error === false) {
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
              deleteData(`/api/cart/emptyCart/${user?._id}`).then((res) => {
                context?.getCartItems();
              });
              router.push("/my-orders/success");
            } else {
              router.push("/my-orders/failed");
              context.alertBox("error", res?.message);
            }
          });
        },
        theme: {
          color: "#ff5252",
        },
      };

      var pay = new window.Razorpay(options);
      pay.open();
    } else {
      context.alertBox("error", "Please add address");
    }
  };

  const cashOnDelivery = () => {
    const user = context?.userData;
    setIsLoading(true);

    const timestamp = Date.now().toString();
    const randomPart = Math.floor(
      100000000 + Math.random() * 900000000
    ).toString();
    const generatedBarcode = (timestamp + randomPart).slice(0, 20);

    setBarcode(generatedBarcode);

    if (userData?.address_details?.length !== 0) {
      const payLoad = {
        userId: user?._id,
        products: context?.cartData,
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: selectedAddress,
        totalAmt: discountedAmount,
        barcode: generatedBarcode,
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
        context.alertBox("success", res?.message);
        if (res?.error === false) {
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
          deleteData(`/api/cart/emptyCart/${user?._id}`).then((res) => {
            context?.getCartItems();
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
          context.alertBox("error", res?.message);
        }
        router.push("/my-orders/success");
      });
    } else {
      context.alertBox("error", "Please add address");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb
        paths={[
          {
            label: "Checkout",
            href: `/`,
          },
        ]}
      />
      <section className="py-3 lg:py-10 px-3">
        <form onSubmit={checkout}>
          <div className="w-full lg:w-[70%] m-auto flex flex-col md:flex-row gap-5">
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
                        <img src="/map.png" width="100" />
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

            <div className="rightCol w-full md:w-[40%]">
              <div className="card shadow-md bg-white p-5 rounded-md">
                <h2 className="mb-4">Your Order</h2>

                <div className="flex items-center justify-between py-3 border-t border-b border-[rgba(0,0,0,0.1)]">
                  <span className="text-[14px] font-[600]">Product</span>
                  <span className="text-[14px] font-[600]">Subtotal</span>
                </div>

                <div
                  ref={invoiceRef}
                  className="mb-5 overflow-x-hidden pr-2 invoice-content"
                >
                  {context?.cartData?.length !== 0 &&
                    context?.cartData?.map((item, index) => (
                      <div
                        className="flex items-center justify-between py-2"
                        key={index}
                      >
                        <div className="part1 flex items-center gap-3">
                          <div className="img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer">
                            <img
                              src={item?.image}
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
                          {(item?.quantity * item?.price).toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: "USD",
                            }
                          )}
                        </span>
                      </div>
                    ))}
                  <div className="invoice-footer">
                    {appliedCoupon && (
                      <h3>
                        <strong>Discount:</strong>{" "}
                        {appliedCoupon.discount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </h3>
                    )}
                    <h3>
                      <strong>Total Amount:</strong>{" "}
                      {discountedAmount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center flex-col gap-3 mb-2">
                  <Button
                    type="submit"
                    className="btn-org btn-lg w-full flex gap-2 items-center"
                  >
                    <BsFillBagCheckFill className="text-[20px]" /> Checkout
                  </Button>

                  <div
                    id="paypal-button-container"
                    className={`${
                      userData?.address_details?.length === 0
                        ? "pointer-events-none"
                        : ""
                    }`}
                  ></div>

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

                  <div className="coupon-section mt-4 w-full">
                    <h3 className="text-[14px] font-[600] mb-2">
                      Apply Coupon
                    </h3>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter coupon code"
                        className="border border-[rgba(0,0,0,0.1)] rounded-md p-2 w-full"
                      />
                      <Button
                        variant="contained"
                        className="btn-org"
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
                    {availableCoupons.length > 0 && (
                      <div className="coupon-list">
                        <h4 className="text-[13px] font-[500] mb-2">
                          Available Coupons
                        </h4>
                        <div className="flex flex-col gap-2">
                          {availableCoupons.map((coupon) => (
                            <div
                              key={coupon._id}
                              className={`border border-[rgba(0,0,0,0.1)] p-3 rounded-md cursor-pointer hover:bg-[#fff2f2] ${
                                appliedCoupon?.couponId === coupon._id
                                  ? "bg-[#fff2f2]"
                                  : ""
                              }`}
                              onClick={() => handleCouponSelect(coupon)}
                            >
                              <p className="text-[14px] font-[600]">
                                {coupon.code}
                              </p>
                              <p className="text-[13px]">
                                {coupon.discountType === "percentage"
                                  ? `${coupon.discountValue}% off`
                                  : `${coupon.discountValue.toLocaleString(
                                      "en-US",
                                      {
                                        style: "currency",
                                        currency: "USD",
                                      }
                                    )} off`}{" "}
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
                              <p className="text-[12px] text-gray-600">
                                Min. order:{" "}
                                {coupon.minOrderAmount.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })}
                              </p>
                              <p className="text-[12px] text-gray-600">
                                Expires:{" "}
                                {new Date(
                                  coupon.expiryDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
          margin-top: 20px;
          border-top: 2px solid #000;
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
      `}</style>
    </>
  );
};

export default Checkout;
