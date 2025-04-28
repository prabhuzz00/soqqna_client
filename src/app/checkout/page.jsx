// "use client"
// import React, { useContext, useEffect, useState } from "react";
// import { Button } from "@mui/material";
// import { BsFillBagCheckFill } from "react-icons/bs";
// import { MyContext } from "@/context/ThemeProvider";
// import { FaPlus } from "react-icons/fa6";
// import Radio from '@mui/material/Radio';
// import axios from 'axios';
// import CircularProgress from '@mui/material/CircularProgress';
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import { deleteData, postData } from "@/utils/api";
// import Script from "next/script";

// const Checkout = () => {

//     const [userData, setUserData] = useState(null);
//     const [isChecked, setIsChecked] = useState(0);
//     const [selectedAddress, setSelectedAddress] = useState("");
//     const [totalAmount, setTotalAmount] = useState();
//     const [isLoading, setIsloading] = useState(false);
//     const context = useContext(MyContext);

//     const router = useRouter();

//     useEffect(() => {
//         if (typeof window !== "undefined") {
//             window.scrollTo(0, 0);
//         }
//         setUserData(context?.userData)
//         setSelectedAddress(context?.userData?.address_details[0]?._id);

//     }, [context?.userData, userData])

//     useEffect(() => {
//         setTotalAmount(
//             context.cartData?.length !== 0 ?
//                 context.cartData?.map(item => parseInt(item.price) * item.quantity)
//                     .reduce((total, value) => total + value, 0) : 0)
//             ?.toLocaleString('en-US', { style: 'currency', currency: 'INR' }
//             );

//         // localStorage.setItem("totalAmount", context.cartData?.length !== 0 ?
//         //   context.cartData?.map(item => parseInt(item.price) * item.quantity)
//         //     .reduce((total, value) => total + value, 0) : 0)
//         //   ?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })

//     }, [context.cartData])

//     useEffect(() => {

//         // Load the PayPal JavaScript SDK
//         const script = document.createElement("script");
//         script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_APP_PAYPAL_CLIENT_ID}&disable-funding=card`;
//         script.async = true;
//         script.onload = () => {
//             window.paypal
//                 .Buttons(
//                     {
//                         createOrder: async () => {

//                             // Create order on the server

//                             const resp = await fetch(
//                                 "https://v6.exchangerate-api.com/v6/8f85eea95dae9336b9ea3ce9/latest/INR"
//                             );

//                             const respData = await resp.json();
//                             var convertedAmount = 0;

//                             if (respData.result === "success") {
//                                 const usdToInrRate = respData.conversion_rates.USD;
//                                 convertedAmount = (totalAmount * usdToInrRate).toFixed(2);
//                             }

//                             const headers = {
//                                 'Authorization': `Bearer ${Cookies.get('accessToken')}`, // Include your API key in the Authorization header
//                                 'Content-Type': 'application/json', // Adjust the content type as needed
//                             }

//                             const data = {
//                                 userId: context?.userData?._id,
//                                 totalAmount: convertedAmount
//                             }

//                             const response = await axios.get(
//                                 process.env.NEXT_PUBLIC_APP_API_URL + `/api/order/create-order-paypal?userId=${data?.userId}&totalAmount=${data?.totalAmount}`, { headers }
//                             );

//                             return response?.data?.id; // Return order ID to PayPal

//                         },
//                         onApprove: async (data) => {
//                             onApprovePayment(data);
//                         },
//                         onError: (err) => {
//                             router.push("/my-orders/failed");
//                             console.error("PayPal Checkout onError:", err);
//                         },
//                     })
//                 .render("#paypal-button-container");
//         };
//         document.body.appendChild(script);
//     }, [context?.cartData, context?.userData, selectedAddress]);

//     const onApprovePayment = async (data) => {
//         const user = context?.userData;

//         const info = {
//             userId: user?._id,
//             products: context?.cartData,
//             payment_status: "COMPLETE",
//             delivery_address: selectedAddress,
//             totalAmount: totalAmount,
//             date: new Date().toLocaleString("en-US", {
//                 month: "short",
//                 day: "2-digit",
//                 year: "numeric",
//             })
//         };

//         // Capture order on the server

//         const headers = {
//             'Authorization': `Bearer ${Cookies.get('accessToken')}`, // Include your API key in the Authorization header
//             'Content-Type': 'application/json', // Adjust the content type as needed
//         }

