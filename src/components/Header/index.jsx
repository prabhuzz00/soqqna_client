"use client";
import React, { useContext, useState, useEffect } from "react";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa6";
import Tooltip from "@mui/material/Tooltip";
import Navigation from "./Navigation";
import { Button } from "@mui/material";
import { FaRegUser } from "react-icons/fa";
import Cookies from "js-cookie";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { LuMapPin } from "react-icons/lu";
import { HiOutlineMenu } from "react-icons/hi";
import Link from "next/link";
import Search from "../Search";
import { MyContext } from "@/context/ThemeProvider";
import { fetchDataFromApi, patchData } from "@/utils/api";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslation } from "@/utils/useTranslation";
import { useLanguage } from "@/context/LanguageContext";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isClient, setIsClient] = useState(false);
  const [clientWindowWidth, setClientWindowWidth] = useState();
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/sooqna.svg"); // Add state for logo source
  const history = useRouter();
  const context = useContext(MyContext);
  const { locale, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    setIsClient(true);
    setClientWindowWidth(context?.windowWidth);
  }, [context?.windowWidth]);

  useEffect(() => {
    // Fetch logo and set cookie
    fetchDataFromApi("/api/logo").then((res) => {
      Cookies.set("logo", res?.logo[0]?.logo);
    });

    // Read logo from cookie on client mount
    const logoFromCookie = Cookies.get("logo");
    if (logoFromCookie) {
      setLogoSrc(logoFromCookie);
    }

  }, [context?.isLogin]); // Added context?.isLogin as dependency

  useEffect(() => {
    if (isClient && context?.isLogin) {
      allowLocation();
    }
  }, [isClient, context?.isLogin]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const logout = () => {
    handleClose();
    signOut("google");
    fetchDataFromApi(`/api/user/logout?token=${Cookies.get("accessToken")}`, {
      withCredentials: true,
    }).then((res) => {
      if (!res?.error) {
        context.setIsLogin(false);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        context.setUserData(null);
        context.setCartData([]);
        context.setMyListData([]);
        history.push("/");
      }
    });
  };

  const openMobileMenu = (val) => setIsOpenMobileMenu(val);
  const allowLocation = () => {
    if (!navigator.geolocation) return console.error("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        patchData("/api/user/location", { latitude, longitude });
      },
      (error) => console.error("Geolocation error", error)
    );
  };

  return (
    <>
      <header className="bg-white fixed lg:sticky left-0 w-full top-0 z-[101]">
        {/* top strip */}
        <div className="top-strip hidden py-2 border-t border-b border-gray-250">
          <div className="container flex justify-between">
            <p className="text-xs font-medium hidden lg:block">
              {t("header.promo")}
            </p>
            <ul className="flex items-center gap-3 w-full lg:w-[250px] justify-end">
              <li className="list-none">
                <Link href="/help-center" className="text-sm font-medium">
                  {t("header.helpCenter")}
                </Link>
              </li>
              <li className="list-none">
                <Link href="/order-tracking" className="text-sm font-medium">
                  {t("header.orderTracking")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* main header */}
        <div className="header py-2 lg:py-4 border-b border-gray-250">
          <div className="container flex items-center justify-between">
            {/* mobile menu button */}
            {isClient && clientWindowWidth < 992 && (
              <Button
                className="!w-9 !h-9 rounded-full text-gray-800"
                onClick={() => openMobileMenu(true)}
              >
                <HiOutlineMenu size={22} />
              </Button>
            )}

            {/* logo */}
            <div className="w-1/3 lg:w-1/4">
              <Link href="/">
                <img
                  src={logoSrc} // Use the state variable for src
                  alt="logo"
                  className="max-w-[140px] lg:max-w-[120px]"
                />
              </Link>
            </div>

            {/* search panel */}
            <div
              className={`fixed inset-0 lg:static lg:w-[35%] p-2 lg:p-0 bg-white z-50 ${
                context.openSearchPanel ? "block" : "hidden"
              } ${isClient && clientWindowWidth > 992 ? "block" : ""}`}
            >
              <Search />
            </div>

            {/* right controls */}
            <div className="w-1/3 lg:w-11/12 flex items-center justify-end pl-3">
              <ul className="flex items-center gap-2 lg:gap-3">
                {/* language selector */}
                {isClient && clientWindowWidth > 992 && (
                  <li className="list-none">
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={locale}
                        onChange={(e) => changeLanguage(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="ar">العربية</MenuItem>
                      </Select>
                    </FormControl>
                  </li>
                )}

                {/* login/register */}
                {context.isLogin === false && isClient && clientWindowWidth > 992 ? (
                  <li className="list-none px-2">
                    <Link href="https://soqqna-vendor.netlify.app/">
                      <span className="text-base font-medium px-2">
                        {t("header.becomeVendor")}
                      </span>
                    </Link>
                    <Link href="/login">
                      <span className="text-base font-medium px-2">
                        {t("header.login")}
                      </span>
                    </Link>
                    <Link href="/register">
                      <span className="text-base font-medium px-2">
                        {t("header.register")}
                      </span>
                    </Link>
                  </li>
                ) : (
                  /* user menu button + popover */
                  isClient &&
                  clientWindowWidth > 992 && (
                    <li className="list-none relative">
                      <Button
                        className="text-black flex items-center gap-3"
                        onClick={handleClick}
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaRegUser className="text-lg text-gray-700" />
                        </div>
                        <div className="flex flex-col text-center">
                          <h4 className="text-sm font-medium text-gray-600 leading-none">
                            {t("header.welcome")}<br />
                            {context.userData?.name}
                          </h4>
                        </div>
                      </Button>

                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: "visible",
                            mt: 1.5,
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            "&::before": {
                              content: '""',
                              display: "block",
                              position: "absolute",
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: "background.paper",
                              transform: "translateY(-50%) rotate(45deg)",
                              zIndex: 0,
                            },
                          },
                        }}
                      >
                        <Link href="/my-account" passHref>
                          <MenuItem onClick={handleClose}>
                            <FaRegUser className="mr-2" /> {t("header.myAccount")}
                          </MenuItem>
                        </Link>
                        <Link href="/my-account/address" passHref>
                          <MenuItem onClick={handleClose}>
                            <LuMapPin className="mr-2" /> {t("account.address")}
                          </MenuItem>
                        </Link>
                        <Link href="/my-orders" passHref>
                          <MenuItem onClick={handleClose}>
                            <IoBagCheckOutline className="mr-2" /> {t("account.orders")}
                          </MenuItem>
                        </Link>
                        <Link href="/my-list" passHref>
                          <MenuItem onClick={handleClose}>
                            <IoMdHeartEmpty className="mr-2" /> {t("account.myList")}
                          </MenuItem>
                        </Link>
                        <MenuItem onClick={logout}>
                          <IoIosLogOut className="mr-2" /> {t("account.logout")}
                        </MenuItem>
                      </Menu>
                    </li>
                  )
                )}

                {/* wishlist */}
                {isClient && clientWindowWidth > 992 && (
                  <li className="list-none">
                    <Tooltip title={t("header.wishlist")}>
                      <Link href="/my-list">
                        <IconButton>
                          <StyledBadge
                            badgeContent={context.myListData?.length || 0}
                            color="secondary"
                          >
                            <FaRegHeart />
                          </StyledBadge>
                        </IconButton>
                      </Link>
                    </Tooltip>
                  </li>
                )}

                {/* cart */}
                <li className="list-none">
                  <Tooltip title={t("header.cart")}>
                    <IconButton onClick={() => context.setOpenCartPanel(true)}>
                      <StyledBadge
                        badgeContent={context.cartData?.length || 0}
                        color="secondary"
                      >
                        <MdOutlineShoppingCart />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* navigation menu */}
        <Navigation
          isOpenCatPanel={isOpenCatPanel}
          setIsOpenCatPanel={setIsOpenCatPanel}
          isOpenMobileMenu={isOpenMobileMenu}
          openMobileMenu={openMobileMenu}
        />
      </header>
      <div className="afterHeader mt-[115px] lg:mt-0"></div>
    </>
  );
};

export default Header;
