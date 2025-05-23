// "use client";
// import React, { useContext, useEffect, useState } from "react";
// import Button from "@mui/material/Button";
// import { QtyBox } from "../QtyBox";
// import Rating from "@mui/material/Rating";
// import { MdOutlineShoppingCart } from "react-icons/md";
// import { FaRegHeart } from "react-icons/fa";
// import { IoGitCompareOutline } from "react-icons/io5";
// import { MyContext } from "@/context/ThemeProvider";
// import { CircularProgress } from "@mui/material";
// import { postData } from "@/utils/api";
// import { FaCheckDouble } from "react-icons/fa6";
// import { IoMdHeart } from "react-icons/io";
// import { useLanguage } from "@/context/LanguageContext";
// import { useTranslation } from "@/utils/useTranslation";

// export const ProductDetailsComponent = (props) => {
//   const [productActionIndex, setProductActionIndex] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedTabName, setSelectedTabName] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [tabError, setTabError] = useState(false);
//   const [isAdded, setIsAdded] = useState(false);
//   const [isAddedInMyList, setIsAddedInMyList] = useState(false);

//   const context = useContext(MyContext);
//   const { locale } = useLanguage();
//   const { t } = useTranslation();

//   const handleSelecteQty = (qty) => {
//     setQuantity(qty);
//   };

//   const handleClickActiveTab = (index, name) => {
//     setProductActionIndex(index);
//     setSelectedTabName(name);
//   };

//   useEffect(() => {
//     const item = context?.cartData?.filter((cartItem) =>
//       cartItem.productId.includes(props?.item?._id)
//     );

//     if (item?.length !== 0) {
//       setIsAdded(true);
//     } else {
//       setIsAdded(false);
//     }
//   }, [isAdded]);

//   useEffect(() => {
//     const myListItem = context?.myListData?.filter((item) =>
//       item.productId.includes(props?.item?._id)
//     );

//     if (myListItem?.length !== 0) {
//       setIsAddedInMyList(true);
//     } else {
//       setIsAddedInMyList(false);
//     }
//   }, [context?.myListData]);

//   const addToCart = (product, userId, quantity) => {
//     const productItem = {
//       _id: product?._id,
//       name: product?.name,
//       image: product?.images[0],
//       rating: product?.rating,
//       price: product?.price,
//       oldPrice: product?.oldPrice,
//       discount: product?.discount,
//       quantity: quantity,
//       subTotal: parseInt(product?.price * quantity),
//       productId: product?._id,
//       countInStock: product?.countInStock,
//       brand: product?.brand,
//       size: props?.item?.size?.length !== 0 ? selectedTabName : "",
//       weight: props?.item?.productWeight?.length !== 0 ? selectedTabName : "",
//       ram: props?.item?.productRam?.length !== 0 ? selectedTabName : "",
//       barcode: product?.barcode,
//       vendorId: product?.vendorId,
//       variation: product?.variation,
//     };

//     if (
//       props?.item?.size?.length !== 0 ||
//       props?.item?.productWeight?.length !== 0 ||
//       props?.item?.productRam?.length !== 0
//     ) {
//       if (selectedTabName !== null) {
//         setIsLoading(true);

//         context?.alertBox("success", "Item added");
//         context?.addToCart(productItem, userId, quantity);
//         context?.getCartItems();
//         setTimeout(() => {
//           setIsLoading(false);
//           setIsAdded(true);
//         }, 500);
//       } else {
//         setTabError(true);
//       }
//     } else {
//       setIsLoading(true);

//       context?.alertBox("success", "Item added");
//       context?.addToCart(productItem, userId, quantity);
//       context?.getCartItems();
//       setTimeout(() => {
//         setIsLoading(false);
//         setIsAdded(true);
//       }, 500);
//     }
//   };

//   const handleAddToMyList = (item) => {
//     if (context?.userData === null) {
//       context?.alertBox("error", "you are not login please login first");
//       return false;
//     } else {
//       const obj = {
//         productId: item?._id,
//         userId: context?.userData?._id,
//         productTitle: item?.name,
//         image: item?.images[0],
//         rating: item?.rating,
//         price: item?.price,
//         oldPrice: item?.oldPrice,
//         brand: item?.brand,
//         barcode: item?.barcode,
//         vendorId: item?.vendorId,
//         discount: item?.discount,
//       };

