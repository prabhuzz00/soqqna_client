"use client";
import { Sidebar } from "@/components/Sidebar";
import { MyContext } from "@/context/ThemeProvider";
import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { LuMenu } from "react-icons/lu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import { IoGridSharp } from "react-icons/io5";
import ProductItem from "@/components/ProductItem";
import ProductItemListView from "@/components/ProductItemListView";
import { fetchDataFromApi, postData } from "@/utils/api";
import ProductLoadingGrid from "@/components/ProductLoading/productLoadingGrid";
import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumb";

// Global function to trigger query param updates (call this in Link components)
export const triggerQueryUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("queryUpdate"));
  }
};

const ProductPage = () => {
  const [itemView, setItemView] = useState("grid");
  const [anchorEl, setAnchorEl] = useState(null);
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSortVal, setSelectedSortVal] = useState("Name, A to Z");
  const context = useContext(MyContext);
  const [catId, setCatId] = useState(null);
  const [subCatId, setSubCatId] = useState(null);
  const [categoryName, setCategoryName] = useState("Products");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [parentCatId, setParentCatId] = useState(null);

  // Parse URL query parameters and update on navigation
  useEffect(() => {
    const updateQueryParams = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        setCatId(params.get("catId"));
        setSubCatId(params.get("subCatId"));
      }
    };

    // Initial parse
    updateQueryParams();

    // Listen for popstate events (browser back/forward) and custom queryUpdate events
    if (typeof window !== "undefined") {
      window.addEventListener("popstate", updateQueryParams);
      window.addEventListener("queryUpdate", updateQueryParams);

      // Fallback polling for client-side navigation (lightweight, 500ms interval)
      const interval = setInterval(() => {
        updateQueryParams();
      }, 500);

      return () => {
        window.removeEventListener("popstate", updateQueryParams);
        window.removeEventListener("queryUpdate", updateQueryParams);
        clearInterval(interval);
      };
    }
  }, []);

  // Fetch category and subcategory names
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (subCatId) {
        const subCatRes = await fetchDataFromApi(`/api/category/${subCatId}`);
        const subCat = subCatRes?.category;
        if (subCat?.name) {
          setSubCategoryName(subCat.name);
          if (subCat?.parentId) {
            setParentCatId(subCat.parentId);
            const parentRes = await fetchDataFromApi(
              `/api/category/${subCat.parentId}`
            );
            const parentCat = parentRes?.category;
            setCategoryName(parentCat?.name || "Products");
          } else {
            setParentCatId(catId);
            setCategoryName("Products");
          }
        } else {
          setSubCategoryName("");
          setCategoryName("Products");
          setParentCatId(null);
        }
      } else if (catId) {
        setSubCategoryName("");
        const catRes = await fetchDataFromApi(`/api/category/${catId}`);
        const cat = catRes?.category;
        setCategoryName(cat?.name || "Products");
        setParentCatId(catId);
      } else {
        setCategoryName("Products");
        setSubCategoryName("");
        setParentCatId(null);
      }
    };

    fetchCategoryData();
  }, [subCatId, catId]);

  // Scroll to top on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortBy = (name, order, products, value) => {
    setSelectedSortVal(value);
    postData(`/api/product/sortBy`, {
      products: products,
      sortBy: name,
      order: order,
    }).then((res) => {
      setProductsData(res);
      setAnchorEl(null);
    });
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="pb-0">
        <Breadcrumb
          paths={[
            ...(categoryName && categoryName !== "Products"
              ? [
                  {
                    label: categoryName,
                    href: `/products?catId=${parentCatId}`,
                  },
                ]
              : []),
            ...(subCategoryName
              ? [
                  {
                    label: subCategoryName,
                    href: `/products?subCatId=${subCatId}`,
                  },
                ]
              : []),
          ]}
        />
        <div className="bg-white p-2">
          <div className="container flex gap-3">
            <div
              className={`sidebarWrapper fixed -bottom-[100%] left-0 w-full lg:h-full lg:static lg:w-[20%] bg-white z-[102] lg:z-[100] p-3 lg:p-0 transition-all lg:opacity-100 opacity-0 ${
                context?.openFilter === true ? "open" : ""
              }`}
            >
              <Sidebar
                productsData={productsData}
                setProductsData={setProductsData}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                page={page}
                setTotalPages={setTotalPages}
                initialCatId={catId}
                initialSubCatId={subCatId}
              />
            </div>

            {context?.windowWidth < 992 && (
              <div
                className={`filter_overlay w-full h-full bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 z-[101] ${
                  context?.openFilter === true ? "block" : "hidden"
                }`}
                onClick={() => context?.setOpenFilter(false)}
              ></div>
            )}

            <div className="rightContent w-full lg:w-[80%] py-0 lg:py-3">
              <div className="mb-4">
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 px-2 py-1 rounded-md flex items-center"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#f1f1f1] p-2 w-full mb-4 rounded-md flex items-center justify-between sticky top-[53px] z-[99]">
                <div className="col1 flex items-center itemViewActions">
                  <Button
                    className={`!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[#000] ${
                      itemView === "list" && "active !bg-[#dfdfdf]"
                    }`}
                    onClick={() => setItemView("list")}
                  >
                    <LuMenu className="text-[rgba(0,0,0,0.7)] text-[16px]" />
                  </Button>
                  <Button
                    className={`!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-[#000] ${
                      itemView === "grid" && "active !bg-[#dfdfdf]"
                    }`}
                    onClick={() => setItemView("grid")}
                  >
                    <IoGridSharp className="text-[rgba(0,0,0,0.7)] text-[14px]" />
                  </Button>
                  <span className="text-[14px] hidden sm:block md:block lg:block font-[500] pl-3 text-[rgba(0,0,0,0.7)]">
                    There are {productsData?.products?.length || 0} products.
                  </span>
                </div>

                <div className="col2 ml-auto flex items-center justify-end gap-3 pr-4">
                  <span className="text-[14px] font-[500] pl-3 text-[rgba(0,0,0,0.7)]">
                    Sort By
                  </span>
                  <Button
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    className="!bg-white !text-[12px] !text-[#000] !capitalize !border-2 !border-[#000]"
                  >
                    {selectedSortVal}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{ "aria-labelledby": "basic-button" }}
                  >
                    <MenuItem
                      onClick={() =>
                        handleSortBy(
                          "name",
                          "asc",
                          productsData,
                          "Name, A to Z"
                        )
                      }
                      className="!text-[13px] !text-[#000] !capitalize"
                    >
                      Name, A to Z
                    </MenuItem>
                    <MenuItem
                      onClick={() =>
                        handleSortBy(
                          "name",
                          "desc",
                          productsData,
                          "Name, Z to A"
                        )
                      }
                      className="!text-[13px] !text-[#000] !capitalize"
                    >
                      Name, Z to A
                    </MenuItem>
                    <MenuItem
                      onClick={() =>
                        handleSortBy(
                          "price",
                          "asc",
                          productsData,
                          "Price, low to high"
                        )
                      }
                      className="!text-[13px] !text-[#000] !capitalize"
                    >
                      Price, low to high
                    </MenuItem>
                    <MenuItem
                      onClick={() =>
                        handleSortBy(
                          "price",
                          "desc",
                          productsData,
                          "Price, high to low"
                        )
                      }
                      className="!text-[13px] !text-[#000] !capitalize"
                    >
                      Price, high to low
                    </MenuItem>
                  </Menu>
                </div>
              </div>

              <div
                className={`grid ${
                  itemView === "grid"
                    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1"
                } gap-4`}
              >
                {isLoading ? (
                  <ProductLoadingGrid view={itemView} />
                ) : (
                  productsData?.products?.length > 0 &&
                  productsData?.products
                    .slice()
                    .reverse()
                    .map((item, index) =>
                      itemView === "grid" ? (
                        <ProductItem key={index} item={item} />
                      ) : (
                        <ProductItemListView key={index} item={item} />
                      )
                    )
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-10">
                  <Pagination
                    showFirstButton
                    showLastButton
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default ProductPage;
