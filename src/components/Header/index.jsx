"use client";
import React, { useContext, useState, useEffect } from "react";
import Badge from "@mui/material/Badge";
import { useSession } from "next-auth/react";
import { MyContext } from "@/context/ThemeProvider"; // Import MyContext
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
import { fetchDataFromApi, patchData } from "@/utils/api";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslation } from "@/utils/useTranslation";
import { useLanguage } from "@/context/LanguageContext";

import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Image from "next/image";
import LocationModal from "../Location";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useCurrency } from "@/context/CurrencyContext";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const { currency, changeCurrency } = useCurrency();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const history = useRouter();
  const context = useContext(MyContext);
  const [isClient, setIsClient] = useState(false);
  const [clientWindowWidth, setClientWindowWidth] = useState(undefined);
  const [logoSrc, setLogoSrc] = useState("/sooqna.svg");
  const { data: session } = useSession(); // Get session for authenticated user
  const { userLocation } = useContext(MyContext); // Get userLocation from context

  const [lang, setlang] = useState(null);
  const openLang = Boolean(lang);

  const [selectedlang, setSelectedlang] = useState({
    img: "",
    lang: "",
  });

  const { locale, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    setIsClient(true);
    setClientWindowWidth(context?.windowWidth);
    const lang = localStorage.getItem("locale");
    setSelectedlang({
      img: lang === "en" ? "/flags/en.png" : "/flags/ar.png",
      lang: lang === "en" ? "en" : "ar",
    });
  }, [context?.windowWidth]);

  // Remove the useEffect that was reading from localStorage directly
  // The userLocation will now come from the context

  useEffect(() => {
    if (isClient && context?.isLogin) {
      // allowLocation();
    }
  }, [isClient, context?.isLogin]);

  const handleClickLang = (event) => {
    setlang(event.currentTarget);
  };
  const handleCloseLang = () => {
    setlang(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectedlangFun = (lang) => {
    setSelectedlang({
      img: lang.img,
      lang: lang.lang,
    });
    setlang(null);
    changeLanguage(lang.lang);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedLogo = localStorage.getItem("logo");
      if (cachedLogo) {
        setLogoSrc(cachedLogo);
      }
    }

    fetchDataFromApi("/api/logo").then((res) => {
      // Cookies.set("logo", res?.logo[0]?.logo);
      const logo = res?.logo?.[0]?.logo;
      if (logo) {
        Cookies.set("logo", logo);
        setLogoSrc(logo);
        if (typeof window !== "undefined") {
          localStorage.setItem("logo", logo);
        }
      }
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

  return (
    <>
      <header className="bg-white fixed lg:sticky left-0 w-full top-0 lg:-top-[85px] z-[1001] ">
        {/* <div className="top-strip hidden  py-2 border-t-[1px] border-gray-250  border-b-[1px]">
          <div className="container">
            <div className="flex items-center justify-between">
              <div className="col1 w-[50%] hidden lg:block">
                <p className="text-[12px] font-[500] mt-0 mb-0">
                  {t("header.promo")}
                </p>
              </div>

              <div className="col2 flex items-center justify-between w-full lg:w-[50%] lg:justify-end">
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
        </div> */}

        {/* <div className="container flex items-center justify-between gap-2 lg:gap-3 py-4"> */}
        <div className="container flex items-center justify-between gap-1 sm:gap-2 lg:gap-3 py-3 lg:py-4">
          {isClient &&
            clientWindowWidth !== undefined &&
            clientWindowWidth < 992 && (
              <Button
                // className="!w-[35px] !min-w-[35px] !h-[35px] !rounded-full !text-gray-800"
                className="!w-[32px] !min-w-[32px] !h-[32px] sm:!w-[35px] sm:!min-w-[35px] sm:!h-[35px] !rounded-full !text-gray-800 !p-0"
                onClick={() => openMobileMenu(true)}
              >
                <HiOutlineMenu size={18} className="sm:!text-[22px]" />
              </Button>
            )}

          <div className="headerPart1 flex items-center  gap-5">
            {/* logo wrapper start here */}
            {/* <div className="logoWrapper">
              <Link href="/">
                <Image
                  src={logoSrc}
                  alt="logo"
                  className="max-w-[140px] lg:max-w-[120px]"
                  width={140}
                  height={60}
                  priority
                />
              </Link>
            </div> */}
            <div className="logoWrapper">
              <Link href="/">
                <Image
                  src={logoSrc}
                  alt="logo"
                  className="max-w-[100px] sm:max-w-[120px] lg:max-w-[140px]"
                  width={140}
                  height={60}
                  priority
                />
              </Link>
            </div>
            {/* logo wrapper ends here */}

            {/* location wrapper ends here */}
            {context?.windowWidth > 992 && (
              <div className="col1 flex items-center justify-center">
                <Button
                  onClick={() => setLocationModalOpen(!locationModalOpen)}
                  className="
                      flex items-center space-x-1
                      text-sm !font-medium !text-gray-700
                      hover:!text-gray-900 hover:!bg-gray-100
                      px-2 py-1 !capitalize
                    "
                >
                  <LuMapPin className="text-lg" />
                  <span className="truncate max-w-[120px]">
                    {userLocation || "Select Location"}
                  </span>
                </Button>
              </div>
            )}

            {locationModalOpen && (
              <div className="mobileMenuOverlay fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] w-full h-[100%] z-[100]"></div>
            )}

            {locationModalOpen && (
              <LocationModal
                openkey={locationModalOpen}
                setOpenkey={setLocationModalOpen}
              />
            )}

            {/* location wrapper ends here */}
          </div>

          {/* <div className="headerPart2 w-[35%]"> */}
          <div className="headerPart2 w-[35%] lg:w-[40%]">
            {/* search wrapper ends here */}
            <div
              className={`col2 fixed top-0 left-0 w-full h-full lg:static p-2 lg:p-0 bg-white z-50 ${
                isClient &&
                clientWindowWidth !== undefined &&
                clientWindowWidth > 992 &&
                "!block"
              } ${context?.openSearchPanel === true ? "block" : "hidden"}`}
            >
              <Search />
            </div>

            {/* search wrapper ends here */}
          </div>

          {/* <div className="headerPart3 flex items-center justify-end gap-5">
            <ul className="flex items-center justify-end gap-2 lg:gap-3 w-full"> */}
          <div className="headerPart3 flex items-center justify-end gap-2 lg:gap-5">
            <ul className="flex items-center justify-end gap-1 sm:gap-2 lg:gap-3 w-full">
              {context?.windowWidth < 992 && (
                <li>
                  <HiOutlineLocationMarker
                    size={25}
                    onClick={() => setLocationModalOpen(!locationModalOpen)}
                  />
                </li>
              )}

              <li className="list-none relative">
                <div className="relative">
                  <Button
                    className="flex items-center gap-1 !min-w-[50px] !px-2"
                    onClick={handleClickLang}
                  >
                    <Image
                      src={selectedlang.img}
                      alt="lang"
                      width={context?.windowWidth < 992 ? 20 : 25}
                      height={context?.windowWidth < 992 ? 20 : 25}
                    />
                    {context?.windowWidth > 992 && (
                      <span className="text-gray-800 text-sm">
                        {selectedlang.lang}
                      </span>
                    )}
                  </Button>

                  <Menu
                    id="basic-menu"
                    anchorEl={lang}
                    open={openLang}
                    onClose={handleCloseLang}
                    slotProps={{
                      list: {
                        "aria-labelledby": "basic-button",
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() =>
                        selectedlangFun({
                          img: "/flags/en.png",
                          lang: "en",
                        })
                      }
                      className="flex items-center gap-1"
                    >
                      <Image
                        src="/flags/en.png"
                        alt="English"
                        width={25}
                        height={25}
                      />
                      <span className="text-gray-800 text-[15px]">EN</span>
                    </MenuItem>

                    <MenuItem
                      onClick={() =>
                        selectedlangFun({
                          img: "/flags/ar.png",
                          lang: "ar",
                        })
                      }
                      className="flex items-center gap-1"
                    >
                      <Image
                        src="/flags/ar.png"
                        alt="Arabic"
                        width={25}
                        height={25}
                      />
                      <span className="text-gray-800  text-[15px]">AR</span>
                    </MenuItem>
                  </Menu>
                </div>
              </li>

              {/* Currency selector */}
              {/* <li className="list-none">
                <FormControl variant="standard" sx={{ minWidth: 80 }}>
                  <Select
                    value={currency}
                    onChange={(e) => changeCurrency(e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Currency Selector" }}
                    sx={{ fontSize: "14px" }}
                  >
                    <MenuItem value="USD">Dollar</MenuItem>
                    <MenuItem value="EUR">Euro</MenuItem>
                    <MenuItem value="SAR">Saudi Riyal</MenuItem>
                    <MenuItem value="AED">UAE Dirham</MenuItem>
                    <MenuItem value="QAR">Qatari Riyal</MenuItem>
                    <MenuItem value="BHD">Bahraini Dinar</MenuItem>
                    <MenuItem value="KWD">Kuwaiti Dinar</MenuItem>
                    <MenuItem value="SYP">Syrian Pound</MenuItem>
                  </Select>
                </FormControl>
              </li> */}
              <li className="list-none">
                <FormControl
                  variant="standard"
                  sx={{ minWidth: context?.windowWidth < 992 ? 60 : 80 }}
                >
                  <Select
                    value={currency}
                    onChange={(e) => changeCurrency(e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Currency Selector" }}
                    sx={{
                      fontSize: context?.windowWidth < 992 ? "12px" : "14px",
                      "& .MuiSelect-select": {
                        padding:
                          context?.windowWidth < 992
                            ? "4px 24px 4px 8px"
                            : "4px 32px 4px 8px",
                      },
                    }}
                  >
                    <MenuItem
                      value="USD"
                      sx={{
                        fontSize: context?.windowWidth < 992 ? "12px" : "14px",
                      }}
                    >
                      {context?.windowWidth < 992 ? "$" : "Dollar"}
                    </MenuItem>
                    <MenuItem
                      value="EUR"
                      sx={{
                        fontSize: context?.windowWidth < 992 ? "12px" : "14px",
                      }}
                    >
                      {context?.windowWidth < 992 ? "€" : "Euro"}
                    </MenuItem>
                    <MenuItem
                      value="SAR"
                      sx={{
                        fontSize: context?.windowWidth < 992 ? "12px" : "14px",
                      }}
                    >
                      {context?.windowWidth < 992 ? "SAR" : "Saudi Riyal"}
                    </MenuItem>
                    <MenuItem
                      value="AED"
                      sx={{
                        fontSize: context?.windowWidth < 992 ? "12px" : "14px",
                      }}
                    >
                      {context?.windowWidth < 992 ? "AED" : "UAE Dirham"}
                    </MenuItem>
                    <MenuItem
                      value="QAR"
                      sx={{
                        fontSize: context?.windowWidth < 992 ? "12px" : "14px",
                      }}
                    >
                      {context?.windowWidth < 992 ? "QAR" : "Qatari Riyal"}
                    </MenuItem>
                    <MenuItem
                      value="BHD"
                      sx={{
                        fontSize: context?.windowWidth < 992 ? "12px" : "14px",
                      }}
                    >
                      {context?.windowWidth < 992 ? "BHD" : "Bahraini Dinar"}
                    </MenuItem>
                    <MenuItem
                      value="KWD"
                      sx={{
                        fontSize: context?.windowWidth < 992 ? "12px" : "14px",
                      }}
                    >
                      {context?.windowWidth < 992 ? "KWD" : "Kuwaiti Dinar"}
                    </MenuItem>
                    <MenuItem
                      value="SYP"
                      sx={{
                        fontSize: context?.windowWidth < 992 ? "12px" : "14px",
                      }}
                    >
                      {context?.windowWidth < 992 ? "SYP" : "Syrian Pound"}
                    </MenuItem>
                  </Select>
                </FormControl>
              </li>

              {context?.windowWidth > 992 && (
                <li className="list-none px1">
                  <span>
                    <Link
                      href="https://seller.soouqna.com/"
                      className="link transition text-[15px] font-[500] px-2"
                    >
                      {t("header.becomeVendor")}
                    </Link>
                  </span>
                </li>
              )}

              {context.isLogin === false &&
              isClient &&
              clientWindowWidth !== undefined &&
              clientWindowWidth > 992 ? (
                <li className="list-none px-1">
                  <Link
                    href="/login"
                    className="link transition text-[15px] font-[500] px-2"
                  >
                    <Button className="btn-org btn-sm">
                      {t("header.login")}
                    </Button>
                  </Link>
                </li>
              ) : (
                <>
                  {isClient &&
                    clientWindowWidth !== undefined &&
                    clientWindowWidth > 992 && (
                      <li>
                        <Button
                          className="!text-[#000] myAccountWrap flex items-center gap-3 cursor-pointer"
                          onClick={handleClick}
                        >
                          {/* <div className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !bg-gray-200 flex items-center justify-center">
                              <FaRegUser className="text-[17px] text-[rgba(0,0,0,0.7)]" />
                            </div> */}
                          <div className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !bg-gray-200 flex items-center justify-center overflow-hidden">
                            {context?.userData?.avatar !== "" &&
                            context?.userData?.avatar !== undefined ? (
                              <Image
                                src={context.userData.avatar}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <FaRegUser className="text-[17px] text-[rgba(0,0,0,0.7)]" />
                            )}
                          </div>

                          {isClient &&
                            clientWindowWidth !== undefined &&
                            clientWindowWidth > 992 && (
                              <div className="info flex flex-col">
                                <h4 className="leading-4 text-[14px] text-[rgba(0,0,0,0.6)] font-[500] mb-0 capitalize text-left !justify-start lead">
                                  Welcome
                                  <br />
                                  {context?.userData?.name}
                                </h4>
                                {/* <span className="text-[13px] text-[rgba(0,0,0,0.6)]  font-[400] capitalize text-left justify-start">
                              {context?.userData?.email}
                            </span> */}
                              </div>
                            )}
                        </Button>

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
                          {context?.isLogin == true && (
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
                          )}

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

              {context?.isLogin && (
                <li className={context?.windowWidth < 992 ? "hidden" : "block"}>
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

              {/* {context.isLogin === false && context?.windowWidth < 992 && (
                <li className="list-none">
                  <Link href="/login">
                    <Button className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-gray-800 !p-0">
                      <FaRegUser size={16} />
                    </Button>
                  </Link>
                </li>
              )}

              {context.isLogin === true && context?.windowWidth < 992 && (
                <li className="list-none">
                  <Button
                    className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-gray-800 !p-0 overflow-hidden"
                    onClick={handleClick}
                  >
                    {context?.userData?.avatar !== "" && context?.userData?.avatar !== undefined ? (
                      <Image
                        src={context.userData.avatar}
                        alt="User Avatar"
                        width={35}
                        height={35}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FaRegUser size={16} />
                    )}
                  </Button>
                </li>
              )} */}
            </ul>
          </div>
        </div>
        <Navigation
          isOpenCatPanel={isOpenCatPanel}
          setIsOpenCatPanel={setIsOpenCatPanel}
          isOpenMobileMenu={isOpenMobileMenu}
          openMobileMenu={openMobileMenu}
        />
      </header>

      {isOpenCatPanel === true && (
        <div className="overlay bg-[rgba(0,0,0,0.5)] w-full h-full fixed top-0 left-0 z-[1000]"></div>
      )}

      {/* <div className="afterHeader mt-[120px] lg:mt-0"></div> */}
      <div className="afterHeader mt-[70px] sm:mt-[80px] lg:mt-0"></div>
    </>
  );
};

export default Header;
