"use client";
import React, { useContext, useState, useEffect } from "react";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoGitCompareOutline } from "react-icons/io5";
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
import FormHelperText from "@mui/material/FormHelperText";
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

  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const history = useRouter();
  const context = useContext(MyContext);
  const [isClient, setIsClient] = useState(false);
  const [clientWindowWidth, setClientWindowWidth] = useState(undefined);

  useEffect(() => {
    setIsClient(true);
    setClientWindowWidth(context?.windowWidth);
  }, [context?.windowWidth]);

  useEffect(() => {
    if (isClient && context?.isLogin) {
      allowLocation();
    }
  }, [isClient, context?.isLogin]);



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { locale, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    fetchDataFromApi("/api/logo").then((res) => {
      Cookies.set("logo", res?.logo[0]?.logo);

    });

    const token = Cookies.get("accessToken");

    if (token !== undefined && token !== null && token !== "") {
      //const url = window.location.href
      //history.push(history.pathname)
    } else {
      // history.push("/login")
    }
  }, [context?.isLogin]);

  const logout = () => {
    setAnchorEl(null);
    signOut("google");

    fetchDataFromApi(`/api/user/logout?token=${Cookies.get("accessToken")}`, {
      withCredentials: true,
    }).then((res) => {
      if (res?.error === false) {
        context.setIsLogin(false);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        context.setUserData(null);
        context?.setCartData([]);
        context?.setMyListData([]);
        history.push("/");
      }
    });
  };

  const openMobileMenu = (val) => {
    setIsOpenMobileMenu(val);
  };
  const allowLocation = () => {
    console.log("Allow location access to get the current location.");
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        patchData('/api/user/location', {
          latitude: latitude,
          longitude: longitude,
        })
        // You can now use latitude and longitude as needed
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error('User denied the request for Geolocation.');
            break;
          case error.POSITION_UNAVAILABLE:
            console.error('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            console.error('The request to get user location timed out.');
            break;
          default:
            console.error('An unknown error occurred.');
            break;
        }
      }
    );
  };

  return (
    <>
      <header className="bg-white fixed lg:sticky left-0 w-full top-0 lg:-top-[87px] z-[101]">
        <div className="top-strip hidden  py-2 border-t-[1px] border-gray-250  border-b-[1px]">
          <div className="container">
            <div className="flex items-center justify-between">
              <div className="col1 w-[50%] hidden lg:block">
                <p className="text-[12px] font-[500] mt-0 mb-0">
                  {t("header.promo")}
                </p>
              </div>

              <div className="col2 flex items-center justify-between w-full lg:w-[50%] lg:justify-end">
                {/* <ul className="flex items-center gap-3 w-full justify-between lg:w-[200px]">
                  <li className="list-none">
                    <Link
                      href="/help-center"
                      className="text-[11px] lg:text-[13px] link font-[500] transition"
                    >
                      Help Center{" "}
                    </Link>
                  </li>
                  <li className="list-none">
                    <Link
                      href="/order-tracking"
                      className="text-[11px] lg:text-[13px] link font-[500] transition"
                    >
                      Order Tracking
                    </Link>
                  </li>
                </ul> */}

                <ul className="flex items-center gap-3 w-full justify-between lg:w-[250px]">
                  <li className="list-none">
                    <Link
                      href="/help-center"
                      className="text-[11px] lg:text-[13px] link font-[500] transition"
                    >
                      {t("header.helpCenter")}
                    </Link>
                  </li>
                  <li className="list-none">
                    <Link
                      href="/order-tracking"
                      className="text-[11px] lg:text-[13px] link font-[500] transition"
                    >
                      {t("header.orderTracking")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="header py-2 lg:py-4 border-b-[1px] border-gray-250">
          <div className="container flex items-center justify-between">
            {isClient && clientWindowWidth !== undefined && clientWindowWidth < 992 && (
              <Button
                className="!w-[35px] !min-w-[35px] !h-[35px] !rounded-full !text-gray-800"
                onClick={() => openMobileMenu(true)}
              >
                <HiOutlineMenu size={22} />
              </Button>
            )}

            <div className="col1 w-[30%] lg:w-[25%]">
              <span>
                <Link href={"/"}>
                  <img
                    src={Cookies.get("logo") !== undefined ? Cookies.get("logo") : "/sooqna.svg"}
                    className="max-w-[140px] lg:max-w-[120px]"
                    alt="logo"
                  />
                </Link>
              </span>
            </div>

            <div
              className={`col2 fixed top-0 left-0 w-full h-full lg:w-[35%] lg:static p-2 lg:p-0 bg-white z-50 ${isClient && clientWindowWidth !== undefined && clientWindowWidth > 992 && "!block"
                } ${context?.openSearchPanel === true ? "block" : "hidden"}`}
            >
              <Search />
            </div>

            <div className="col3 w-[30%] lg:w-[45%] flex items-center pl-3">
              <ul className="flex items-center justify-end gap-2 lg:gap-3 w-full">
                {isClient && clientWindowWidth !== undefined && clientWindowWidth > 992 && (
                  <li className="list-none relative" style={{ zoom: "80%" }}>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <Select
                        size="small"
                        value={locale}
                        onChange={(e) => changeLanguage(e.target.value)}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value={"en"}>English</MenuItem>
                        <MenuItem value={"ar"}>العربية</MenuItem>
                      </Select>
                    </FormControl>
                  </li>
                )}

                {context.isLogin === false && isClient && clientWindowWidth !== undefined && clientWindowWidth > 992 ? (
                  <li className="list-none px-2">
                    <span>
                      <Link
                        href="https://soqqna-vendor.netlify.app/"
                        className="link transition text-[15px] font-[500] px-2"
                      >
                        {t("header.becomeVendor")}
                      </Link>
                    </span>

                    <span>
                      <Link
                        href="/login"
                        className="link transition text-[15px] font-[500] px-2"
                      >
                        {t("header.login")}
                      </Link>
                    </span>

                    <span>
                      <Link
                        href="/register"
                        className="link  transition text-[15px]  font-[500] px-2"
                      >
                        {t("header.register")}
                      </Link>
                    </span>
                  </li>
                ) : (
                  <>
                    {isClient && clientWindowWidth !== undefined && clientWindowWidth > 992 && (
                      <li>
                    <li>
                      <Button
                        className="!text-[#000] myAccountWrap flex items-center gap-3 cursor-pointer"
                        onClick={handleClick}
                      >
                        <div className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !bg-gray-200 flex items-center justify-center">
                          <FaRegUser className="text-[17px] text-[rgba(0,0,0,0.7)]" />
                        </div>

                        {isClient && clientWindowWidth !== undefined && clientWindowWidth > 992 && (
                          <div className="info flex flex-col">
                            <h4 className="leading-3 text-[14px] text-[rgba(0,0,0,0.6)] font-[500] mb-0 capitalize text-center justify-center">
                                Welcome
                                <br /><br />
                                {context?.userData?.name}
                              </h4>
                            {/* <span className="text-[13px] text-[rgba(0,0,0,0.6)]  font-[400] capitalize text-left justify-start">
                              {context?.userData?.email}
                            </span> */}
                          </div>
                        )}
                      </Button>
                    </li>

                        <Menu
                          anchorEl={anchorEl}
                          id="account-menu"
                          open={open}
                          onClose={handleClose}
                          onClick={handleClose}
                          slotProps={{
                            paper: {
                              elevation: 0,
                              sx: {
                                overflow: "visible",
                                filter:
                                  "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                mt: 1.5,
                                "& .MuiAvatar-root": {
                                  width: 32,
                                  height: 32,
                                  ml: -0.5,
                                  mr: 1,
                                },
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
                            },
                          }}
                          transformOrigin={{
                            horizontal: "right",
                            vertical: "top",
                          }}
                          anchorOrigin={{
                            horizontal: "right",
                            vertical: "bottom",
                          }}
                        >
                          <span>
                          <Link href="/my-account" className="w-full block">
                            <MenuItem
                              onClick={handleClose}
                              className="flex gap-2 ! !py-2"
                            >
                              <FaRegUser className="text-[18px]" />{" "}
                              <span className="text-[14px]">
                                {t("header.myAccount")}
                              </span>
                            </MenuItem>
                          </Link>
                          </span>
                          <span>
                          <Link
                            href="/my-account/address"
                            className="w-full block"
                          >
                            <MenuItem
                              onClick={handleClose}
                              className="flex gap-2 ! !py-2"
                            >
                              <LuMapPin className="text-[18px]" />{" "}
                              <span className="text-[14px]">
                                {t("account.address")}
                              </span>
                            </MenuItem>
                          </Link>
                          </span>
                          <span>
                          <Link href="/my-orders" className="w-full block">
                            <MenuItem
                              onClick={handleClose}
                              className="flex gap-2 ! !py-2"
                            >
                              <IoBagCheckOutline className="text-[18px]" />{" "}
                              <span className="text-[14px]">
                                {t("account.orders")}
                              </span>
                            </MenuItem>
                          </Link>
                          </span>
                          <span>
                          <Link href="/my-list" className="w-full block">
                            <MenuItem
                              onClick={handleClose}
                              className="flex gap-2 ! !py-2"
                            >
                              <IoMdHeartEmpty className="text-[18px]" />{" "}
                              <span className="text-[14px]">
                                {t("account.myList")}
                              </span>
                            </MenuItem>
                          </Link>
                          </span>

                          <MenuItem
                            onClick={logout}
                            className="flex gap-2 ! !py-2"
                          >
                            <IoIosLogOut className="text-[18px]" />{" "}
                            <span className="text-[14px]">
                              {t("account.logout")}
                            </span>
                          </MenuItem>
                        </Menu>
                      </li>
                    )}
                  </>
                )}

                {isClient && clientWindowWidth !== undefined && clientWindowWidth > 992 && (
                  <li>
                    <Tooltip title={t("header.wishlist")}>
                      <span>
                      <Link href="/my-list">
                        <IconButton aria-label="cart">
                          <StyledBadge
                            badgeContent={
                              context?.myListData?.length !== 0
                                ? context?.myListData?.length
                                : 0
                            }
                            color="secondary"
                          >
                            <FaRegHeart />
                          </StyledBadge>
                        </IconButton>
                      </Link>
                      </span>
                    </Tooltip>
                  </li>
                )}

                <li>
                  <Tooltip title={t("header.cart")}>
                    <IconButton
                      aria-label="cart"
                      onClick={() => context.setOpenCartPanel(true)}
                    >
                      <StyledBadge
                        badgeContent={
                          context?.cartData?.length !== 0
                            ? context?.cartData?.length
                            : 0
                        }
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