//       postData("/api/myList/add", obj).then((res) => {
//         if (res?.error === false) {
//           context?.alertBox("success", res?.message);
//           setIsAddedInMyList(true);
//           context?.getMyListData();
//         } else {
//           context?.alertBox("error", res?.message);
//         }
//       });
//     }
//   };

//   return (
//     <>
//       <h1 className="text-[18px] sm:text-[22px] font-[600] mb-2">
//         {locale === "ar" ? props?.item?.arbName : props?.item?.name}
//       </h1>
//       <div className="flex items-start sm:items-center lg:items-center flex-col sm:flex-row md:flex-row lg:flex-row gap-3 justify-start">
//         <span className="text-gray-400 text-[13px]">
//           Brands :{" "}
//           <span className="font-[500] text-black opacity-75">
//             {props?.item?.brand}
//           </span>
//         </span>

//         <Rating
//           name="size-small"
//           value={props?.item?.rating}
//           size="small"
//           readOnly
//         />
//         <span
//           className="text-[13px] cursor-pointer"
//           onClick={props.gotoReviews}
//         >
//           {t("product.review")} ({props.reviewsCount})
//         </span>
//       </div>

//       <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row items-start sm:items-center gap-4 mt-4">
//         <div className="flex items-center gap-4">
//           <span className="oldPrice line-through text-gray-500 text-[20px] font-[500]">
//             ${props?.item?.oldPrice}
//           </span>
//           <span className="price text-primary text-[20px]  font-[600]">
//             ${props?.item?.price}
//           </span>
//         </div>

//         <div className="flex items-center gap-4">
//           <span className="text-[14px]">
//             {t("product.availableInStock")}:{" "}
//             <span className="text-green-600 text-[14px] font-bold">
//               {props?.item?.countInStock} {t("product.items")}
//             </span>
//           </span>
//         </div>
//       </div>

//       <p className="mt-3 pr-10 mb-5">
//         {locale === "ar"
//           ? props?.item?.arbDescription
//           : props?.item?.description}
//       </p>

//       {props?.item?.productRam?.length !== 0 && (
//         <div className="flex items-center gap-3">
//           <span className="text-[16px]">RAM:</span>
//           <div className="flex items-center gap-1 actions">
//             {props?.item?.productRam?.map((item, index) => {
//               return (
//                 <Button
//                   key={index}
//                   className={`${
//                     productActionIndex === index
//                       ? "!bg-primary !text-white"
//                       : ""
//                   }  ${tabError === true && "error"}`}
//                   onClick={() => handleClickActiveTab(index, item)}
//                 >
//                   {item}
//                 </Button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {props?.item?.size?.length !== 0 && (
//         <div className="flex items-center gap-3">
//           <span className="text-[16px]">SIZE:</span>
//           <div className="flex items-center gap-1 actions">
//             {props?.item?.size?.map((item, index) => {
//               return (
//                 <Button
//                   key={index}
//                   className={`${
//                     productActionIndex === index
//                       ? "!bg-primary !text-white"
//                       : ""
//                   } ${tabError === true && "error"}`}
//                   onClick={() => handleClickActiveTab(index, item)}
//                 >
//                   {item}
//                 </Button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {props?.item?.productWeight?.length !== 0 && (
//         <div className="flex items-center gap-3">
//           <span className="text-[16px]">WEIGHT:</span>
//           <div className="flex items-center gap-1 actions">
//             {props?.item?.productWeight?.map((item, index) => {
//               return (
//                 <Button
//                   key={index}
//                   className={`${
//                     productActionIndex === index
//                       ? "!bg-primary !text-white"
//                       : ""
//                   }  ${tabError === true && "error"}`}
//                   onClick={() => handleClickActiveTab(index, item)}
//                 >
//                   {item}
//                 </Button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       <p className="text-[14px] mt-5 mb-2 text-[#000]">
//         {t("product.freeShipping")}
//       </p>
//       <div className="flex items-center gap-4 py-4">
//         <div className="qtyBoxWrapper w-[70px]">
//           <QtyBox handleSelecteQty={handleSelecteQty} />
//         </div>

