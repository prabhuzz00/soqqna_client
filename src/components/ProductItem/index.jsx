// import React, { useContext, useEffect, useRef, useState } from "react";
// import "../ProductItem/style.css";
// import Rating from "@mui/material/Rating";
// import Button from "@mui/material/Button";
// import { FaRegHeart } from "react-icons/fa";
// import { IoGitCompareOutline } from "react-icons/io5";
// import { MdZoomOutMap } from "react-icons/md";
// import { MdOutlineShoppingCart } from "react-icons/md";
// import { FaMinus } from "react-icons/fa6";
// import { FaPlus } from "react-icons/fa6";
// import CircularProgress from "@mui/material/CircularProgress";
// import { MdClose } from "react-icons/md";
// import { IoMdHeart } from "react-icons/io";
// import { MyContext } from "@/context/ThemeProvider";
// import Link from "next/link";
// import Image from "next/image";
// import { deleteData, editData, postData } from "@/utils/api";
// import { useLanguage } from "@/context/LanguageContext";
// import { useTranslation } from "@/utils/useTranslation";
// import Cookies from "js-cookie";

// const ProductItem = (props) => {
//   const [quantity, setQuantity] = useState(1);
//   const [isAdded, setIsAdded] = useState(false);
//   const [isAddedInMyList, setIsAddedInMyList] = useState(false);
//   const [cartItem, setCartItem] = useState([]);

//   const [activeTab, setActiveTab] = useState(null);
//   const [isShowTabs, setIsShowTabs] = useState(false);
//   const [selectedTabName, setSelectedTabName] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const [images, setImages] = useState([]); // Add images state

//   const context = useContext(MyContext);
//   const { locale } = useLanguage();
//   const { t } = useTranslation();
//   const isUpdatingRef = useRef(false); // Track if we're already updating

//   // Initialize images state with product images or first variation's images
//   useEffect(() => {
//     const initialImages =
//       props?.item?.variation?.length > 0
//         ? props?.item?.variation[0]?.color?.images || props?.item?.images
//         : props?.item?.images;
//     setImages(initialImages || []);
//   }, [props?.item?.images, props?.item?.variation]);

//   // Update context when images change, but only for the currently open product
//   useEffect(() => {
//     if (
//       context?.openProductDetailsModal?.open &&
//       context?.openProductDetailsModal?.productId === props?.item?._id &&
//       !isUpdatingRef.current
//     ) {
//       isUpdatingRef.current = true; // Prevent further updates in this cycle
//       context.handleOpenProductDetailsModal(true, props?.item, {
//         images,
//         setImages,
//       });
//       isUpdatingRef.current = false; // Reset after update
//     }
//   }, [
//     images,
//     props?.item?._id,
//     context.openProductDetailsModal?.open,
//     context.openProductDetailsModal?.productId,
//     context.handleOpenProductDetailsModal,
//   ]);

//   const addToCart = (product, userId, quantity) => {
//     const productItem = {
//       _id: product?._id,
//       name: product?.name,
//       arName: product?.arbName,
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
//     };

//     setIsLoading(true);

//     if (
//       props?.item?.size?.length !== 0 ||
//       props?.item?.productRam?.length !== 0 ||
//       props?.item?.productWeight?.length !== 0
//     ) {
//       setIsShowTabs(true);
//     } else {
//       setIsAdded(true);

//       setIsShowTabs(false);
//       setTimeout(() => {
//         setIsLoading(false);
//       }, 500);
//       context?.addToCart(productItem, userId, quantity);
//     }

//     if (activeTab !== null) {
//       context?.addToCart(productItem, userId, quantity);
//       setIsAdded(true);
//       setIsShowTabs(false);
//       setTimeout(() => {
//         setIsLoading(false);
//       }, 500);
//     }
//   };

//   const handleClickActiveTab = (index, name) => {
//     setActiveTab(index);
//     setSelectedTabName(name);
//   };

//   useEffect(() => {
//     const item = context?.cartData?.filter((cartItem) =>
//       cartItem.productId.includes(props?.item?._id)
//     );

//     const myListItem = context?.myListData?.filter((item) =>
//       item.productId.includes(props?.item?._id)
//     );

//     if (item?.length !== 0) {
//       setCartItem(item);
//       setIsAdded(true);
//       setQuantity(item[0]?.quantity);
//     } else {
//       setIsAdded(false);
//       setQuantity(1);
//     }

