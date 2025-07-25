"use client";
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import CircularProgress from "@mui/material/CircularProgress";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart, FaCheckDouble } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import { QtyBox } from "../QtyBox";
import { MyContext } from "@/context/ThemeProvider";
import { postData } from "@/utils/api";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/utils/useTranslation";
import { useCurrency } from "@/context/CurrencyContext";

export const ProductDetailsComponent = (props) => {
  const { convertPrice, getSymbol } = useCurrency();
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
  const initialLoadRef = useRef(false);

  const context = useContext(MyContext);
  const { locale } = useLanguage();
  const { t } = useTranslation();

  const safeT = useCallback(
    (key, fallback) => {
      const result = t(key);
      return typeof result === "string" ? result : fallback;
    },
    [t]
  );

  const isInCart = useMemo(
    () =>
      context?.cartData?.some((cartItem) =>
        cartItem.productId.includes(props?.item?._id)
      ),
    [context?.cartData, props?.item?._id]
  );
  const isInMyList = useMemo(
    () =>
      context?.myListData?.some((item) =>
        item.productId.includes(props?.item?._id)
      ),
    [context?.myListData, props?.item?._id]
  );

  useEffect(() => {
    setIsAdded(isInCart);
    setIsAddedInMyList(isInMyList);
  }, [isInCart, isInMyList]);

  useEffect(() => {
    if (!initialLoadRef.current && props?.item?.variation?.length > 0) {
      const defaultVariation = props?.item?.variation[0];
      setSelectedColor(defaultVariation);
      props.setImages(
        defaultVariation?.color?.images ||
          props?.item?.images || ["/default-image.jpg"]
      );
      initialLoadRef.current = true;
    }
  }, [props?.item?.variation, props?.item?.images, props.setImages]);

  const handleSelecteQty = useCallback(
    (qty) => {
      if (qty > currentStock) {
        context?.alertBox(
          "error",
          "Requested quantity exceeds available stock"
        );
        return;
      }
      setQuantity(qty);
    },
    [currentStock, context]
  );

  const handleClickActiveTab = useCallback(
    (index, name) => {
      setProductActionIndex(index);
      setSelectedTabName(name);
      setSelectedSize(name);
      const sizeData = selectedColor?.sizes?.find(
        (size) => size.label === name
      );
      if (sizeData) {
        setCurrentPrice(sizeData.price || props?.item?.price);
        setCurrentStock(sizeData.countInStock || props?.item?.countInStock);
      }
      setTabError(false);
    },
    [selectedColor?.sizes, props?.item?.price, props?.item?.countInStock]
  );

  const handleColorClick = useCallback(
    (variation) => {
      setSelectedColor(variation);
      setSelectedSize(null);
      setProductActionIndex(null);
      setSelectedTabName(null);
      setCurrentPrice(props?.item?.price);
      setCurrentStock(props?.item?.countInStock);
      props.setImages(
        variation?.color?.images ||
          props?.item?.images || ["/default-image.jpg"]
      );
    },
    [
      props?.item?.price,
      props?.item?.countInStock,
      props?.item?.images,
      props.setImages,
    ]
  );

  const addToCart = useCallback(
    (product, userId, quantity) => {
      if (quantity > currentStock) {
        context?.alertBox(
          "error",
          "Requested quantity exceeds available stock"
        );
        return;
      }

      const discountPercentage =
        product?.oldPrice && currentPrice
          ? Math.round(
              ((product.oldPrice - currentPrice) / product.oldPrice) * 100
            )
          : 0;

      const productItem = {
        _id: product?._id,
        name: product?.name,
        image:
          selectedColor?.color?.images?.[0] ||
          product?.images?.[0] ||
          "/default-image.jpg",
        rating: product?.rating,
        price: currentPrice,
        oldPrice: product?.oldPrice,
        discount: discountPercentage,
        quantity,
        subTotal: parseInt(currentPrice * quantity),
        productId: product?._id,
        countInStock: currentStock,
        brand: product?.brand,
        size: selectedTabName || "",
        barcode: product?.barcode,
        vendorId: product?.vendorId,
        isReturn: product?.isReturn,
        servicezone: product?.serviceZone,
        selectedColor: selectedColor?.color?.label || "",
      };

      if (product?.variation?.length > 0 && !selectedTabName) {
        setTabError(true);
        context?.alertBox("error", "Please select a size");
        return;
      }

      setIsLoading(true);
      context?.alertBox("success", "Item added");
      context?.addToCart(productItem, userId, quantity);
      context?.getCartItems();
      setTimeout(() => {
        setIsLoading(false);
        setIsAdded(true);
      }, 500);
    },
    [currentPrice, currentStock, selectedColor, selectedTabName, context]
  );

  const handleAddToMyList = useCallback(
    async (item) => {
      if (!context?.userData) {
        context?.alertBox(
          "error",
          "You are not logged in, please log in first"
        );
        return;
      }

      setIsLoading(true);
      const obj = {
        productId: item?._id,
        userId: context?.userData?._id,
        productTitle: item?.name,
        image: item?.images?.[0] || "/default-image.jpg",
        rating: item?.rating,
        price: currentPrice,
        oldPrice: item?.oldPrice,
        brand: item?.brand,
        barcode: item?.barcode,
        vendorId: item?.vendorId,
        discount: item?.discount,
      };

      try {
        const res = await postData("/api/myList/add", obj);
        if (res?.error === false) {
          context?.alertBox("success", res?.message);
          setIsAddedInMyList(true);
          context?.getMyListData();
        } else {
          context?.alertBox("error", res?.message);
        }
      } catch (error) {
        context?.alertBox("error", "Failed to add to wishlist");
      } finally {
        setIsLoading(false);
      }
    },
    [context, currentPrice]
  );

  if (!props.item) {
    return (
      <div className="text-red-500">
        {safeT("product.notfound", "PRODUCT NOT FOUND")}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[18px] sm:text-[22px] font-[600] mb-2">
        {locale === "ar" ? props.item.arbName : props.item.name}
      </h1>
      <div className="flex items-start sm:items-center lg:items-center flex-col sm:flex-row md:flex-row lg:flex-row gap-3 justify-start">
        <span className="text-gray-400 text-[13px]">
          {safeT("product.brands", "Brands")}:{" "}
          <span className="font-[500] text-black opacity-75">
            {props.item.brand}
          </span>
        </span>
        <Rating
          name="size-small"
          value={props.item.rating}
          size="small"
          readOnly
        />
        <button
          className="text-[13px] cursor-pointer"
          onClick={props.gotoReviews}
          aria-label="View reviews"
        >
          {safeT("product.review", "Reviews")} ({props.reviewsCount})
        </button>
      </div>
      <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row items-start sm:items-center gap-4 mt-4">
        <div className="flex items-center gap-4">
          <span className="oldPrice line-through text-gray-500 text-[20px] font-[500]">
            {getSymbol()}{convertPrice(props.item.oldPrice)}
          </span>
          <span className="price text-primary text-[20px] font-[600]">
            {getSymbol()}{convertPrice(currentPrice)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[14px]">
            {safeT("product.availableInStock", "Available in Stock")}:{" "}
            <span className="text-green-600 text-[14px] font-bold">
              {currentStock} {safeT("product.items", "items")}
            </span>
          </span>
        </div>
      </div>
      <p className="mt-3 pr-10 mb-5">
        {locale === "ar" ? props.item.arbDescription : props.item.description}
      </p>
      {props.item.variation?.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[16px]">
            {safeT("product.color", "Color")}:
          </span>
          <div className="flex items-center gap-2">
            {props.item.variation.map((variation, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  selectedColor?.color?.label === variation.color.label
                    ? "border-black scale-110"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: variation.color.label.toLowerCase() }}
                onClick={() => handleColorClick(variation)}
                aria-label={`Select ${variation.color.label} color`}
                title={variation.color.label}
              />
            ))}
          </div>
        </div>
      )}
      {selectedColor && selectedColor.sizes?.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[16px]">{safeT("product.size", "SIZE")}:</span>
          <div className="flex items-center gap-1 actions">
            {selectedColor.sizes.map((size, index) => (
              <Button
                key={index}
                className={`${
                  productActionIndex === index ? "!bg-primary !text-white" : ""
                } ${tabError ? "error" : ""}`}
                onClick={() => handleClickActiveTab(index, size.label)}
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      <p className="text-[14px] mt-5 mb-2 text-[#000]">
        {safeT("product.freeShipping", "Free Shipping")}
      </p>
      <div className="flex items-center gap-4 py-4">
        <div className="qtyBoxWrapper w-[70px]">
          <QtyBox handleSelecteQty={handleSelecteQty} />
        </div>
        {currentStock === 0 ? (
          <div className="text-red-500 font-semibold text-[14px]">
            {safeT("product.outofstock", "OUT OF STOCK")}
          </div>
        ) : (
          <Button
            className="btn-org flex gap-2 !min-w-[150px]"
            onClick={() =>
              addToCart(props.item, context?.userData?._id, quantity)
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : isAdded ? (
              <>
                <FaCheckDouble /> Added
              </>
            ) : (
              <>
                <MdOutlineShoppingCart className="text-[22px]" />
                {safeT("product.addToCart", "Add to Cart")}
              </>
            )}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button
          className="flex items-center gap-2 text-[14px] sm:text-[15px] link cursor-pointer font-[500]"
          onClick={() => handleAddToMyList(props.item)}
          aria-label="Add to wishlist"
          disabled={isLoading}
        >
          {isAddedInMyList ? (
            <IoMdHeart className="text-[18px] !text-primary" />
          ) : (
            <FaRegHeart className="text-[18px] !text-black" />
          )}
          {safeT("product.addToWishlist", "Add to Wishlist")}
        </button>
      </div>
    </div>
  );
};