//         <Button
//           className="btn-org flex gap-2 !min-w-[150px]"
//           onClick={() =>
//             addToCart(props?.item, context?.userData?._id, quantity)
//           }
//         >
//           {isLoading === true ? (
//             <CircularProgress />
//           ) : (
//             <>
//               {isAdded === true ? (
//                 <>
//                   <FaCheckDouble /> Added
//                 </>
//               ) : (
//                 <>
//                   <MdOutlineShoppingCart className="text-[22px]" />
//                   {t("product.addToCart")}
//                 </>
//               )}
//             </>
//           )}
//         </Button>
//       </div>

//       <div className="flex items-center gap-4 mt-4">
//         <span
//           className="flex items-center gap-2 text-[14px] sm:text-[15px] link cursor-pointer font-[500]"
//           onClick={() => handleAddToMyList(props?.item)}
//         >
//           {isAddedInMyList === true ? (
//             <IoMdHeart className="text-[18px] !text-primary group-hover:text-white hover:!text-white" />
//           ) : (
//             <FaRegHeart className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
//           )}
//           {t("product.addToWishlist")}
//         </span>

//         <span className="flex items-center gap-2  text-[14px] sm:text-[15px] link cursor-pointer font-[500]">
//           <IoGitCompareOutline className="text-[18px]" />{" "}
//           {t("product.addToCompare")}
//         </span>
//       </div>
//     </>
//   );
// };

// "use client";
// import React, { useContext, useEffect, useState } from "react";
// import Button from "@mui/material/Button";
// import { QtyBox } from "../QtyBox";
// import Rating from "@mui/material/Rating";
// import { MdOutlineShoppingCart } from "react-icons/md";
// import { FaRegHeart } from "react-icons/fa";
// import { IoGitCompareOutline } from "react-icons/io5";
// import { MyContext } from "@/context/ThemeProvider";
// import { CircularProgress } from "@mui/material";
// import { postData } from "@/utils/api";
// import { FaCheckDouble } from "react-icons/fa6";
// import { IoMdHeart } from "react-icons/io";
// import { useLanguage } from "@/context/LanguageContext";
// import { useTranslation } from "@/utils/useTranslation";

// export const ProductDetailsComponent = (props) => {
//   const [productActionIndex, setProductActionIndex] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedTabName, setSelectedTabName] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [tabError, setTabError] = useState(false);
//   const [isAdded, setIsAdded] = useState(false);
//   const [isAddedInMyList, setIsAddedInMyList] = useState(false);
//   const [selectedColor, setSelectedColor] = useState(null); // Track selected color variation
//   const [selectedSize, setSelectedSize] = useState(null); // Track selected size
//   const [currentPrice, setCurrentPrice] = useState(props?.item?.price); // Dynamic price
//   const [currentStock, setCurrentStock] = useState(props?.item?.countInStock); // Dynamic stock

//   const context = useContext(MyContext);
//   const { locale } = useLanguage();
//   const { t } = useTranslation();

//   const handleSelecteQty = (qty) => {
//     setQuantity(qty);
//   };

//   const handleClickActiveTab = (index, name) => {
//     setProductActionIndex(index);
//     setSelectedTabName(name);
//     setSelectedSize(name); // Set selected size
//     const sizeData = selectedColor?.sizes?.find((size) => size.label === name);
//     if (sizeData) {
//       setCurrentPrice(sizeData.price || props?.item?.price);
//       setCurrentStock(sizeData.countInStock || props?.item?.countInStock);
//     }
//   };

//   const handleColorClick = (variation, index) => {
//     setSelectedColor(variation);
//     setSelectedSize(null); // Reset size selection
//     setProductActionIndex(null); // Reset tab index
//     setSelectedTabName(null); // Reset tab name
//     setCurrentPrice(props?.item?.price); // Reset price
//     setCurrentStock(props?.item?.countInStock); // Reset stock
//     // Update images in parent component
//     props.setImages(variation?.color?.images || props?.item?.images || []);
//   };

//   useEffect(() => {
//     const item = context?.cartData?.filter((cartItem) =>
//       cartItem.productId.includes(props?.item?._id)
//     );

//     if (item?.length !== 0) {
//       setIsAdded(true);
//     } else {
//       setIsAdded(false);
//     }
//   }, [isAdded, context?.cartData, props?.item?._id]);