//         const response = await axios.post(
//             process.env.NEXT_PUBLIC_APP_API_URL + "/api/order/capture-order-paypal",
//             {
//                 ...info,
//                 paymentId: data.orderID
//             }, { headers }
//         ).then((res) => {
//             context.alertBox("success", res?.data?.message);
//             router.push("/my-orders/success");
//             deleteData(`/api/cart/emptyCart/${context?.userData?._id}`).then((res) => {
//                 context?.getCartItems();
//             })
//         });

//         if (response.data.success) {
//             context.alertBox("success", "Order completed and saved to database!");
//         }

//     }

//     const editAddress = (id) => {
//         context?.setOpenAddressPanel(true);
//         context?.setAddressMode("edit");
//         context?.setAddressId(id);
//     }

//     const handleChange = (e, index) => {
//         if (e.target.checked) {
//             setIsChecked(index);
//             setSelectedAddress(e.target.value)
//         }
//     }

//     const checkout = (e) => {
//         e.preventDefault();

//         if (userData?.address_details?.length !== 0) {
//             var options = {
//                 key: process.env.NEXT_PUBLIC_APP_RAZORPAY_KEY_ID,
//                 key_secret: process.env.NEXT_PUBLIC_APP_RAZORPAY_KEY_SECRET,
//                 amount: parseInt(totalAmount * 100),
//                 currency: "INR",
//                 order_receipt: context?.userData?.name,
//                 name: "Advanced UI Techniques",
//                 description: "for testing purpose",
//                 handler: function (response) {

//                     const paymentId = response.razorpay_payment_id;

//                     const user = context?.userData

//                     const payLoad = {
//                         userId: user?._id,
//                         products: context?.cartData,
//                         paymentId: paymentId,
//                         payment_status: "COMPLETED",
//                         delivery_address: selectedAddress,
//                         totalAmt: totalAmount,
//                         date: new Date().toLocaleString("en-US", {
//                             month: "short",
//                             day: "2-digit",
//                             year: "numeric",
//                         })
//                     };

//                     postData(`/api/order/create`, payLoad).then((res) => {
//                         context.alertBox("success", res?.message);
//                         if (res?.error === false) {
//                             deleteData(`/api/cart/emptyCart/${user?._id}`).then((res) => {
//                                 context?.getCartItems();
//                             })
//                             router.push("/my-orders/success");
//                         } else {
//                             router.push("/my-orders/failed");
//                             context.alertBox("error", res?.message);
//                         }
//                     });

//                 },

//                 theme: {
//                     color: "#ff5252",
//                 },
//             };

//             var pay = new window.Razorpay(options);
//             pay.open();
//         }
//         else {
//             context.alertBox("error", "Please add address");
//         }

//     }

//     const cashOnDelivery = () => {

//         const user = context?.userData
//         setIsloading(true);

//         if (userData?.address_details?.length !== 0) {
//             const payLoad = {
//                 userId: user?._id,
//                 products: context?.cartData,
//                 paymentId: '',
//                 payment_status: "CASH ON DELIVERY",
//                 delivery_address: selectedAddress,
//                 totalAmt: totalAmount,
//                 date: new Date().toLocaleString("en-US", {
//                     month: "short",
//                     day: "2-digit",
//                     year: "numeric",
//                 })
//             };

//             postData(`/api/order/create`, payLoad).then((res) => {
//                 context.alertBox("success", res?.message);

//                 if (res?.error === false) {
//                     deleteData(`/api/cart/emptyCart/${user?._id}`).then((res) => {
//                         context?.getCartItems();
//                         setIsloading(false);
//                     })
//                 } else {
//                     context.alertBox("error", res?.message);
//                 }
//                 router.push("/my-orders/success");
//             });
//         } else {
//             context.alertBox("error", "Please add address");
//             setIsloading(false);
//         }

//     }

//     return (
//         <>
//             <section className="py-3 lg:py-10 px-3">
//                 <form onSubmit={checkout}>
//                     <div className="w-full lg:w-[70%] m-auto flex flex-col md:flex-row gap-5">
//                         <div className="leftCol w-full md:w-[60%]">
//                             <div className="card bg-white shadow-md p-5 rounded-md w-full">
//                                 <div className="flex items-center justify-between">
//                                     <h2>Select Delivery Address</h2>
//                                     {
//                                         userData?.address_details?.length !== 0 &&
//                                         <Button variant="outlined" className="btn !font-bold"
//                                             onClick={() => {
//                                                 context?.setOpenAddressPanel(true);
//                                                 context?.setAddressMode("add");
//                                             }}>
//                                             <FaPlus />
//                                             ADD {context?.windowWidth < 767 ? '' : 'NEW ADDRESS'}
//                                         </Button>
//                                     }

