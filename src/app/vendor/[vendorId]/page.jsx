"use client";
import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { fetchDataFromApi } from "@/utils/api";
import { MyContext } from "@/context/ThemeProvider";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import { IoGridSharp } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import ProductItem from "@/components/ProductItem";
import ProductItemListView from "@/components/ProductItemListView";
import ProductLoadingGrid from "@/components/ProductLoading/productLoadingGrid";
import Breadcrumb from "@/components/Breadcrumb";

const VendorPage = () => {
  const { vendorId } = useParams();
  const context = useContext(MyContext);
  const [vendor, setVendor] = useState(null);
  const [productsData, setProductsData] = useState({ products: [], total: 0 });
  const [isLoading, setIsLoading] = useState({ vendor: true, products: true });
  const [error, setError] = useState({ vendor: null, products: null });
  const [itemView, setItemView] = useState("grid");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (vendorId) {
      const fetchVendor = async () => {
        try {
          const res = await fetchDataFromApi(`/api/vendor/list?id=${vendorId}`);
          if (res.error || !res.vendors?.length) {
            throw new Error(res.message || "Vendor not found");
          }
          setVendor(res.vendors[0]);
          setIsLoading((prev) => ({ ...prev, vendor: false }));
        } catch (error) {
          console.error("Error fetching vendor:", error);
          setError((prev) => ({ ...prev, vendor: error.message }));
          setIsLoading((prev) => ({ ...prev, vendor: false }));
        }
      };

      const fetchProducts = async () => {
        try {
          const res = await fetchDataFromApi(
            `/api/product/getAllProductsForVendorId?vendorId=${vendorId}&page=${page}&limit=10`
          );
          if (res.error) {
            throw new Error(res.message || "No products found");
          }
          setProductsData({
            products: Array.isArray(res.products) ? res.products : [],
            total: res.total || 0,
          });
          setTotalPages(res.totalPages || 1);
          setIsLoading((prev) => ({ ...prev, products: false }));
        } catch (error) {
          console.error("Error fetching products:", error);
          setError((prev) => ({ ...prev, products: error.message }));
          setIsLoading((prev) => ({ ...prev, products: false }));
          setProductsData({ products: [], total: 0 });
        }
      };

      fetchVendor();
      fetchProducts();
    }
  }, [vendorId, page]);

  if (isLoading.vendor) return <div className="container p-4">Loading...</div>;
  if (error.vendor || !vendor)
    return (
      <div className="container p-4">Vendor not found: {error.vendor}</div>
    );

  return (
    <>
      <Breadcrumb
        paths={[
          {
            label: vendor.storeName,
            href: `/vendor/${vendor?._id}`,
          },
        ]}
      />
      <section className="pb-0">
        <div className="bg-white p-2">
          <div className="container">
            {/* Vendor Details */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold">{vendor.storeName}</h1>
              {vendor.storeLogo?.[0] && (
                <Image
                  src={vendor.storeLogo[0]}
                  alt={vendor.storeName}
                  width={128}
                  height={128}
                  className="object-cover mt-2"
                />
              )}
              <p className="mt-2">{vendor.storeDescription}</p>
              <p className="mt-1">Contact: {vendor.phoneNumber}</p>
              <p className="mt-1">Address: {vendor.storeAddress}</p>
            </div>

            {/* Products Section */}
            <div className="rightContent w-full py-3">
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
                    There are {productsData.products.length || 0} products.
                  </span>
                </div>
              </div>

              <div
                className={`grid ${
                  itemView === "grid"
                    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1"
                } gap-4`}
              >
                {isLoading.products ? (
                  <ProductLoadingGrid view={itemView} />
                ) : productsData.products.length > 0 ? (
                  productsData.products.map((item, index) =>
                    itemView === "grid" ? (
                      <ProductItem key={index} item={item} />
                    ) : (
                      <ProductItemListView key={index} item={item} />
                    )
                  )
                ) : (
                  <div className="col-span-full text-center">
                    No products available for this vendor.
                  </div>
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
    </>
  );
};

export default VendorPage;
