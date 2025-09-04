// import { fetchDataFromApi } from "@/utils/api";
// import ProductOverview from "@/components/ProductDetail";
// import { cache } from "react";
// import { Suspense } from "react";
// import { notFound } from "next/navigation";
// import { CircularProgress } from "@mui/material";

// async function getReviews(productId) {
//   console.time("fetchReviews");
//   const res = await fetchDataFromApi(
//     `/api/user/getReviews?productId=${productId}`,
//     {
//       next: { revalidate: 3600 },
//     }
//   );
//   console.timeEnd("fetchReviews");
//   return res?.error === false ? res.reviews.length : 0;
// }

// const getProductDetail = cache(async (productId) => {
//   try {
//     console.time("fetchProduct");
//     const productRes = await fetchDataFromApi(`/api/product/${productId}`, {
//       next: { revalidate: 3600 },
//     });
//     console.timeEnd("fetchProduct");

//     if (productRes?.error || !productRes?.product) {
//       return { product: null, relatedProducts: [] };
//     }

//     console.time("fetchRelatedProducts");
//     const subCategoryRes = await fetchDataFromApi(
//       `/api/product/getAllProductsBySubCatId/${productRes?.product?.subCatId}?limit=6&exclude=${productId}`,
//       { next: { revalidate: 3600 } }
//     );
//     console.timeEnd("fetchRelatedProducts");

//     return {
//       product: productRes?.product,
//       relatedProducts: subCategoryRes?.products || [],
//     };
//   } catch (error) {
//     console.error("Error fetching product details:", error);
//     return { product: null, relatedProducts: [] };
//   }
// });

// export default async function ProductPage({ params }) {
//   const id = params.productId;
//   const [reviewsCount, productDetail] = await Promise.all([
//     getReviews(id),
//     getProductDetail(id),
//   ]);

//   if (!productDetail.product) {
//     notFound();
//   }

//   return (
//     <Suspense
//       fallback={
//         <div className="flex items-center justify-center min-h-screen">
//           <CircularProgress />
//         </div>
//       }
//     >
//       <ProductOverview
//         product={productDetail.product}
//         relatedProducts={productDetail.relatedProducts}
//         reviewsCountProp={reviewsCount}
//       />
//     </Suspense>
//   );
// }

import { fetchDataFromApi } from "@/utils/api";
import ProductOverview from "@/components/ProductDetail";
import { cache } from "react";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CircularProgress } from "@mui/material";

// Generate Metadata for SEO and social sharing
export async function generateMetadata({ params }) {
  const id = params.productId;
  // Fetch product data (use same logic as getProductDetail)
  const productRes = await fetchDataFromApi(`/api/product/${id}`);
  const product = productRes?.product;
  if (!product) {
    return {
      title: "Product Not Found | Soouqna",
      description: "This product does not exist.",
      openGraph: {
        title: "Product Not Found | Soouqna",
        description: "This product does not exist.",
        url: `https://soouqna.com/product/${id}`,
        type: "website",
        images: [
          {
            url: "https://soouqna.com/default-image.jpg",
            width: 800,
            height: 600,
            alt: "Product Not Found",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Product Not Found | Soouqna",
        description: "This product does not exist.",
        images: ["https://soouqna.com/default-image.jpg"],
      },
    };
  }

  // Compose metadata
  const title = product.name || "Product";
  const description = product.description || "Buy this product on Soouqna!";
  const imageUrl =
    product.images?.[0] || "https://soouqna.com/default-image.jpg";
  const url = `https://soouqna.com/product/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website", // "website" is a valid OpenGraph type for Next.js App Router
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

async function getReviews(productId) {
  // Remove duplicate console.time labels
  const res = await fetchDataFromApi(
    `/api/user/getReviews?productId=${productId}`,
    {
      next: { revalidate: 3600 },
    }
  );
  return res?.error === false ? res.reviews.length : 0;
}

const getProductDetail = cache(async (productId) => {
  try {
    const productRes = await fetchDataFromApi(`/api/product/${productId}`, {
      next: { revalidate: 3600 },
    });

    if (productRes?.error || !productRes?.product) {
      return { product: null, relatedProducts: [] };
    }

    const subCategoryRes = await fetchDataFromApi(
      `/api/product/getAllProductsBySubCatId/${productRes?.product?.subCatId}?limit=6&exclude=${productId}`,
      { next: { revalidate: 3600 } }
    );

    return {
      product: productRes?.product,
      relatedProducts: subCategoryRes?.products || [],
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    return { product: null, relatedProducts: [] };
  }
});

export default async function ProductPage({ params }) {
  const id = params.productId;
  const [reviewsCount, productDetail] = await Promise.all([
    getReviews(id),
    getProductDetail(id),
  ]);

  if (!productDetail.product) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <CircularProgress />
        </div>
      }
    >
      <ProductOverview
        product={productDetail.product}
        relatedProducts={productDetail.relatedProducts}
        reviewsCountProp={reviewsCount}
      />
    </Suspense>
  );
}