//     if (myListItem?.length !== 0) {
//       setIsAddedInMyList(true);
//     } else {
//       setIsAddedInMyList(false);
//     }
//   }, [context?.cartData]);

//   const minusQty = () => {
//     if (quantity !== 1 && quantity > 1) {
//       setQuantity(quantity - 1);
//     } else {
//       setQuantity(1);
//     }

//     if (quantity === 1) {
//       const cart = context?.cartData?.filter(
//         (item) => item._id !== cartItem[0]?._id
//       );
//       Cookies.set("cart", JSON.stringify(cart));
//       context?.getCartItems();
//       setIsAdded(false);
//       context.alertBox("success", "Item Removed ");
//       setIsShowTabs(false);
//       setActiveTab(null);
//     } else {
//       context?.updateCartItemQuantity(cartItem[0]?._id, quantity - 1);
//     }
//     context?.getCartItems();
//   };

//   const addQty = () => {
//     setQuantity(quantity + 1);

//     // const obj = {
//     //   _id: cartItem[0]?._id,
//     //   qty: quantity + 1,
//     //   subTotal: props?.item?.price * (quantity + 1),
//     // };

//     // editData(`/api/cart/update-qty`, obj).then((res) => {
//     //   context.alertBox("success", res?.data?.message);
//     //   context?.getCartItems();
//     // });

//     context?.updateCartItemQuantity(cartItem[0]?._id, quantity + 1);
//     context?.getCartItems();
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
//     <div className="productItem shadow-lg rounded-md overflow-hidden border-1 border-[rgba(0,0,0,0.1)]">
//       <div className="group imgWrapper w-[100%]  overflow-hidden  rounded-md rounded-bl-none rounded-br-none relative">
//         <Link href={`/product/${props?.item?._id}`}>
//           <div className="img h-[200px] overflow-hidden">
//             <Image
//               src={props?.item?.images[0]}
//               className="w-full"
//               alt="image"
//               width={400}
//               height={300}
//             />

//             {props?.item?.images?.length > 1 && (
//               <Image
//                 alt="image"
//                 src={props?.item?.images[1]}
//                 className="w-full transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-105"
//                 width={400}
//                 height={300}
//               />
//             )}
//           </div>
//         </Link>

//         {isShowTabs === true && (
//           <div
//             className="flex items-center justify-center absolute top-0 left-0 w-full h-full
//       bg-[rgba(0,0,0,0.7)] z-[60] p-3 gap-2"
//           >
//             <Button
//               className="!absolute top-[10px] right-[10px] !min-w-[30px] !min-h-[30px] !w-[30px] !h-[30px] !rounded-full !bg-[rgba(255,255,255,1)] text-black"
//               onClick={() => setIsShowTabs(false)}
//             >
//               {" "}
//               <MdClose className=" text-black z-[90] text-[25px]" />
//             </Button>

//             {props?.item?.size?.length !== 0 &&
//               props?.item?.size?.map((item, index) => {
//                 return (
//                   <span
//                     key={index}
//                     className={`flex items-center justify-center p-1 px-2 bg-[rgba(255,555,255,0.8)] max-w-[35px] h-[25px]
//           rounded-sm cursor-pointer hover:bg-white
//           ${activeTab === index && "!bg-primary text-white"}`}
//                     onClick={() => handleClickActiveTab(index, item)}
//                   >
//                     {item}
//                   </span>
//                 );
//               })}

//             {props?.item?.productRam?.length !== 0 &&
//               props?.item?.productRam?.map((item, index) => {
//                 return (
//                   <span
//                     key={index}
//                     className={`flex items-center justify-center p-1 px-2 bg-[rgba(255,555,255,0.8)] max-w-[45px] h-[25px]
//           rounded-sm cursor-pointer hover:bg-white
//           ${activeTab === index && "!bg-primary text-white"}`}
//                     onClick={() => handleClickActiveTab(index, item)}
//                   >
//                     {item}
//                   </span>
//                 );
//               })}

//             {props?.item?.productWeight?.length !== 0 &&
//               props?.item?.productWeight?.map((item, index) => {
//                 return (
//                   <span
//                     key={index}
//                     className={`flex items-center justify-center p-1 px-2 bg-[rgba(255,555,255,0.8)] max-w-[35px] h-[25px]
//           rounded-sm cursor-pointer hover:bg-white
//           ${activeTab === index && "!bg-primary text-white"}`}
//                     onClick={() => handleClickActiveTab(index, item)}
//                   >
//                     {item}
//                   </span>
//                 );
//               })}
//           </div>
//         )}