//   useEffect(() => {
//     const myListItem = context?.myListData?.filter((item) =>
//       item.productId.includes(props?.item?._id)
//     );

//     if (myListItem?.length !== 0) {
//       setIsAddedInMyList(true);
//     } else {
//       setIsAddedInMyList(false);
//     }
//   }, [context?.myListData, props?.item?._id]);

//   // Set default color and images on initial load
//   useEffect(() => {
//     if (props?.item?.variation?.length > 0) {
//       const defaultVariation = props?.item?.variation[0];
//       setSelectedColor(defaultVariation);
//       props.setImages(
//         defaultVariation?.color?.images || props?.item?.images || []
//       );
//     }
//   }, [props?.item?.variation, props?.item?.images]);

//   const addToCart = (product, userId, quantity) => {
//     const productItem = {
//       _id: product?._id,
//       name: product?.name,
//       image: selectedColor?.color?.images?.[0] || product?.images?.[0] || "",
//       rating: product?.rating,
//       price: currentPrice, // Use dynamic price
//       oldPrice: product?.oldPrice,
//       discount: product?.discount,
//       quantity: quantity,
//       subTotal: parseInt(currentPrice * quantity),
//       productId: product?._id,
//       countInStock: currentStock, // Use dynamic stock
//       brand: product?.brand,
//       size: selectedTabName || "",
//       weight: "",
//       ram: "",
//       barcode: product?.barcode,
//       vendorId: product?.vendorId,
//       selectedColor: selectedColor?.color?.label || "", // Add selected color label
//     };

//     if (props?.item?.variation?.length !== 0) {
//       if (selectedTabName !== null) {
//         setIsLoading(true);
//         context?.alertBox("success", "Item added");
//         context?.addToCart(productItem, userId, quantity);
//         context?.getCartItems();
//         setTimeout(() => {
//           setIsLoading(false);
//           setIsAdded(true);
//         }, 500);
//       } else {
//         setTabError(true);
//         context?.alertBox("error", "Please select a size");
//       }
//     } else {
//       setIsLoading(true);
//       context?.alertBox("success", "Item added");
//       context?.addToCart(productItem, userId, quantity);
//       context?.getCartItems();
//       setTimeout(() => {
//         setIsLoading(false);
//         setIsAdded(true);
//       }, 500);
//     }
//   };

//   const handleAddToMyList = (item) => {
//     if (context?.userData === null) {
//       context?.alertBox("error", "You are not logged in, please log in first");
//       return false;
//     } else {
//       const obj = {
//         productId: item?._id,
//         userId: context?.userData?._id,
//         productTitle: item?.name,
//         image: item?.images[0],
//         rating: item?.rating,
//         price: currentPrice, // Use dynamic price
//         oldPrice: item?.oldPrice,
//         brand: item?.brand,
//         barcode: item?.barcode,
//         vendorId: item?.vendorId,
//         discount: item?.discount,
//       };

//       postData("/api/myList/add", obj).then((res) => {
//         if (res?.error === false) {
//           context?.alertBox("success", res?.message);
//           setIsAddedInMyList(true);
//           context?.getMyListData();
//         } else {
//           context?.alertBox("error", res?.message);
//         }
//       });
//     }
//   };

//   return (
//     <>
//       <h1 className="text-[18px] sm:text-[22px] font-[600] mb-2">
//         {locale === "ar" ? props?.item?.arbName : props?.item?.name}
//       </h1>
//       <div className="flex items-start sm:items-center lg:items-center flex-col sm:flex-row md:flex-row lg:flex-row gap-3 justify-start">
//         <span className="text-gray-400 text-[13px]">
//           Brands :{" "}
//           <span className="font-[500] text-black opacity-75">
//             {props?.item?.brand}
//           </span>
//         </span>

//         <Rating
//           name="size-small"
//           value={props?.item?.rating}
//           size="small"
//           readOnly
//         />
//         <span
//           className="text-[13px] cursor-pointer"
//           onClick={props.gotoReviews}
//         >
//           {t("product.review")} ({props.reviewsCount})
//         </span>
//       </div>