//                                 </div>

//                                 <br />

//                                 <div className="flex flex-col gap-4">

//                                     {
//                                         userData?.address_details?.length !== 0 ? userData?.address_details?.map((address, index) => {

//                                             return (
//                                                 <label className={`flex gap-3 p-4 border border-[rgba(0,0,0,0.1)] rounded-md relative ${isChecked === index && 'bg-[#fff2f2]'}`} key={index}>
//                                                     <div>
//                                                         <Radio size="small" onChange={(e) => handleChange(e, index)}
//                                                             checked={isChecked === index} value={address?._id} />
//                                                     </div>
//                                                     <div className="info">
//                                                         <span className="inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md">{address?.addressType}</span>
//                                                         <h3>{userData?.name}</h3>
//                                                         <p className="mt-0 mb-0">
//                                                             {address?.address_line1 + " " + address?.city + " " + address?.country + " " + address?.state + " " + address?.landmark + ' ' + '+ ' + address?.mobile}
//                                                         </p>

//                                                         <p className="mb-0 font-[500]">{userData?.mobile !== null ? '+' + userData?.mobile : '+' + address?.mobile}</p>
//                                                     </div>

//                                                     <Button variant="text" className="!absolute top-[15px] right-[15px]  !font-bold" size="small"
//                                                         onClick={() => editAddress(address?._id)}
//                                                     >EDIT</Button>

//                                                 </label>
//                                             )
//                                         })

//                                             :

//                                             <>
//                                                 <div className="flex items-center mt-5 justify-between flex-col p-5">
//                                                     <img src="/map.png" width="100" />
//                                                     <h2 className="text-center">No Addresses found in your account!</h2>
//                                                     <p className="mt-0">Add a delivery address.</p>
//                                                     <Button className="btn-org"
//                                                         onClick={() => {
//                                                             context?.setOpenAddressPanel(true);
//                                                             context?.setAddressMode("add");
//                                                         }}>ADD ADDRESS</Button>
//                                                 </div>
//                                             </>

//                                     }

//                                 </div>

//                             </div>
//                         </div>

//                         <div className="rightCol w-full  md:w-[40%]">
//                             <div className="card shadow-md bg-white p-5 rounded-md">
//                                 <h2 className="mb-4">Your Order</h2>

//                                 <div className="flex items-center justify-between py-3 border-t border-b border-[rgba(0,0,0,0.1)]">
//                                     <span className="text-[14px] font-[600]">Product</span>
//                                     <span className="text-[14px] font-[600]">Subtotal</span>
//                                 </div>

//                                 <div className="mb-5 scroll max-h-[250px] overflow-y-scroll overflow-x-hidden pr-2">

//                                     {
//                                         context?.cartData?.length !== 0 && context?.cartData?.map((item, index) => {
//                                             return (
//                                                 <div className="flex items-center justify-between py-2" key={index}>
//                                                     <div className="part1 flex items-center gap-3">
//                                                         <div className="img w-[50px] h-[50px] object-cover overflow-hidden rounded-md group cursor-pointer">
//                                                             <img
//                                                                 src={item?.image}
//                                                                 className="w-full transition-all group-hover:scale-105"
//                                                             />
//                                                         </div>

//                                                         <div className="info">
//                                                             <h4 className="text-[14px]" title={item?.productTitle}>{item?.productTitle?.substr(0, 20) + '...'} </h4>
//                                                             <span className="text-[13px]">Qty : {item?.quantity}</span>
//                                                         </div>
//                                                     </div>

//                                                     <span className="text-[14px] font-[500]">{(item?.quantity * item?.price)?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</span>
//                                                 </div>
//                                             )
//                                         })
//                                     }

//                                 </div>

//                                 <div className="flex items-center flex-col gap-3 mb-2">
//                                     <Button type="submit" className="btn-org btn-lg w-full flex gap-2 items-center"><BsFillBagCheckFill className="text-[20px]" /> Checkout</Button>

//                                     <div id="paypal-button-container" className={`${userData?.address_details?.length === 0 ? 'pointer-events-none' : ''}`}></div>