//         <span className="discount flex items-center absolute top-[10px] left-[10px] z-50 bg-primary text-white rounded-lg p-1 text-[12px] font-[500]">
//           {props?.item?.discount}%
//         </span>

//         <div className="actions absolute top-[-20px] right-[5px] z-50 flex items-center gap-2 flex-col w-[50px] transition-all duration-300 group-hover:top-[15px] opacity-0 group-hover:opacity-100">
//           {context?.windowWidth > 992 && (
//             <Button
//               className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white  text-black hover:!bg-primary hover:text-white group"
//               onClick={() =>
//                 context.handleOpenProductDetailsModal(true, props?.item, {
//                   images,
//                   setImages,
//                 })
//               }
//             >
//               <MdZoomOutMap className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
//             </Button>
//           )}

//           <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white  text-black hover:!bg-primary hover:text-white group">
//             <IoGitCompareOutline className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
//           </Button>

//           <Button
//             className={`!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white  text-black hover:!bg-primary hover:text-white group`}
//             onClick={() => handleAddToMyList(props?.item)}
//           >
//             {isAddedInMyList === true ? (
//               <IoMdHeart className="text-[18px] !text-primary group-hover:text-white hover:!text-white" />
//             ) : (
//               <FaRegHeart className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
//             )}
//           </Button>
//         </div>
//       </div>

//       <div className="info p-3 py-5 relative pb-[50px] h-[190px]">
//         <h6 className="text-[13px] !font-[400]">
//           <span className="link transition-all">{props?.item?.brand}</span>
//         </h6>
//         <h3 className="text-[12px] lg:text-[13px] title mt-1 font-[500] mb-1 text-[#000]">
//           <Link
//             href={`/product/${props?.item?._id}`}
//             className="link transition-all"
//           >
//             {locale === "ar"
//               ? props?.item?.arbName?.substr(0, 25) + "..."
//               : props?.item?.name?.substr(0, 25) + "..."}
//           </Link>
//         </h3>

//         <Rating
//           name="size-small"
//           defaultValue={props?.item?.rating}
//           size="small"
//           readOnly
//         />

//         <div className="flex items-center gap-4 justify-between">
//           <span className="oldPrice line-through text-gray-500 text-[12px] lg:text-[14px] font-[500]">
//             {props?.item?.oldPrice?.toLocaleString("en-US", {
//               style: "currency",
//               currency: "USD",
//             })}
//           </span>
//           <span className="price text-primary text-[12px] lg:text-[14px]  font-[600]">
//             {props?.item?.price?.toLocaleString("en-US", {
//               style: "currency",
//               currency: "USD",
//             })}
//           </span>
//         </div>

//         <div className="!absolute bottom-[15px] left-0 pl-3 pr-3 w-full">
//           {isAdded === false ? (
//             <Button
//               className="btn-org addToCartBtn btn-border flex w-full btn-sm gap-2 "
//               size="small"
//               onClick={() =>
//                 addToCart(props?.item, context?.userData?._id, quantity)
//               }
//             >
//               <MdOutlineShoppingCart className="text-[18px]" />{" "}
//               {t("home.addToCart")}
//             </Button>
//           ) : (
//             <>
//               {isLoading === true ? (
//                 <Button
//                   className="addtocart btn-org btn-border flex w-full btn-sm gap-2 "
//                   size="small"
//                 >
//                   <CircularProgress />
//                 </Button>
//               ) : (
//                 <div className="flex items-center justify-between overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)]">
//                   <Button
//                     className="!min-w-[35px] !w-[35px] !h-[30px] !bg-[#f1f1f1]  !rounded-none"
//                     onClick={minusQty}
//                   >
//                     <FaMinus className="text-[rgba(0,0,0,0.7)]" />
//                   </Button>
//                   <span>{quantity}</span>
//                   <Button
//                     className="!min-w-[35px] !w-[35px] !h-[30px] !bg-gray-800 !rounded-none"
//                     onClick={addQty}
//                   >
//                     <FaPlus className="text-white" />
//                   </Button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductItem;
import React, { useContext, useEffect, useRef, useState } from "react";
import "../ProductItem/style.css";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import { MdZoomOutMap } from "react-icons/md";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import CircularProgress from "@mui/material/CircularProgress";
import { MdClose } from "react-icons/md";
import { IoMdHeart } from "react-icons/io";
import { MyContext } from "@/context/ThemeProvider";
import Link from "next/link";
import Image from "next/image";
import { deleteData, editData, postData } from "@/utils/api";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/utils/useTranslation";
import Cookies from "js-cookie";