//       <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row items-start sm:items-center gap-4 mt-4">
//         <div className="flex items-center gap-4">
//           <span className="oldPrice line-through text-gray-500 text-[20px] font-[500]">
//             ${props?.item?.oldPrice}
//           </span>
//           <span className="price text-primary text-[20px] font-[600]">
//             ${currentPrice} {/* Display dynamic price */}
//           </span>
//         </div>

//         <div className="flex items-center gap-4">
//           <span className="text-[14px]">
//             {t("product.availableInStock")}:{" "}
//             <span className="text-green-600 text-[14px] font-bold">
//               {currentStock} {t("product.items")} {/* Display dynamic stock */}
//             </span>
//           </span>
//         </div>
//       </div>

//       <p className="mt-3 pr-10 mb-5">
//         {locale === "ar"
//           ? props?.item?.arbDescription
//           : props?.item?.description}
//       </p>

//       {/* Color Palette */}
//       {props?.item?.variation?.length !== 0 && (
//         <div className="flex items-center gap-3 mb-4">
//           <span className="text-[16px]">COLOR:</span>
//           <div className="flex items-center gap-2">
//             {props?.item?.variation?.map((variation, index) => {
//               const colorLabel = variation?.color?.label?.toLowerCase();
//               return (
//                 <button
//                   key={index}
//                   className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
//                     selectedColor?.color?.label === variation?.color?.label
//                       ? "border-black scale-110"
//                       : "border-gray-300"
//                   }`}
//                   style={{ backgroundColor: colorLabel }}
//                   onClick={() => handleColorClick(variation, index)}
//                   title={variation?.color?.label}
//                 />
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Size Selection */}
//       {selectedColor && selectedColor?.sizes?.length > 0 && (
//         <div className="flex items-center gap-3 mb-4">
//           <span className="text-[16px]">SIZE:</span>
//           <div className="flex items-center gap-1 actions">
//             {selectedColor?.sizes?.map((size, index) => (
//               <Button
//                 key={index}
//                 className={`${
//                   productActionIndex === index ? "!bg-primary !text-white" : ""
//                 } ${tabError === true && "error"}`}
//                 onClick={() => handleClickActiveTab(index, size.label)}
//               >
//                 {size.label}
//               </Button>
//             ))}
//           </div>
//         </div>
//       )}

//       <p className="text-[14px] mt-5 mb-2 text-[#000]">
//         {t("product.freeShipping")}
//       </p>
//       <div className="flex items-center gap-4 py-4">
//         <div className="qtyBoxWrapper w-[70px]">
//           <QtyBox handleSelecteQty={handleSelecteQty} />
//         </div>

//         <Button
//           className="btn-org flex gap-2 !min-w-[150px]"
//           onClick={() =>
//             addToCart(props?.item, context?.userData?._id, quantity)
//           }
//         >
//           {isLoading === true ? (
//             <CircularProgress />
//           ) : (
//             <>
//               {isAdded === true ? (
//                 <>
//                   <FaCheckDouble /> Added
//                 </>
//               ) : (
//                 <>
//                   <MdOutlineShoppingCart className="text-[22px]" />
//                   {t("product.addToCart")}
//                 </>
//               )}
//             </>
//           )}
//         </Button>
//       </div>

//       <div className="flex items-center gap-4 mt-4">
//         <span
//           className="flex items-center gap-2 text-[14px] sm:text-[15px] link cursor-pointer font-[500]"
//           onClick={() => handleAddToMyList(props?.item)}
//         >
//           {isAddedInMyList === true ? (
//             <IoMdHeart className="text-[18px] !text-primary group-hover:text-white hover:!text-white" />
//           ) : (
//             <FaRegHeart className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
//           )}
//           {t("product.addToWishlist")}
//         </span>

//         <span className="flex items-center gap-2 text-[14px] sm:text-[15px] link cursor-pointer font-[500]">
//           <IoGitCompareOutline className="text-[18px]" />{" "}
//           {t("product.addToCompare")}
//         </span>
//       </div>
//     </>
//   );
// };

"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import { QtyBox } from "../QtyBox";
import Rating from "@mui/material/Rating";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import { MyContext } from "@/context/ThemeProvider";
import { CircularProgress } from "@mui/material";
import { postData } from "@/utils/api";
import { FaCheckDouble } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/utils/useTranslation";

