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
import { FaPlus, FaCreditCard } from "react-icons/fa6";
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
import { useTranslation } from "@/utils/useTranslation";
import { useCurrency } from "@/context/CurrencyContext";
import { loadStripe } from "@stripe/stripe-js";

const useServiceZones = () => {
  const [zones, setZones] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchDataFromApi("/api/service-zones");
        if (res?.success && res.data) {
          setZones(res.data);
        }
      } catch (err) {
        console.error("Failed to load service zones →", err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  return { zones, loaded };
};

// Initialize Stripe with environment variable
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const Checkout = () => {
  const { convertPrice, getSymbol } = useCurrency();
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
  const [pickupLocation, setPickupLocation] = useState("");
  const [pendingCOD, setPendingCOD] = useState(null); // remembers addr & amt
  const { zones: serviceZones, loaded: zonesLoaded } = useServiceZones();

  // Wallet states
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [walletAmountToUse, setWalletAmountToUse] = useState(0);

  // Stripe payment state
  const [isStripeLoading, setIsStripeLoading] = useState(false);

  // Hydration fix
  const [isMounted, setIsMounted] = useState(false);

  /* ---------- hooks ---------- */
  const context = useContext(MyContext);
  const { t } = useTranslation();
  const router = useRouter();

  // Fix hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const invoiceRef = useRef();

  /* ---------- helper for money ---------- */
  const moneyFmt = (v) => {
    if (!isMounted) return `$${v}`;
    return v.toLocaleString("en-US", { style: "currency", currency: "USD" });
  };

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

    // Fetch wallet balance
    if (context?.userData?._id) {
      fetchWalletBalance();
    }
  }, [context?.userData]);

  /* ---------- Load barcode script ---------- */
  useEffect(() => {
    // Check if script is already loaded
    if (typeof window !== "undefined" && window.JsBarcode) {
      setIsJsBarcodeLoaded(true);
      return;
    }

    // Load script dynamically
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js";
    script.async = true;
    script.onload = () => {
      setIsJsBarcodeLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

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

  /* ---------- fetch wallet balance ---------- */
  const fetchWalletBalance = async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) return;

      const response = await fetchDataFromApi("/api/wallet/balance");
      console.log("Wallet API response:", response); // Debug log
      if (response?.success) {
        setWalletBalance(response.balance || 0); // Fixed: removed .data
      }
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
      setWalletBalance(0);
    }
  };

  /* ---------- fetch coupons ---------- */
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons?isAdmin=false&isActive=true`
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
  /* ---------- shipping + final calculations ---------- */
  const shippingCost =
    (appliedCoupon ? discountedAmount : totalAmount) >=
    shippingSetting.FreeDeliveryFee
      ? 0
      : shippingSetting.deliveryFee;

  // Calculate amounts step by step to avoid circular dependencies
  const baseAmount = appliedCoupon ? discountedAmount : totalAmount;
  const amountWithShipping = baseAmount + shippingCost;
  const walletDeduction = useWallet
    ? Math.min(walletAmountToUse, amountWithShipping)
    : 0;
  const finalAmount = amountWithShipping - walletDeduction;

  /* ---------- wallet amount change handler ---------- */
  const handleWalletAmountChange = (amount) => {
    const currentTotal =
      (appliedCoupon ? discountedAmount : totalAmount) + shippingCost;
    const maxAmount = Math.min(walletBalance, currentTotal);
    const validAmount = Math.max(0, Math.min(amount, maxAmount));
    setWalletAmountToUse(validAmount);
  };

  /* ---------- update wallet amount when cart changes ---------- */
  useEffect(() => {
    if (useWallet && walletAmountToUse > 0) {
      const currentTotal =
        (appliedCoupon ? discountedAmount : totalAmount) + shippingCost;
      const maxUsable = Math.min(walletBalance, currentTotal);
      if (walletAmountToUse > maxUsable) {
        setWalletAmountToUse(maxUsable);
      }
    }
  }, [
    appliedCoupon,
    discountedAmount,
    totalAmount,
    shippingCost,
    walletBalance,
    useWallet,
    walletAmountToUse,
  ]);

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
      // Prepare cart items with necessary fields for coupon validation
      const cartItems =
        context?.cartData?.map((item) => ({
          productId: item.productId || item._id,
          categoryId: item.categoryId || item.catId, // Try both field names
          quantity: item.quantity,
          price: item.price,
        })) || [];

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons/validate`,
        {
          code,
          orderAmount: totalAmount,
          cartItems,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppliedCoupon({
        code,
        discount: data.discount,
        couponId: data.couponId,
        applicationType: data.applicationType,
        applicableAmount: data.applicableAmount,
        totalOrderAmount: data.totalOrderAmount,
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
    // Transform cartData to ensure _id is a valid ObjectId and cartItemId is not sent to backend
    const products = context?.cartData?.map(
      ({ cartItemId, _id, productId, ...rest }) => ({
        _id: productId,
        ...rest,
      })
    );
    const info = {
      userId: context?.userData?._id,
      products,
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
        // Transform cartData to ensure _id is a valid ObjectId
        const products = context?.cartData?.map(
          ({ cartItemId, _id, productId, ...rest }) => ({
            _id: productId,
            ...rest,
          })
        );

        const payLoad = {
          userId: context?.userData?._id,
          products,
          paymentId: response.razorpay_payment_id,
          payment_status: "COMPLETED",
          delivery_address: selectedAddress,
          totalAmt: amountWithShipping, // Original amount before wallet deduction
          finalAmt: finalAmount, // Amount after wallet deduction
          couponId: appliedCoupon?.couponId || null,
          walletUsed: useWallet,
          walletAmount: walletDeduction,
          date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
        };

        const apiEndpoint =
          useWallet && walletAmountToUse > 0
            ? `/api/order/create-with-wallet`
            : `/api/order/create`;

        postData(apiEndpoint, payLoad).then((res) => {
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
            // Refresh wallet balance if wallet was used
            if (useWallet && walletAmountToUse > 0) {
              fetchWalletBalance();
            }
            router.push("/my-orders/success");
          }
        });
      },
      theme: { color: "#ff5252" },
    };

    new window.Razorpay(opts).open();
  };

  // const cashOnDelivery = () => {
  //   if (!userData?.address_details?.length)
  //     return context.alertBox("error", "Please add address");

  //   const addr = userData.address_details.find(
  //     (a) => a._id === selectedAddress
  //   );
  //   if (!addr)
  //     return context.alertBox("error", "Please select a valid address");

  //   const city = addr.city?.trim().toLowerCase();
  //   const area = addr.area?.trim().toLowerCase(); // assuming `area` field is present
  //   const isDoorStep = addr.addressType === "Home Delivery";

  //   for (const item of context.cartData) {
  //     const zone = serviceZones.find(
  //       (z) => z.city?.trim().toLowerCase() === city
  //     );

  //     if (!zone) {
  //       return context.alertBox(
  //         "error",
  //         `${item.name} is not available in ${city}.`
  //       );
  //     }

  //     const matchedArea = zone.areas.find(
  //       (a) => a.name?.trim().toLowerCase() === area
  //     );

  //     if (!matchedArea) {
  //       return context.alertBox(
  //         "error",
  //         `${item.name} is not available in ${area}, ${city}.`
  //       );
  //     }

  //     if (isDoorStep && !matchedArea.doorStep) {
  //       return context.alertBox(
  //         "error",
  //         `${item.name} cannot be delivered to your area (${area}) via Home Delivery. Please choose Pickup Point.`
  //       );
  //     }
  //   }

  //   // ✅ Proceed to create order
  //   setIsLoading(true);
  //   const stamp = Date.now().toString();
  //   const rand = Math.floor(1e8 + Math.random() * 9e8).toString();
  //   const genBarcode = (stamp + rand).slice(0, 20);
  //   setBarcode(genBarcode);

  //   const payLoad = {
  //     userId: context?.userData?._id,
  //     products: context?.cartData,
  //     paymentId: "",
  //     payment_status: "CASH ON DELIVERY",
  //     delivery_address: selectedAddress,
  //     totalAmt: finalAmount,
  //     barcode: genBarcode,
  //     couponId: appliedCoupon?.couponId || null,
  //     couponCode: appliedCoupon?.code || null,
  //     couponDiscount: appliedCoupon?.discount || null,
  //     pickupPoint: isDoorStep ? "DoorStep" : "PickupPoint",
  //     date: new Date().toLocaleString("en-US", {
  //       month: "short",
  //       day: "2-digit",
  //       year: "numeric",
  //     }),
  //   };

  //   postData(`/api/order/create`, payLoad).then((res) => {
  //     setIsLoading(false);
  //     if (res.error) return context.alertBox("error", res.message);

  //     context.alertBox("success", res.message);
  //     if (appliedCoupon?.couponId) {
  //       axios.post(
  //         `${process.env.NEXT_PUBLIC_APP_API_URL}/api/coupons/${appliedCoupon.couponId}/use`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${Cookies.get("accessToken")}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //     }

  //     context.clearCart();
  //     router.push("/my-orders/success");
  //   });
  // };

  const cashOnDelivery = () => {
    console.log("Cash on Delivery - Wallet Info:", {
      useWallet,
      walletBalance,
      walletAmountToUse,
      walletDeduction,
      finalAmount,
      amountWithShipping,
    }); // Debug log

    if (!userData?.address_details?.length)
      return context.alertBox("error", "Please add address");

    const addr = userData.address_details.find(
      (a) => a._id === selectedAddress
    );
    if (!addr)
      return context.alertBox("error", "Please select a valid address");

    const city = addr.city?.trim().toLowerCase();
    const area = addr.area?.trim().toLowerCase();
    const isDoorStep = addr.addressType === "Home Delivery";

    for (const item of context.cartData) {
      // If serviceZone is null/empty, product is available everywhere
      if (!item.serviceZone || item.serviceZone.trim() === "") continue;

      // Find the zone object for the address city
      const zone = Object.values(serviceZones).find(
        (z) => z.name?.trim().toLowerCase() === city
      );
      if (!zone) {
        return context.alertBox(
          "error",
          `${item.name} is not available in ${city}.`
        );
      }

      // Find the area object for the address area
      const matchedArea = zone.areas?.find(
        (a) => a.name?.trim().toLowerCase() === area
      );
      if (!matchedArea) {
        return context.alertBox(
          "error",
          `${item.name} is not available in ${area}, ${city}.`
        );
      }

      // If Home Delivery is selected, check if area supports doorstep
      if (isDoorStep && !matchedArea.doorStep) {
        return context.alertBox(
          "error",
          `${item.name} cannot be delivered to your area (${area}) via Home Delivery. Please choose Pickup Point.`
        );
      }
    }

    // ✅ Proceed to create order
    setIsLoading(true);
    const stamp = Date.now().toString();
    const rand = Math.floor(1e8 + Math.random() * 9e8).toString();
    const genBarcode = (stamp + rand).slice(0, 20);
    setBarcode(genBarcode);

    // Transform cartData to ensure _id is a valid ObjectId and cartItemId is not sent to backend
    const products = context?.cartData?.map(
      ({ cartItemId, _id, productId, ...rest }) => ({
        _id: productId,
        ...rest,
      })
    );
    const payLoad = {
      userId: context?.userData?._id,
      products,
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: selectedAddress,
      totalAmt: amountWithShipping, // Original amount before wallet deduction
      barcode: genBarcode,
      couponId: appliedCoupon?.couponId || null,
      couponCode: appliedCoupon?.code || null,
      couponDiscount: appliedCoupon?.discount || null,
      walletAmountUsed: useWallet ? walletDeduction : 0, // Match backend expectation
      pickupPoint: isDoorStep ? "DoorStep" : "PickupPoint",
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    console.log("Order payload:", payLoad); // Debug log

    postData("/api/order/create", payLoad).then((res) => {
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
      // Refresh wallet balance if wallet was used
      if (useWallet && walletAmountToUse > 0) {
        fetchWalletBalance();
      }
      router.push("/my-orders/success");
    });
  };

  const payOnline = async () => {
    console.log("Pay Online (Stripe) - Wallet Info:", {
      useWallet,
      walletBalance,
      walletAmountToUse,
      walletDeduction,
      finalAmount,
      amountWithShipping,
    }); // Debug log

    if (!userData?.address_details?.length)
      return context.alertBox("error", "Please add address");

    const addr = userData.address_details.find(
      (a) => a._id === selectedAddress
    );
    if (!addr)
      return context.alertBox("error", "Please select a valid address");

    const city = addr.city?.trim().toLowerCase();
    const area = addr.area?.trim().toLowerCase();
    const isDoorStep = addr.addressType === "Home Delivery";

    // Same validation logic as Cash on Delivery
    for (const item of context.cartData) {
      // If serviceZone is null/empty, product is available everywhere
      if (!item.serviceZone || item.serviceZone.trim() === "") continue;

      // Find the zone object for the address city
      const zone = Object.values(serviceZones).find(
        (z) => z.name?.trim().toLowerCase() === city
      );
      if (!zone) {
        return context.alertBox(
          "error",
          `${item.name} is not available in ${city}.`
        );
      }

      // Find the area object for the address area
      const matchedArea = zone.areas?.find(
        (a) => a.name?.trim().toLowerCase() === area
      );
      if (!matchedArea) {
        return context.alertBox(
          "error",
          `${item.name} is not available in ${area}, ${city}.`
        );
      }

      // If Home Delivery is selected, check if area supports doorstep
      if (isDoorStep && !matchedArea.doorStep) {
        return context.alertBox(
          "error",
          `${item.name} cannot be delivered to your area (${area}) via Home Delivery. Please choose Pickup Point.`
        );
      }
    }

    try {
      setIsStripeLoading(true);

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      // Create payment intent on the server
      const stamp = Date.now().toString();
      const rand = Math.floor(1e8 + Math.random() * 9e8).toString();
      const genBarcode = (stamp + rand).slice(0, 20);
      setBarcode(genBarcode);

      // Transform cartData to ensure _id is a valid ObjectId and cartItemId is not sent to backend
      const products = context?.cartData?.map(
        ({ cartItemId, _id, productId, ...rest }) => ({
          _id: productId,
          ...rest,
        })
      );

      const paymentData = {
        amount: Math.round(finalAmount * 100), // Stripe expects amount in cents
        currency: "usd", // You can make this dynamic based on your currency context
        userId: context?.userData?._id,
        products,
        delivery_address: selectedAddress,
        totalAmt: amountWithShipping, // Original amount before wallet deduction
        barcode: genBarcode,
        couponId: appliedCoupon?.couponId || null,
        couponCode: appliedCoupon?.code || null,
        couponDiscount: appliedCoupon?.discount || null,
        walletAmountUsed: useWallet ? walletDeduction : 0,
        pickupPoint: isDoorStep ? "DoorStep" : "PickupPoint",
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      console.log("Creating Stripe payment intent with data:", paymentData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/payment/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify(paymentData),
        }
      );

      const { clientSecret, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Since we're using the live key, we'll redirect to Stripe Checkout
      // This is more secure and user-friendly for production
      const checkoutResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify({
            ...paymentData,
            success_url: `${window.location.origin}/my-orders/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${window.location.origin}/checkout`,
          }),
        }
      );

      const {
        sessionId,
        url,
        error: checkoutError,
      } = await checkoutResponse.json();

      if (checkoutError) {
        throw new Error(checkoutError);
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Stripe payment error:", error);
      context.alertBox(
        "error",
        error.message || "Payment failed. Please try again."
      );
    } finally {
      setIsStripeLoading(false);
    }
  };

  /* ---------- JSX ---------- */
  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Breadcrumb paths={[{ label: `${t("cartPage.checkout")}`, href: "/" }]} />

      <section className="py-3 lg:py-10 px-3">
        <form onSubmit={checkout}>
          <div className="w-full lg:w-[70%] m-auto flex flex-col md:flex-row gap-5">
            {/* ---------- LEFT column (addresses) ---------- */}

            <div className="leftCol w-full md:w-[60%]">
              <div className="card bg-white shadow-md p-5 rounded-md w-full">
                <div className="flex items-center justify-between">
                  <h2>{t("checkout.selectAddress")}</h2>
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
                      {t("checkout.addNew")}
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
                              address?.state +
                              " " +
                              address?.landmark +
                              " " +
                              "+ " +
                              address?.mobile}
                          </p>
                          {/* <p className="mb-0 font-[500]">
                            {userData?.phone !== null
                              ? "+" + userData?.phone
                              : "+" + address?.mobile}
                          </p> */}
                        </div>
                        <Button
                          variant="text"
                          className="!absolute top-[15px] right-[15px] !font-bold"
                          size="small"
                          onClick={() => editAddress(address?._id)}
                        >
                          {t("checkout.edit")}
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
                          {t("checkout.noAddress")}
                        </h2>
                        <p className="mt-0">{t("checkout.addAddressText")}</p>
                        <Button
                          className="btn-org"
                          onClick={() => {
                            context?.setOpenAddressPanel(true);
                            context?.setAddressMode("add");
                          }}
                        >
                          {t("checkout.addAddress")}
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
                <h2 className="mb-4">{t("checkout.order")}</h2>

                <div className="flex items-center justify-between py-3 border-t border-b border-[rgba(0,0,0,0.1)]">
                  <span className="text-[14px] font-[600]">
                    {t("checkout.product")}
                  </span>
                  <span className="text-[14px] font-[600]">
                    {t("checkout.subtotal")}
                  </span>
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
                              {t("checkout.qty")}: {item?.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="text-[14px] font-[500]">
                          {/* {moneyFmt()} */}
                          {getSymbol()}
                          {convertPrice(item.quantity * item.price)}
                        </span>
                      </div>
                    ))}

                  {/* ---------- SUMMARY footer ---------- */}
                  <div className="invoice-footer">
                    {appliedCoupon && (
                      <div>
                        <h3 className="!text-[16px] flex items-center justify-between py-1">
                          <span className="font-[600]">
                            {t("checkout.discount")}
                            {appliedCoupon.applicationType !== "all" && (
                              <span className="text-[12px] font-[400] text-gray-600 ml-1">
                                (
                                {appliedCoupon.applicationType === "categories"
                                  ? "Category specific"
                                  : "Product specific"}
                                )
                              </span>
                            )}
                          </span>{" "}
                          <span className="font-[500] text-[14px]">
                            {" "}
                            {/* {moneyFmt(appliedCoupon.discount)} */}
                            {` ${getSymbol()}${convertPrice(
                              appliedCoupon.discount
                            )}`}
                          </span>
                        </h3>
                        {appliedCoupon.applicationType !== "all" &&
                          appliedCoupon.applicableAmount && (
                            <div className="text-[12px] text-gray-600 pb-2">
                              Applied to {getSymbol()}
                              {convertPrice(appliedCoupon.applicableAmount)} out
                              of {getSymbol()}
                              {convertPrice(appliedCoupon.totalOrderAmount)}
                            </div>
                          )}
                      </div>
                    )}
                    <h3 className="!text-[16px] flex items-center justify-between py-1">
                      <span className="font-[600]">
                        {t("checkout.shipping")}
                      </span>{" "}
                      <span className="font-[500] text-[14px]">
                        {" "}
                        {shippingCost === 0
                          ? "FREE"
                          : `${getSymbol()}${convertPrice(shippingCost)}`}
                      </span>
                    </h3>

                    {/* Wallet Section */}
                    {walletBalance > 0 && (
                      <div className="wallet-section border-t pt-3 mt-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="useWallet"
                              checked={useWallet}
                              onChange={(e) => {
                                setUseWallet(e.target.checked);
                                if (e.target.checked) {
                                  // Use full wallet balance or order total, whichever is smaller
                                  const currentTotal =
                                    (appliedCoupon
                                      ? discountedAmount
                                      : totalAmount) + shippingCost;
                                  const maxUsable = Math.min(
                                    walletBalance,
                                    currentTotal
                                  );
                                  setWalletAmountToUse(maxUsable);
                                } else {
                                  setWalletAmountToUse(0);
                                }
                              }}
                              className="w-4 h-4 accent-green-600"
                            />
                            <label
                              htmlFor="useWallet"
                              className="text-[14px] font-[500] cursor-pointer"
                            >
                              Use Wallet Balance (
                              {`${getSymbol()}${convertPrice(walletBalance)}`})
                            </label>
                          </div>
                          <div className="text-right">
                            <div className="font-[500] text-[12px] text-gray-500">
                              Available Balance
                            </div>
                            <div className="font-[600] text-[14px] text-green-600">
                              {`${getSymbol()}${convertPrice(walletBalance)}`}
                            </div>
                          </div>
                        </div>

                        {/* Wallet Amount Input */}
                        {useWallet && (
                          <div className="mb-3 p-3 bg-green-50 rounded-md border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-[13px] font-[500] text-green-700">
                                Amount to use from wallet:
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentTotal =
                                    (appliedCoupon
                                      ? discountedAmount
                                      : totalAmount) + shippingCost;
                                  const maxUsable = Math.min(
                                    walletBalance,
                                    currentTotal
                                  );
                                  setWalletAmountToUse(maxUsable);
                                }}
                                className="text-[12px] text-blue-600 hover:text-blue-800 underline"
                              >
                                Use Maximum
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-[500]">
                                {getSymbol()}
                              </span>
                              <input
                                type="number"
                                min="0"
                                max={Math.min(
                                  walletBalance,
                                  (appliedCoupon
                                    ? discountedAmount
                                    : totalAmount) + shippingCost
                                )}
                                value={walletAmountToUse}
                                onChange={(e) => {
                                  const amount =
                                    parseFloat(e.target.value) || 0;
                                  handleWalletAmountChange(amount);
                                }}
                                className="border border-green-300 rounded-md px-2 py-1 w-full text-[14px] focus:outline-none focus:border-green-500"
                                placeholder="0.00"
                              />
                            </div>
                            <div className="text-[12px] text-gray-600 mt-1">
                              Max:{" "}
                              {`${getSymbol()}${convertPrice(
                                Math.min(
                                  walletBalance,
                                  (appliedCoupon
                                    ? discountedAmount
                                    : totalAmount) + shippingCost
                                )
                              )}`}
                            </div>
                          </div>
                        )}

                        {useWallet && walletDeduction > 0 && (
                          <div className="bg-green-100 p-2 rounded-md border border-green-300">
                            <h3 className="!text-[14px] flex items-center justify-between">
                              <span className="font-[600] text-green-700">
                                Wallet Applied:
                              </span>
                              <span className="font-[600] text-[14px] text-green-700">
                                -
                                {`${getSymbol()}${convertPrice(
                                  walletDeduction
                                )}`}
                              </span>
                            </h3>
                            <div className="text-[12px] text-green-600 mt-1">
                              Remaining wallet balance:{" "}
                              {`${getSymbol()}${convertPrice(
                                walletBalance - walletDeduction
                              )}`}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="border-t pt-3 mt-3">
                      {useWallet && walletDeduction > 0 ? (
                        <div className="space-y-1">
                          <h3 className="!text-[14px] flex items-center justify-between py-1">
                            <span className="font-[500] text-gray-600">
                              Subtotal:
                            </span>
                            <span className="font-[500] text-[14px]">
                              {`${getSymbol()}${convertPrice(
                                amountWithShipping
                              )}`}
                            </span>
                          </h3>
                          <h3 className="!text-[14px] flex items-center justify-between py-1">
                            <span className="font-[500] text-green-600">
                              Wallet Payment:
                            </span>
                            <span className="font-[500] text-[14px] text-green-600">
                              -
                              {`${getSymbol()}${convertPrice(walletDeduction)}`}
                            </span>
                          </h3>
                          <h3 className="!text-[16px] flex items-center justify-between py-2 font-bold border-t pt-2">
                            <span className="font-[700]">Amount to Pay:</span>
                            <span className="font-[700] text-[16px] text-blue-600">
                              {`${getSymbol()}${convertPrice(finalAmount)}`}
                            </span>
                          </h3>
                        </div>
                      ) : (
                        <h3 className="!text-[16px] flex items-center justify-between py-1">
                          <span className="font-[600]">
                            {t("checkout.total")}:
                          </span>
                          <span className="font-[500] text-[14px]">
                            {`${getSymbol()}${convertPrice(finalAmount)}`}
                          </span>
                        </h3>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center flex-col gap-3 mb-2">
                  {/* Pay Online Button */}
                  <Button
                    type="button"
                    className="btn-org btn-lg w-full flex gap-2 items-center justify-center"
                    onClick={payOnline}
                    disabled={finalAmount <= 0} // Disable if fully paid with wallet
                  >
                    {isStripeLoading ? (
                      <CircularProgress />
                    ) : (
                      <>
                        <FaCreditCard className="text-[20px]" />
                        <div className="flex flex-col items-center">
                          <span>Pay Online</span>
                          {finalAmount > 0 && (
                            <span className="text-[12px] opacity-90">
                              Pay {`${getSymbol()}${convertPrice(finalAmount)}`}{" "}
                              securely with Stripe
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </Button>

                  {/* Cash on Delivery Button */}
                  <Button
                    type="button"
                    className="btn-dark btn-lg w-full flex gap-2 items-center justify-center"
                    onClick={cashOnDelivery}
                  >
                    {isLoading ? (
                      <CircularProgress />
                    ) : (
                      <>
                        <BsFillBagCheckFill className="text-[20px]" />
                        <div className="flex flex-col items-center">
                          <span>{t("checkout.cod")}</span>
                          {finalAmount > 0 && (
                            <span className="text-[12px] opacity-90">
                              Pay {`${getSymbol()}${convertPrice(finalAmount)}`}{" "}
                              on delivery
                            </span>
                          )}
                          {finalAmount === 0 && useWallet && (
                            <span className="text-[12px] opacity-90">
                              Fully paid with wallet
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </Button>

                  {/* Wallet Summary Alert */}
                  {useWallet && walletDeduction > 0 && (
                    <div className="w-full p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2 text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-[13px] font-[500]">
                          {finalAmount === 0
                            ? `Order fully paid using wallet balance (${getSymbol()}${convertPrice(
                                walletDeduction
                              )})`
                            : `${getSymbol()}${convertPrice(
                                walletDeduction
                              )} will be deducted from wallet, ${getSymbol()}${convertPrice(
                                finalAmount
                              )} to pay on delivery`}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ---------- Coupon UI remains unchanged ---------- */}
                  <div className="coupon-section mt-4 w-full">
                    <h3 className="text-[14px] font-[600] mb-2">
                      {t("checkout.coupon")}
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder={t("checkout.couponInput")}
                        className="border border-[rgba(0,0,0,0.1)] rounded-sm p-2 w-full h-[35px] focus:outline-none text-[14px] focus:border-[rgba(0,0,0,0.3)]"
                      />
                      <Button
                        variant="contained"
                        className="btn-org btn-sm"
                        onClick={() => applyCoupon(couponCode)}
                        disabled={isLoading}
                      >
                        {t("checkout.apply")}
                      </Button>
                    </div>
                    {couponMessage && (
                      <div className="text-green-600 text-[13px] mb-2">
                        <p>{couponMessage}</p>
                        {appliedCoupon &&
                          appliedCoupon.applicationType !== "all" &&
                          appliedCoupon.applicableAmount && (
                            <p className="text-[12px] mt-1 text-gray-600">
                              Applied to {getSymbol()}
                              {convertPrice(
                                appliedCoupon.applicableAmount
                              )}{" "}
                              worth of{" "}
                              {appliedCoupon.applicationType === "categories"
                                ? "category"
                                : "product"}{" "}
                              items
                            </p>
                          )}
                      </div>
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
                    {t("checkout.coupons")}
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
                            : `${
                                isMounted
                                  ? coupon.discountValue.toLocaleString(
                                      "en-US",
                                      {
                                        style: "currency",
                                        currency: "USD",
                                      }
                                    )
                                  : `$${coupon.discountValue}`
                              } off`}{" "}
                          {coupon.maxDiscountAmount
                            ? `(up to ${getSymbol()}${convertPrice(
                                coupon.maxDiscountAmount
                              )})`
                            : ""}
                        </p>
                        <p className="text-[14px] text-gray-700 !my-0">
                          {t("checkout.minOrder")}{" "}
                          {`${getSymbol()}${convertPrice(
                            coupon.minOrderAmount
                          )}`}
                        </p>
                        <p className="text-[14px] text-gray-700 !my-0">
                          {t("checkout.expires")}{" "}
                          {isMounted
                            ? new Date(coupon.expiryDate).toLocaleDateString()
                            : ""}
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
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

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
    </>
  );
};

export default Checkout;