//                                     <Button type="button" className="btn-dark btn-lg w-full flex gap-2 items-center" onClick={cashOnDelivery}>
//                                         {
//                                             isLoading === true ? <CircularProgress /> :
//                                                 <>
//                                                     <BsFillBagCheckFill className="text-[20px]" />
//                                                     Cash on Delivery
//                                                 </>
//                                         }
//                                     </Button>
//                                 </div>

//                             </div>
//                         </div>
//                     </div>
//                 </form>
//             </section>

//             <Script src="https://checkout.razorpay.com/v1/checkout.js" />
//         </>
//     );
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

const Checkout = () => {
  const [userData, setUserData] = useState(null);
  const [isChecked, setIsChecked] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [totalAmount, setTotalAmount] = useState(0); // Store as number
  const [isLoading, setIsloading] = useState(false);
  const [isJsBarcodeLoaded, setIsJsBarcodeLoaded] = useState(false); // Track script load
  const context = useContext(MyContext);
  const router = useRouter();

  const invoiceRef = useRef();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    setUserData(context?.userData);
    setSelectedAddress(context?.userData?.address_details[0]?._id);
  }, [context?.userData, userData]);

  useEffect(() => {
    const amount =
      context.cartData?.length !== 0
        ? context.cartData
            ?.map((item) => parseInt(item.price) * item.quantity)
            .reduce((total, value) => total + value, 0)
        : 0;
    setTotalAmount(amount); // Store as number
  }, [context.cartData]);

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
              convertedAmount = (totalAmount * usdToInrRate).toFixed(2);
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
  }, [context?.cartData, context?.userData, selectedAddress]);

  const onApprovePayment = async (data) => {
    const user = context?.userData;

    const info = {
      userId: user?._id,
      products: context?.cartData,
      payment_status: "COMPLETE",
      delivery_address: selectedAddress,
      totalAmount: totalAmount, // Pass raw number
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
        generateInvoice(info); // Generate invoice after success
        router.push("/my-orders/success");
        deleteData(`/api/cart/emptyCart/${context?.userData?._id}`).then(
          (res) => {
            context?.getCartItems();
          }
        );
      });
  };

  const generateInvoice = async (orderInfo) => {
    // Generate 20-digit barcode
    const timestamp = Date.now().toString(); // 13 digits
    const randomPart = Math.floor(
      100000000 + Math.random() * 900000000
    ).toString(); // 9 digits
    const barcode = (timestamp + randomPart).slice(0, 20); // Exactly 20 digits

    // Create a temporary div for the invoice content
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
      <p><strong>Barcode:</strong> <svg id="barcode"></svg></p>
      <hr />
      ${invoiceRef.current.innerHTML}
    `;

    document.body.appendChild(tempDiv);

    // Generate barcode only if JsBarcode is loaded
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
        document.body.removeChild(tempDiv); // Clean up
      });
    } else {
      console.error("JsBarcode is not loaded yet");
      document.body.removeChild(tempDiv); // Clean up if failed
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
        amount: parseInt(totalAmount * 100),
        currency: "INR",
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
            totalAmt: totalAmount, // Pass raw number
            date: new Date().toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
          };

          postData(`/api/order/create`, payLoad).then((res) => {
            context.alertBox("success", res?.message);
            if (res?.error === false) {
              generateInvoice(payLoad); // Generate invoice after success
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
    setIsloading(true);

    if (userData?.address_details?.length !== 0) {
      const payLoad = {
        userId: user?._id,
        products: context?.cartData,
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: selectedAddress,
        totalAmt: totalAmount, // Pass raw number
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      postData(`/api/order/create`, payLoad).then((res) => {
        context.alertBox("success", res?.message);
        if (res?.error === false) {
          generateInvoice(payLoad); // Generate invoice after success
          deleteData(`/api/cart/emptyCart/${user?._id}`).then((res) => {
            context?.getCartItems();
            setIsloading(false);
          });
        } else {
          context.alertBox("error", res?.message);
        }
        router.push("/my-orders/success");
      });
    } else {
      context.alertBox("error", "Please add address");
      setIsloading(false);
    }
  };

  return (
    <>
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
                              currency: "INR",
                            }
                          )}
                        </span>
                      </div>
                    ))}
                  <div className="invoice-footer">
                    <h3>
                      <strong>Total Amount:</strong>{" "}
                      {totalAmount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
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
      `}</style>
    </>
  );
};

export default Checkout;