const ProductItem = (props) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isAddedInMyList, setIsAddedInMyList] = useState(false);
  const [cartItem, setCartItem] = useState([]);
  const [isShowTabs, setIsShowTabs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(props?.item?.price);
  const [currentStock, setCurrentStock] = useState(props?.item?.countInStock);

  const context = useContext(MyContext);
  const { locale } = useLanguage();
  const { t } = useTranslation();
  const isUpdatingRef = useRef(false);

  // Initialize images, color, price, and stock
  useEffect(() => {
    const initialImages =
      props?.item?.variation?.length > 0
        ? props?.item?.variation[0]?.color?.images || props?.item?.images
        : props?.item?.images;
    setImages(initialImages || []);

    if (props?.item?.variation?.length > 0) {
      const defaultVariation = props?.item?.variation[0];
      setSelectedColor(defaultVariation);
      setCurrentPrice(props?.item?.price);
      setCurrentStock(props?.item?.countInStock);
    }
  }, [
    props?.item?.images,
    props?.item?.variation,
    props?.item?.price,
    props?.item?.countInStock,
  ]);

  // Update context for modal
  useEffect(() => {
    if (
      context?.openProductDetailsModal?.open &&
      context?.openProductDetailsModal?.productId === props?.item?._id &&
      !isUpdatingRef.current
    ) {
      isUpdatingRef.current = true;
      context.handleOpenProductDetailsModal(true, props?.item, {
        images,
        setImages,
      });
      isUpdatingRef.current = false;
    }
  }, [
    images,
    props?.item?._id,
    context.openProductDetailsModal?.open,
    context.openProductDetailsModal?.productId,
    context.handleOpenProductDetailsModal,
  ]);

  // Check cart and myList status
  useEffect(() => {
    const item = context?.cartData?.filter((cartItem) =>
      cartItem.productId.includes(props?.item?._id)
    );

    const myListItem = context?.myListData?.filter((item) =>
      item.productId.includes(props?.item?._id)
    );

    if (item?.length !== 0) {
      setCartItem(item);
      setIsAdded(true);
      setQuantity(item[0]?.quantity);
      // Optionally, restore selectedColor and selectedSize from cartItem if stored
      if (item[0]?.selectedColor) {
        const variation = props?.item?.variation?.find(
          (v) => v.color.label === item[0].selectedColor
        );
        if (variation) {
          setSelectedColor(variation);
          setImages(variation?.color?.images || props?.item?.images || []);
          const sizeData = variation?.sizes?.find(
            (s) => s.label === item[0].size
          );
          if (sizeData) {
            setSelectedSize(item[0].size);
            setCurrentPrice(sizeData.price || props?.item?.price);
            setCurrentStock(sizeData.countInStock || props?.item?.countInStock);
          }
        }
      }
    } else {
      setIsAdded(false);
      setQuantity(1);
      // Reset selections when item is not in cart
      if (props?.item?.variation?.length > 0) {
        const defaultVariation = props?.item?.variation[0];
        setSelectedColor(defaultVariation);
        setSelectedSize(null);
        setImages(defaultVariation?.color?.images || props?.item?.images || []);
        setCurrentPrice(props?.item?.price);
        setCurrentStock(props?.item?.countInStock);
      }
    }

    if (myListItem?.length !== 0) {
      setIsAddedInMyList(true);
    } else {
      setIsAddedInMyList(false);
    }
  }, [
    context?.cartData,
    context?.myListData,
    props?.item?._id,
    props?.item?.variation,
    props?.item?.images,
    props?.item?.price,
    props?.item?.countInStock,
  ]);

  // Handle color selection
  const handleColorClick = (variation) => {
    setSelectedColor(variation);
    setSelectedSize(null); // Reset size selection
    setCurrentPrice(props?.item?.price);
    setCurrentStock(props?.item?.countInStock);
    setImages(variation?.color?.images || props?.item?.images || []);
  };

  // Handle size selection
  const handleSizeClick = (sizeLabel) => {
    setSelectedSize(sizeLabel);
    const sizeData = selectedColor?.sizes?.find(
      (size) => size.label === sizeLabel
    );
    if (sizeData) {
      setCurrentPrice(sizeData.price || props?.item?.price);
      setCurrentStock(sizeData.countInStock || props?.item?.countInStock);
    }
  };

  // Add to cart function
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
      arName: product?.arbName,
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
      size: selectedSize || "",
      weight: "",
      ram: "",
      barcode: product?.barcode,
      vendorId: product?.vendorId,
      selectedColor: selectedColor?.color?.label || "",
    };

    setIsLoading(true);

    if (props?.item?.variation?.length > 0) {
      if (!selectedColor || !selectedSize) {
        setIsShowTabs(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } else {
        context?.addToCart(productItem, userId, quantity);
        context?.getCartItems();
        setIsAdded(true);
        setIsShowTabs(false);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    } else {
      setIsAdded(true);
      setIsShowTabs(false);
      context?.addToCart(productItem, userId, quantity);
      context?.getCartItems();
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const minusQty = () => {
    if (quantity !== 1 && quantity > 1) {
      setQuantity(quantity - 1);
      context?.updateCartItemQuantity(cartItem[0]?._id, quantity - 1);
      context?.getCartItems();
    } else {
      setQuantity(1);
      const cart = context?.cartData?.filter(
        (item) => item._id !== cartItem[0]?._id
      );
      Cookies.set("cart", JSON.stringify(cart));
      context?.getCartItems();
      setIsAdded(false);
      context.alertBox("success", "Item Removed");
      setIsShowTabs(false);
      // Reset selections when item is removed
      if (props?.item?.variation?.length > 0) {
        const defaultVariation = props?.item?.variation[0];
        setSelectedColor(defaultVariation);
        setSelectedSize(null);
        setImages(defaultVariation?.color?.images || props?.item?.images || []);
        setCurrentPrice(props?.item?.price);
        setCurrentStock(props?.item?.countInStock);
      } else {
        setSelectedColor(null);
        setSelectedSize(null);
        setImages(props?.item?.images || []);
        setCurrentPrice(props?.item?.price);
        setCurrentStock(props?.item?.countInStock);
      }
    }
  };

  const addQty = () => {
    setQuantity(quantity + 1);
    context?.updateCartItemQuantity(cartItem[0]?._id, quantity + 1);
    context?.getCartItems();
  };

  const handleAddToMyList = (item) => {
    if (context?.userData === null) {
      context?.alertBox("error", "you are not login please login first");
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
    <div className="productItem shadow-lg rounded-md overflow-hidden border-1 border-[rgba(0,0,0,0.1)]">
      <div className="group imgWrapper w-[100%] overflow-hidden rounded-md rounded-bl-none rounded-br-none relative">
        <Link href={`/product/${props?.item?._id}`}>
          <div className="img h-[200px] overflow-hidden">
            <Image
              src={images[0] || props?.item?.images[0]}
              className="w-full"
              alt="image"
              width={400}
              height={300}
            />
            {images.length > 1 && (
              <Image
                alt="image"
                src={images[1] || props?.item?.images[1]}
                className="w-full transition-all duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                width={400}
                height={300}
              />
            )}
          </div>
        </Link>

        {isShowTabs === true && (
          <div className="flex items-center justify-center absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] z-[60] p-3 gap-2 flex-col">
            <Button
              className="!absolute top-[10px] right-[10px] !min-w-[30px] !min-h-[30px] !w-[30px] !h-[30px] !rounded-full !bg-[rgba(255,255,255,1)] text-black"
              onClick={() => setIsShowTabs(false)}
            >
              <MdClose className="text-black z-[90] text-[25px]" />
            </Button>

            {/* Color Selection */}
            {props?.item?.variation?.length > 0 && (
              <div className="flex items-center gap-2">
                {props?.item?.variation?.map((variation, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      selectedColor?.color?.label === variation?.color?.label
                        ? "border-white scale-110"
                        : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: variation?.color?.label.toLowerCase(),
                    }}
                    onClick={() => handleColorClick(variation)}
                    title={variation?.color?.label}
                  />
                ))}
              </div>
            )}

            {/* Size Selection */}
            {selectedColor && selectedColor?.sizes?.length > 0 && (
              <div className="flex items-center gap-2">
                {selectedColor?.sizes?.map((size, index) => (
                  <span
                    key={index}
                    className={`flex items-center justify-center p-1 px-2 bg-[rgba(255,255,255,0.8)] max-w-[45px] h-[25px] rounded-sm cursor-pointer hover:bg-white ${
                      selectedSize === size.label && "!bg-primary text-white"
                    }`}
                    onClick={() => handleSizeClick(size.label)}
                  >
                    {size.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <span className="discount flex items-center absolute top-[10px] left-[10px] z-50 bg-primary text-white rounded-lg p-1 text-[12px] font-[500]">
          {props?.item?.oldPrice && currentPrice
            ? Math.round(
                ((props?.item?.oldPrice - currentPrice) /
                  props?.item?.oldPrice) *
                  100
              )
            : props?.item?.discount}
          %
        </span>

        <div className="actions absolute top-[-20px] right-[5px] z-50 flex items-center gap-2 flex-col w-[50px] transition-all duration-300 group-hover:top-[15px] opacity-0 group-hover:opacity-100">
          {/* {context?.windowWidth > 992 && (
            <Button
              className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-primary hover:text-white group"
              onClick={() =>
                context.handleOpenProductDetailsModal(true, props?.item, {
                  images,
                  setImages,
                })
              }
            >
              <MdZoomOutMap className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
            </Button>
          )} */}

          {/* <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-primary hover:text-white group">
            <IoGitCompareOutline className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
          </Button> */}

          <Button
            className={`!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white text-black hover:!bg-primary hover:text-white group`}
            onClick={() => handleAddToMyList(props?.item)}
          >
            {isAddedInMyList === true ? (
              <IoMdHeart className="text-[18px] !text-primary group-hover:text-white hover:!text-white" />
            ) : (
              <FaRegHeart className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
            )}
          </Button>
        </div>
      </div>

      <div className="info p-3 py-5 relative pb-[50px] h-[190px]">
        <h6 className="text-[13px] !font-[400]">
          <span className="link transition-all">{props?.item?.brand}</span>
        </h6>
        <h3 className="text-[12px] lg:text-[13px] title mt-1 font-[500] mb-1 text-[#000]">
          <Link
            href={`/product/${props?.item?._id}`}
            className="link transition-all"
          >
            {locale === "ar"
              ? props?.item?.arbName?.substr(0, 25) + "..."
              : props?.item?.name?.substr(0, 25) + "..."}
          </Link>
        </h3>

        <Rating
          name="size-small"
          defaultValue={props?.item?.rating}
          size="small"
          readOnly
        />

        <div className="flex items-center gap-4 justify-between">
          <span className="oldPrice line-through text-gray-500 text-[12px] lg:text-[14px] font-[500]">
            {props?.item?.oldPrice?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
          <span className="price text-primary text-[12px] lg:text-[14px] font-[600]">
            {currentPrice?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>

        <div className="!absolute bottom-[15px] left-0 pl-3 pr-3 w-full">
          {isAdded === false ? (
            <Button
              className="btn-org addToCartBtn btn-border flex w-full btn-sm gap-2"
              size="small"
              onClick={() =>
                addToCart(props?.item, context?.userData?._id, quantity)
              }
            >
              <MdOutlineShoppingCart className="text-[18px]" />{" "}
              {t("home.addToCart")}
            </Button>
          ) : (
            <>
              {isLoading === true ? (
                <Button
                  className="addtocart btn-org btn-border flex w-full btn-sm gap-2"
                  size="small"
                >
                  <CircularProgress />
                </Button>
              ) : (
                <div className="flex items-center justify-between overflow-hidden rounded-full border border-[rgba(0,0,0,0.1)]">
                  <Button
                    className="!min-w-[35px] !w-[35px] !h-[30px] !bg-[#f1f1f1] !rounded-none"
                    onClick={minusQty}
                  >
                    <FaMinus className="text-[rgba(0,0,0,0.7)]" />
                  </Button>
                  <span>{quantity}</span>
                  <Button
                    className="!min-w-[35px] !w-[35px] !h-[30px] !bg-gray-800 !rounded-none"
                    onClick={addQty}
                  >
                    <FaPlus className="text-white" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
