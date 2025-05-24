import React, { useContext, useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "../Sidebar/style.css";
import { Collapse } from "react-collapse";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Button from "@mui/material/Button";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import Rating from "@mui/material/Rating";
import { MdOutlineFilterAlt } from "react-icons/md";
import { MyContext } from "@/context/ThemeProvider";
import { usePathname, useSearchParams } from "next/navigation";
import { postData } from "@/utils/api";

export const Sidebar = ({
  productsData,
  setProductsData,
  isLoading,
  setIsLoading,
  page,
  setTotalPages,
  initialCatId,
  initialSubCatId,
}) => {
  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
  const [filters, setFilters] = useState({
    catId: initialCatId ? [initialCatId] : [],
    subCatId: initialSubCatId ? [initialSubCatId] : [],
    thirdsubCatId: [],
    minPrice: "",
    maxPrice: "",
    rating: "",
    page: 1,
    limit: 25,
  });
  const [price, setPrice] = useState([0, 60000]);
  const context = useContext(MyContext);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize filters based on URL query parameters
  useEffect(() => {
    const catId = searchParams.get("catId");
    const subCatId = searchParams.get("subCatId");
    const thirdLavelCatId = searchParams.get("thirdLavelCatId");

    setFilters((prev) => {
      // Only update filters if they differ from current state to avoid resetting user selections
      const newFilters = { ...prev };
      if (catId && catId !== initialCatId && !prev.catId.includes(catId)) {
        newFilters.catId = [catId];
        newFilters.subCatId = [];
        newFilters.thirdsubCatId = [];
        newFilters.rating = [];
      } else if (
        subCatId &&
        subCatId !== initialSubCatId &&
        !prev.subCatId.includes(subCatId)
      ) {
        newFilters.subCatId = [subCatId];
        newFilters.catId = [];
        newFilters.thirdsubCatId = [];
        newFilters.rating = [];
      } else if (
        thirdLavelCatId &&
        !prev.thirdsubCatId.includes(thirdLavelCatId)
      ) {
        newFilters.thirdsubCatId = [thirdLavelCatId];
        newFilters.catId = [];
        newFilters.subCatId = [];
        newFilters.rating = [];
      }
      return newFilters;
    });
  }, [searchParams, initialCatId, initialSubCatId]);

  // Update filters.page when props.page changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page }));
  }, [page]);

  // Update filters when price changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: price[0],
      maxPrice: price[1],
    }));
  }, [price]);

  // Fetch filtered products when filters change
  useEffect(() => {
    if (
      filters.catId.length > 0 ||
      filters.subCatId.length > 0 ||
      filters.thirdsubCatId.length > 0 ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.rating.length > 0
    ) {
      filtesData();
    }
  }, [filters]);

  const filtesData = () => {
    setIsLoading(true);
    context?.setSearchData([]);

    postData(`/api/product/filters`, filters).then((res) => {
      setProductsData(res);
      setIsLoading(false);
      setTotalPages(res?.totalPages);
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }
    });
  };

  const handleCheckboxChange = (field, value) => {
    context?.setSearchData([]);
    const currentValues = filters[field] || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setFilters((prev) => ({
      ...prev,
      [field]: updatedValues,
      ...(field === "catId" ? { subCatId: [], thirdsubCatId: [] } : {}),
    }));
  };

  return (
    <aside className="sidebar py-3 lg:py-5 static lg:sticky top-[50px] z-[50] pr-0 lg:pr-5">
      <div className="lg:overflow-visible overflow-auto w-full">
        <div className="box">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Shop by Category
            <Button
              className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]"
              onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}
            >
              {isOpenCategoryFilter ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </h3>
          <Collapse isOpened={isOpenCategoryFilter}>
            <div className="scroll px-4 relative -left-[13px]">
              {context?.catData?.length !== 0 &&
                context?.catData?.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item?._id}
                    control={<Checkbox />}
                    checked={filters?.catId?.includes(item?._id)}
                    label={item?.name}
                    onChange={() => handleCheckboxChange("catId", item?._id)}
                    className="w-full"
                  />
                ))}
            </div>
          </Collapse>
        </div>

        <div className="box mt-4">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Filter By Price
          </h3>
          <RangeSlider
            value={price}
            onInput={setPrice}
            min={100}
            max={60000}
            step={5}
          />
          <div className="flex pt-4 pb-2 priceRange">
            <span className="text-[13px]">
              From: <strong className="text-dark">Rs: {price[0]}</strong>
            </span>
            <span className="ml-auto text-[13px]">
              From: <strong className="text-dark">Rs: {price[1]}</strong>
            </span>
          </div>
        </div>

        <div className="box mt-4">
          <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
            Filter By Rating
          </h3>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center pl-2 lg:pl-1">
              <FormControlLabel
                value={rating}
                control={<Checkbox />}
                checked={filters?.rating?.includes(rating)}
                onChange={() => handleCheckboxChange("rating", rating)}
              />
              <Rating
                name={`rating-${rating}`}
                value={rating}
                size="small"
                readOnly
              />
            </div>
          ))}
        </div>
      </div>
      <br />
      <Button
        className="btn-org w-full !flex lg:!hidden"
        onClick={() => context?.setOpenFilter(false)}
      >
        <MdOutlineFilterAlt size={20} /> Filters
      </Button>
    </aside>
  );
};