export const ProductDetailsComponent = (props) => {
  const [productActionIndex, setProductActionIndex] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedTabName, setSelectedTabName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tabError, setTabError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isAddedInMyList, setIsAddedInMyList] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(props?.item?.price);
  const [currentStock, setCurrentStock] = useState(props?.item?.countInStock);
  const initialLoadRef = useRef(false); // Track initial load to prevent multiple updates

  const context = useContext(MyContext);
  const { locale } = useLanguage();
  const { t } = useTranslation();

  const handleSelecteQty = (qty) => {
    setQuantity(qty);
  };

  const handleClickActiveTab = (index, name) => {
    setProductActionIndex(index);
    setSelectedTabName(name);
    setSelectedSize(name);
    const sizeData = selectedColor?.sizes?.find((size) => size.label === name);
    if (sizeData) {
      setCurrentPrice(sizeData.price || props?.item?.price);
      setCurrentStock(sizeData.countInStock || props?.item?.countInStock);
    }
  };

  const handleColorClick = (variation, index) => {
    setSelectedColor(variation);
    setSelectedSize(null);
    setProductActionIndex(null);
    setSelectedTabName(null);
    setCurrentPrice(props?.item?.price);
    setCurrentStock(props?.item?.countInStock);
    props.setImages(variation?.color?.images || props?.item?.images || []);
  };

  useEffect(() => {
    if (!initialLoadRef.current && props?.item?.variation?.length > 0) {
      const defaultVariation = props?.item?.variation[0];
      setSelectedColor(defaultVariation);
      props.setImages(
        defaultVariation?.color?.images || props?.item?.images || []
      );
      initialLoadRef.current = true;
    }
  }, [props?.item?.variation, props?.item?.images, props.setImages]);

  useEffect(() => {
    const item = context?.cartData?.filter((cartItem) =>
      cartItem.productId.includes(props?.item?._id)
    );
    setIsAdded(item?.length !== 0);
  }, [context?.cartData, props?.item?._id]);

  useEffect(() => {
    const myListItem = context?.myListData?.filter((item) =>
      item.productId.includes(props?.item?._id)
    );
    setIsAddedInMyList(myListItem?.length !== 0);
  }, [context?.myListData, props?.item?._id]);

  const addToCart = (product, userId, quantity) => {
    const discountPercentage =
      product?.oldPrice && currentPrice
        ? Math.round(
            ((product.oldPrice - currentPrice) / product.oldPrice) * 100
          )
        : 0;

    const productItem = {
      _id: product?._id,
      name: product?.name,
      image: selectedColor?.color?.images?.[0] || product?.images?.[0] || "",
      rating: product?.rating,
      price: currentPrice,
      oldPrice: product?.oldPrice,
      discount: discountPercentage,
      quantity: quantity,
      subTotal: parseInt(currentPrice * quantity),
      productId: product?._id,
      countInStock: currentStock,
      brand: product?.brand,
      size: selectedTabName || "",
      barcode: product?.barcode,
      vendorId: product?.vendorId,
      selectedColor: selectedColor?.color?.label || "",
    };

    if (props?.item?.variation?.length !== 0) {
      if (selectedTabName !== null) {
        setIsLoading(true);
        context?.alertBox("success", "Item added");
        context?.addToCart(productItem, userId, quantity);
        context?.getCartItems();
        setTimeout(() => {
          setIsLoading(false);
          setIsAdded(true);
        }, 500);
      } else {
        setTabError(true);
        context?.alertBox("error", "Please select a size");
      }
    } else {
      setIsLoading(true);
      context?.alertBox("success", "Item added");
      context?.addToCart(productItem, userId, quantity);
      context?.getCartItems();
      setTimeout(() => {
        setIsLoading(false);
        setIsAdded(true);
      }, 500);
    }
  };

  const handleAddToMyList = (item) => {
    if (context?.userData === null) {
      context?.alertBox("error", "You are not logged in, please log in first");
      return false;
    } else {
      const obj = {
        productId: item?._id,
        userId: context?.userData?._id,
        productTitle: item?.name,
        image: item?.images[0],
        rating: item?.rating,
        price: currentPrice,
        oldPrice: item?.oldPrice,
        brand: item?.brand,
        barcode: item?.barcode,
        vendorId: item?.vendorId,
        discount: item?.discount,
      };

      postData("/api/myList/add", obj).then((res) => {
        if (res?.error === false) {
          context?.alertBox("success", res?.message);
          setIsAddedInMyList(true);
          context?.getMyListData();
        } else {
          context?.alertBox("error", res?.message);
        }
      });
    }
  };

  return (
    <>
      <h1 className="text-[18px] sm:text-[22px] font-[600] mb-2">
        {locale === "ar" ? props?.item?.arbName : props?.item?.name}
      </h1>
      <div className="flex items-start sm:items-center lg:items-center flex-col sm:flex-row md:flex-row lg:flex-row gap-3 justify-start">
        <span className="text-gray-400 text-[13px]">
          Brands :{" "}
          <span className="font-[500] text-black opacity-75">
            {props?.item?.brand}
          </span>
        </span>

        <Rating
          name="size-small"
          value={props?.item?.rating}
          size="small"
          readOnly
        />
        <span
          className="text-[13px] cursor-pointer"
          onClick={props.gotoReviews}
        >
          {t("product.review")} ({props.reviewsCount})
        </span>
      </div>

      <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row items-start sm:items-center gap-4 mt-4">
        <div className="flex items-center gap-4">
          <span className="oldPrice line-through text-gray-500 text-[20px] font-[500]">
            ${props?.item?.oldPrice}
          </span>
          <span className="price text-primary text-[20px] font-[600]">
            ${currentPrice}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[14px]">
            {t("product.availableInStock")}:{" "}
            <span className="text-green-600 text-[14px] font-bold">
              {currentStock} {t("product.items")}
            </span>
          </span>
        </div>
      </div>

      <p className="mt-3 pr-10 mb-5">
        {locale === "ar"
          ? props?.item?.arbDescription
          : props?.item?.description}
      </p>

      {/* Color Palette */}
      {props?.item?.variation?.length !== 0 && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[16px]">COLOR:</span>
          <div className="flex items-center gap-2">
            {props?.item?.variation?.map((variation, index) => {
              const colorLabel = variation?.color?.label?.toLowerCase();
              return (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    selectedColor?.color?.label === variation?.color?.label
                      ? "border-black scale-110"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: colorLabel }}
                  onClick={() => handleColorClick(variation, index)}
                  title={variation?.color?.label}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {selectedColor && selectedColor?.sizes?.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[16px]">SIZE:</span>
          <div className="flex items-center gap-1 actions">
            {selectedColor?.sizes?.map((size, index) => (
              <Button
                key={index}
                className={`${
                  productActionIndex === index ? "!bg-primary !text-white" : ""
                } ${tabError === true && "error"}`}
                onClick={() => handleClickActiveTab(index, size.label)}
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <p className="text-[14px] mt-5 mb-2 text-[#000]">
        {t("product.freeShipping")}
      </p>
      <div className="flex items-center gap-4 py-4">
        <div className="qtyBoxWrapper w-[70px]">
          <QtyBox handleSelecteQty={handleSelecteQty} />
        </div>

        <Button
          className="btn-org flex gap-2 !min-w-[150px]"
          onClick={() =>
            addToCart(props?.item, context?.userData?._id, quantity)
          }
        >
          {isLoading === true ? (
            <CircularProgress />
          ) : (
            <>
              {isAdded === true ? (
                <>
                  <FaCheckDouble /> Added
                </>
              ) : (
                <>
                  <MdOutlineShoppingCart className="text-[22px]" />
                  {t("product.addToCart")}
                </>
              )}
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <span
          className="flex items-center gap-2 text-[14px] sm:text-[15px] link cursor-pointer font-[500]"
          onClick={() => handleAddToMyList(props?.item)}
        >
          {isAddedInMyList === true ? (
            <IoMdHeart className="text-[18px] !text-primary group-hover:text-white hover:!text-white" />
          ) : (
            <FaRegHeart className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
          )}
          {t("product.addToWishlist")}
        </span>

        <span className="flex items-center gap-2 text-[14px] sm:text-[15px] link cursor-pointer font-[500]">
          <IoGitCompareOutline className="text-[18px]" />{" "}
          {t("product.addToCompare")}
        </span>
      </div>
    </>
  );
};
