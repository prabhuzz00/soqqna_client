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
  const [windowWidth, setWindowWidth] = useState(1200); // Default to desktop width to match server render

  const [openFilter, setOpenFilter] = useState(false);
  const [isFilterBtnShow, setisFilterBtnShow] = useState(false);

  const [openSearchPanel, setOpenSearchPanel] = useState(false);
  const [userLocation, setUserLocation] = useState("Select Location"); // State for user location
  const [siteSettings, setSiteSettings] = useState({});

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

    // Load cart from localStorage
    getCartItems();

    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true);
      getMyListData();
      getUserDetails();
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
    if (typeof window !== "undefined") {
      const cachedCats = localStorage.getItem("categories");
      if (cachedCats) {
        try {
          setCatData(JSON.parse(cachedCats));
        } catch (e) {
          console.error("Failed to parse cached categories", e);
        }
      }
    }
    fetchDataFromApi("/api/category").then((res) => {
      if (res?.error === false) {
        setCatData(res?.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("categories", JSON.stringify(res.data));
        }
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

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const res = await fetchDataFromApi("/api/site-settings");
        const settings = res?.data || {};

        Cookies.set("siteSettings", JSON.stringify(settings), { expires: 1 });
        setSiteSettings(settings);
      } catch (err) {
        console.error("Error fetching site settings:", err);

        // Fallback to cookie if available
        const cookieData = Cookies.get("siteSettings");
        if (cookieData) {
          setSiteSettings(JSON.parse(cookieData));
        }
      }
    };

    fetchSiteSettings();
  }, []);

  const alertBox = (type, msg) => {
    if (type === "success") {
      toast.success(msg);
    }
    if (type === "error") {
      toast.error(msg);
    }
  };

  const getCart = () => {
    try {
      const cart = localStorage.getItem("cart");
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error("Error getting cart:", error);
      return [];
    }
  };

  const addToCart = (product, userId, quantity) => {
    try {
      const cart = getCart();
      // const index = cart.findIndex((item) => item._id === product._id);

      const index = cart.findIndex(
        (item) => item.cartItemId === product.cartItemId
      );

      if (index !== -1) {
        // Update quantity if same variation exists
        cart[index].quantity = quantity;
      } else {
        // Add new item
        cart.push({ ...product, quantity });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alertBox("success", "Item added in the cart...");
      getCartItems();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alertBox("error", "Failed to add item to cart");
    }
  };

  const getCartItems = () => {
    try {
      const cart = localStorage.getItem("cart");
      const parsedCart = cart ? JSON.parse(cart) : [];
      setCartData(parsedCart);
      return parsedCart;
    } catch (error) {
      console.error("Error getting cart items:", error);
      setCartData([]);
      return [];
    }
  };

  const clearCart = () => {
    try {
      localStorage.removeItem("cart");
      setCartData([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      alertBox("error", "Failed to clear cart");
    }
  };

  const updateCartItemQuantity = (productId, quantity) => {
    try {
      const cart = getCart();
      const updatedCart = cart.map((item) => {
        if (item._id === productId || item.cartItemId === productId) {
          return { ...item, quantity, subTotal: parseInt(item.price * quantity) };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartData(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
      alertBox("error", "Failed to update quantity");
    }
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
    siteSettings,
    setSiteSettings,
    setCatData,
    catData,
    addToCart,
    cartData,
    setCartData,
    getCartItems,
    getCart,
    clearCart,
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
