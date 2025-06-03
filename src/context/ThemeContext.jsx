"use client";
import React from "react";
import { useState, useEffect } from "react";
import { MyContext } from "./ThemeProvider";
import Cookies from "js-cookie";
import { fetchDataFromApi, postData } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

const ThemeProvider = ({ children }) => {
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState({
    open: false,
    item: {},
    extraProps: {}, // Add extraProps to store images and setImages
    productId: null, // Add productId to track which product is open
  });
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [catData, setCatData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [myListData, setMyListData] = useState([]);
  const [MyCatProdData, setMyCatProdData] = useState([]);

  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [openAddressPanel, setOpenAddressPanel] = useState(false);

  const [addressMode, setAddressMode] = useState("add");
  const [addressId, setAddressId] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(null);

  const [openFilter, setOpenFilter] = useState(false);
  const [isFilterBtnShow, setisFilterBtnShow] = useState(false);

  const [openSearchPanel, setOpenSearchPanel] = useState(false);
  const [userLocation, setUserLocation] = useState("Select Location"); // State for user location

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure this runs only on client
      // Function to update width
      const updateWidth = () => setWindowWidth(window.innerWidth);

      // Load initial location from local storage
      const cachedLocation = localStorage.getItem("userLocation");
      const parsedLocation = JSON.parse(cachedLocation);
      if (parsedLocation) {
        setUserLocation(parsedLocation.address.city);
      }

      setWindowWidth(window.innerWidth); // Set initial width
      window.addEventListener("resize", updateWidth); // Listen for resize events

      // Cleanup function to remove event listener when component unmounts
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  const handleOpenProductDetailsModal = (status, item, extraProps = {}) => {
    setOpenProductDetailsModal({
      open: status,
      item: item,
      extraProps: extraProps, // Store the extra props
      productId: status ? item?._id : null, // Set productId when opening, clear when closing
    });
  };

  const handleCloseProductDetailsModal = () => {
    setOpenProductDetailsModal({
      open: false,
      item: {},
      extraProps: {},
      productId: null,
    });
  };

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  const toggleAddressPanel = (newOpen) => () => {
    if (newOpen == false) {
      setAddressMode("add");
    }

    setOpenAddressPanel(newOpen);
  };

  useEffect(() => {
    const token = Cookies.get("accessToken");
    getCartItems();
    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true);

      getCartItems();
      getMyListData();
      getUserDetails();
      // getProdbyCat();
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  const getUserDetails = () => {
    fetchDataFromApi(`/api/user/user-details`).then((res) => {
      setUserData(res.data);
      if (res?.response?.data?.error === true) {
        if (res?.response?.data?.message === "You have not login") {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          alertBox("error", "Your session is closed please login again");

          //window.location.href = "/login"

          setIsLogin(false);
        }
      }
    });
  };

  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      if (res?.error === false) {
        setCatData(res?.data);
      }
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure this runs only on client
      // Function to update width
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const alertBox = (type, msg) => {
    if (type === "success") {
      toast.success(msg);
    }
    if (type === "error") {
      toast.error(msg);
    }
  };

  const addToCart = (product, userId, quantity) => {
    const cart = getCart();
    const index = cart.findIndex((item) => item._id === product._id);

    if (index !== -1) {
      cart[index].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    Cookies.set("cart", JSON.stringify(cart));

    getCartItems();
  };

  const getCart = () => {
    const cart = Cookies.get("cart");
    return cart ? JSON.parse(cart) : [];
  };

  const getCartItems = () => {
    const cart = Cookies.get("cart");
    setCartData(cart ? JSON.parse(cart) : []);
    return cart ? JSON.parse(cart) : [];
  };

  const updateCartItemQuantity = (productId, quantity) => {
    const cart = getCart();
    const updatedCart = cart.map((item) => {
      if (item._id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    Cookies.set("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return; // prevent 0 or negative qty
    setCartData(getCart());
  };

  const getMyListData = () => {
    fetchDataFromApi("/api/myList").then((res) => {
      if (res?.error === false) {
        setMyListData(res?.data);
      }
    });
  };

  const getProdbyCat = () => {
    fetchDataFromApi("/api/product/getAllProductsByCatId").then((res) => {
      if (res?.error === false) {
        setMyCatProdData(res?.data);
      }
    });
  };

  const values = {
    openProductDetailsModal,
    setOpenProductDetailsModal,
    handleOpenProductDetailsModal,
    handleCloseProductDetailsModal,
    setOpenCartPanel,
    toggleCartPanel,
    openCartPanel,
    setOpenAddressPanel,
    toggleAddressPanel,
    openAddressPanel,
    isLogin,
    setIsLogin,
    alertBox,
    setUserData,
    userData,
    setCatData,
    catData,
    addToCart,
    cartData,
    setCartData,
    getCartItems,
    getCart,
    updateCartItemQuantity,
    handleQuantityChange,
    myListData,
    MyCatProdData,
    setMyListData,
    getMyListData,
    getUserDetails,
    setAddressMode,
    addressMode,
    addressId,
    setAddressId,
    setSearchData,
    searchData,
    windowWidth,
    setOpenFilter,
    openFilter,
    setisFilterBtnShow,
    isFilterBtnShow,
    setOpenSearchPanel,
    openSearchPanel,
    userLocation, // Include userLocation in context values
    setUserLocation, // Include setUserLocation in context values
  };

  return (
    <MyContext.Provider value={values}>
      {children}
      <Toaster />
    </MyContext.Provider>
  );
};

export default ThemeProvider;
