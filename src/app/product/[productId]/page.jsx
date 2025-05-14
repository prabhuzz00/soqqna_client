// "use client";
import { fetchDataFromApi } from "@/utils/api";
import ProductOverview from "@/components/ProductDetail";
import { cache } from "react";

const ProductPage = async ({ params }) => {
  const id = params.productId;

  // Server Action
  async function getReviews() {
    "use server";
    const res = await fetchDataFromApi(`/api/user/getReviews?productId=${id}`);
    if (res?.error === false) {
      return res.reviews.length;
    }
    return 0;
  }

  const getProductDetail = cache(async function getProductDetail() {
    "use server";
    const res = await fetchDataFromApi(`/api/product/${id}`);
    if (res?.error === true) {
      return null;
    }
    const subCategory = await fetchDataFromApi(
      `/api/product/getAllProductsBySubCatId/${res?.product?.subCatId}`
    );
    if (subCategory?.error === true) {
      return null;
    }
    const filteredData = res?.products?.filter((item) => item._id !== id);
    return {
      product: res?.product,
      relatedProducts: filteredData ? filteredData : [],
    };
  });

  const reviewsCount = await getReviews();

  const productDetail = await getProductDetail();

  return (
    <ProductOverview
      product={productDetail.product}
      relatedProducts={productDetail.relatedProducts}
      reviewsCount={reviewsCount}
    />
  );
};

export default ProductPage;
