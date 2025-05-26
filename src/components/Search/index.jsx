// "use client";
// import React, { useContext, useState, useEffect, useRef } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import "../Search/style.css";
// import Button from "@mui/material/Button";
// import CircularProgress from "@mui/material/CircularProgress";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import { Slide } from "@mui/material";
// import { IoSearch, IoImageOutline } from "react-icons/io5";
// import { MyContext } from "@/context/ThemeProvider";
// import { useTranslation } from "@/utils/useTranslation";
// import Image from "next/image";
// import { postData } from "@/utils/api";

// // Slide-up transition for the dialog
// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const Search = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);

//   // Image-search state
//   const [imageFile, setImageFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [showConfirmImageSearch, setShowConfirmImageSearch] = useState(false);
//   const fileInputRef = useRef(null);

//   const context = useContext(MyContext);
//   const router = useRouter();
//   const pathname = usePathname();
//   const { t } = useTranslation();

//   // Reset on navigation
//   useEffect(() => {
//     if (!pathname.includes("/search")) {
//       setSearchQuery("");
//       setSuggestions([]);
//       cancelImageSearch();
//     }
//   }, [pathname]);

//   // Also clear when panel toggles
//   useEffect(() => {
//     setSearchQuery("");
//   }, [context?.setOpenSearchPanel]);

//   // Text-input suggestions
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (!searchQuery) {
//         setSuggestions([]);
//         return;
//       }
//       setIsLoading(true);
//       try {
//         const obj = { page: 1, limit: 5, query: searchQuery };
//         const res = await postData(`/api/product/search/get`, obj);
//         const list =
//           res?.products?.map((item) => ({
//             name: item.name,
//             img: item.images[0],
//             id: item._id || item.id,
//           })) ||
//           res?.data?.map((item) => ({
//             name: item.name,
//             img: item.images[0],
//             id: item._id || item.id,
//           })) ||
//           res?.results?.map((item) => ({
//             name: item.name,
//             img: item.images[0],
//             id: item._id || item.id,
//           })) ||
//           [];
//         setSuggestions(list);
//       } catch {
//         setSuggestions([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const debounce = setTimeout(fetchSuggestions, 300);
//     return () => clearTimeout(debounce);
//   }, [searchQuery]);

//   // Perform text search
//   const search = async (queryToSearch = searchQuery) => {
//     if (!queryToSearch) return;
//     setIsLoading(true);
//     const obj = { page: 1, limit: 3, query: queryToSearch };
//     const res = await postData(`/api/product/search/get`, obj);
//     context.setSearchData(res);
//     setIsLoading(false);
//     context.setOpenSearchPanel(false);
//     router.push("/search");
//   };

//   // Suggestion click
//   const handleSuggestionClick = (suggestion) => {
//     if (suggestion.id) {
//       setSearchQuery(suggestion.name);
//       setSuggestions([]);
//       router.push(`/product/${suggestion.id}`);
//     } else {
//       setSearchQuery(suggestion.name);
//       setSuggestions([]);
//       search(suggestion.name);
//     }
//   };

//   // Category clicks (old)
//   const popularCategories = [
//     "apple",
//     "xyz",
//     "kurti set",
//     "bangle",
//     "mobiles",
//     "water bottle",
//   ];
//   const handleCategoryClick = (cat) => {
//     setSearchQuery(cat);
//     setSuggestions([]);
//     search(cat);
//   };

//   // ─── Image Search Handlers ─────────────────────
//   const onImageIconClick = () => fileInputRef.current?.click();

//   const onFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImageFile(file);
//     setPreviewUrl(URL.createObjectURL(file));
//     setShowConfirmImageSearch(true);
//     setSearchQuery("");
//     setSuggestions([]);
//   };

//   const confirmImageSearch = async () => {
//     // close dialog immediately
//     setShowConfirmImageSearch(false);
//     if (!imageFile) return;
//     setIsLoading(true);
//     const form = new FormData();
//     form.append("image", imageFile);
//     const res = await fetch("/api/search/image", {
//       method: "POST",
//       body: form,
//     });
//     const data = await res.json();
//     context.setSearchData(data.products || []);
//     setIsLoading(false);
//     context.setOpenSearchPanel(false);
//     router.push("/search");
//   };

//   const cancelImageSearch = () => {
//     setShowConfirmImageSearch(false);
//     setImageFile(null);
//     setPreviewUrl("");
//   };
//   // ────────────────────────────────────────────────

//   return (
//     <div className="searchBox w-full h-[50px] bg-[#e5e5e5] rounded-[5px] relative p-2 flex items-center">
//       {/* Text Input */}
//       <input
//         type="text"
//         placeholder={t("header.searchPlaceholder")}
//         className="flex-1 h-[35px] focus:outline-none bg-inherit p-2 text-[15px]"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         onFocus={() => setIsOpenSuggestions(true)}
//         onBlur={() => setTimeout(() => setIsOpenSuggestions(false), 200)}
//         disabled={!!imageFile}
//       />

//       {/* Hidden file input */}
//       <input
//         type="file"
//         accept="image/*"
//         ref={fileInputRef}
//         className="hidden"
//         onChange={onFileChange}
//       />

//       {/* Image Search Icon */}
//       {/* <Button
//         className="!ml-2 !min-w-[37px] h-[37px] !rounded-full"
//         onClick={onImageIconClick}
//         disabled={isLoading}
//       >
//         <IoImageOutline size={20} className="text-gray-500" />
//       </Button> */}

//       {/* Text Search Button */}
//       <Button
//         className="!ml-2 !min-w-[37px] h-[37px] !rounded-full"
//         onClick={() => search()}
//         disabled={isLoading || !!imageFile}
//       >
//         {isLoading ? (
//           <CircularProgress size={20} />
//         ) : (
//           <IoSearch size={20} className="text-gray-500" />
//         )}
//       </Button>

//       {/* Confirmation Dialog */}
//       <Dialog
//         open={showConfirmImageSearch}
//         TransitionComponent={Transition}
//         keepMounted
//         onClose={cancelImageSearch}
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             p: 2,
//             maxWidth: 360,
//             width: "90%",
//             mx: "auto",
//           },
//         }}
//         BackdropProps={{
//           sx: {
//             backdropFilter: "blur(4px)",
//             backgroundColor: "rgba(0,0,0,0.3)",
//           },
//         }}
//       >
//         <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
//           Confirm Image Search
//         </DialogTitle>
//         <DialogContent
//           sx={{ display: "flex", justifyContent: "center", py: 1 }}
//         >
//           <div style={{ width: 120, height: 120, position: "relative" }}>
//             <Image
//               src={previewUrl}
//               alt="preview"
//               fill
//               style={{ borderRadius: 8, objectFit: "cover" }}
//             />
//           </div>
//         </DialogContent>
//         <DialogActions sx={{ justifyContent: "center", pb: 2, pt: 1 }}>
//           <Button
//             variant="outlined"
//             onClick={cancelImageSearch}
//             sx={{ textTransform: "none", mr: 1 }}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={confirmImageSearch}
//             sx={{ textTransform: "none" }}
//             disabled={isLoading}
//           >
//             {isLoading ? <CircularProgress size={20} /> : "Search"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Suggestions Dropdown */}
//       {isOpenSuggestions && suggestions.length === 0 && (
//         <div className="absolute top-[50px] left-0 w-full bg-white rounded-b-md shadow-lg z-50 p-3">
//           <h3>Popular Searches</h3>
//           <ul className="flex flex-wrap gap-2 mt-2">
//             {popularCategories.map((cat) => (
//               <li key={cat}>
//                 <Button
//                   className="!bg-gray-200 !capitalize !text-[13px] !py-1 !text-gray-900 hover:!bg-gray-300"
//                   onClick={() => handleCategoryClick(cat)}
//                 >
//                   {cat}
//                 </Button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       {isOpenSuggestions && suggestions.length > 0 && !imageFile && (
//         <div className="absolute top-[50px] left-0 w-full bg-white rounded-b-md shadow-lg z-50 max-h-[200px] overflow-y-auto">
//           {suggestions.map((s, i) => (
//             <div
//               key={i}
//               className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
//               onClick={() => handleSuggestionClick(s)}
//             >
//               <div className="w-[35px] h-[35px] rounded-sm border p-1 bg-white relative">
//                 <Image src={s.img} alt={s.name} fill className="object-cover" />
//               </div>
//               <span className="text-[14px]">{s.name}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Search;

"use client";
import React, { useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import "../Search/style.css";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { IoSearch } from "react-icons/io5";
import { MyContext } from "@/context/ThemeProvider";
import { useTranslation } from "@/utils/useTranslation";
import Image from "next/image";
import { postData } from "@/utils/api";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({ products: [], vendors: [] });
  const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);

  const context = useContext(MyContext);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  // Reset on navigation
  useEffect(() => {
    if (!pathname.includes("/search")) {
      setSearchQuery("");
      setSuggestions({ products: [], vendors: [] });
    }
  }, [pathname]);

  // Clear when panel toggles
  useEffect(() => {
    setSearchQuery("");
  }, [context?.setOpenSearchPanel]);

  // Fetch suggestions for both products and vendors
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery) {
        setSuggestions({ products: [], vendors: [] });
        return;
      }
      setIsLoading(true);
      try {
        const res = await postData(`/api/search/unified`, {
          query: searchQuery,
          page: 1,
          limit: 5,
        });
        setSuggestions({
          products: res.products || [],
          vendors: res.vendors || [],
        });
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions({ products: [], vendors: [] });
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Perform text search (for search button)
  const search = async (queryToSearch = searchQuery) => {
    if (!queryToSearch) return;
    setIsLoading(true);
    try {
      const res = await postData(`/api/search/unified`, {
        query: queryToSearch,
        page: 1,
        limit: 10,
      });
      context.setSearchData({
        products: res.products || [],
        vendors: res.vendors || [],
        total: res.total || { products: 0, vendors: 0 },
        totalPages: res.totalPages || { products: 1, vendors: 1 },
        query: queryToSearch,
      });
      setIsLoading(false);
      context.setOpenSearchPanel(false);
      router.push("/search");
    } catch (error) {
      console.error("Error performing search:", error);
      setIsLoading(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion, type) => {
    setSearchQuery(suggestion.name);
    setSuggestions({ products: [], vendors: [] });
    setIsOpenSuggestions(false);
    router.push(`/${type}/${suggestion._id}`);
  };

  // Category clicks
  const popularCategories = [
    "apple",
    "xyz",
    "kurti set",
    "bangle",
    "mobiles",
    "water bottle",
    "vendor1",
    "vendor2",
  ];
  const handleCategoryClick = (cat) => {
    setSearchQuery(cat);
    setSuggestions({ products: [], vendors: [] });
    setIsOpenSuggestions(false);
    search(cat);
  };

  return (
    <div className="searchBox w-full h-[50px] bg-[#e5e5e5] rounded-[5px] relative p-2 flex items-center">
      {/* Text Input */}
      <input
        type="text"
        placeholder={t("header.searchPlaceholder")}
        className="flex-1 h-[35px] focus:outline-none bg-inherit p-2 text-[15px]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsOpenSuggestions(true)}
        onBlur={() => setTimeout(() => setIsOpenSuggestions(false), 200)}
      />

      {/* Text Search Button */}
      <Button
        className="!ml-2 !min-w-[37px] h-[37px] !rounded-full"
        onClick={() => search()}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={20} />
        ) : (
          <IoSearch size={20} className="text-gray-500" />
        )}
      </Button>

      {/* Suggestions Dropdown */}
      {isOpenSuggestions &&
        suggestions.products.length === 0 &&
        suggestions.vendors.length === 0 && (
          <div className="absolute top-[50px] left-0 w-full bg-white rounded-b-md shadow-lg z-50 p-3">
            <h3 className="text-[14px] font-semibold mb-2">Popular Searches</h3>
            <ul className="flex flex-wrap gap-2">
              {popularCategories.map((cat) => (
                <li key={cat}>
                  <Button
                    className="!bg-gray-200 !capitalize !text-[13px] !py-1 !text-gray-900 hover:!bg-gray-300"
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      {isOpenSuggestions &&
        (suggestions.products.length > 0 || suggestions.vendors.length > 0) && (
          <div className="absolute top-[50px] left-0 w-full bg-white rounded-b-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
            {suggestions.products.length > 0 && (
              <div className="p-2">
                <h4 className="text-[12px] font-semibold text-gray-500 mb-2">
                  Products
                </h4>
                {suggestions.products.map((s, i) => (
                  <div
                    key={`product-${i}`}
                    className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSuggestionClick(s, "product")}
                  >
                    <div className="w-[35px] h-[35px] rounded-sm border p-1 bg-white relative">
                      <Image
                        src={s.image || "/default-product-image.png"}
                        alt={s.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[14px]">{s.name}</span>
                  </div>
                ))}
              </div>
            )}
            {suggestions.vendors.length > 0 && (
              <div className="p-2">
                <h4 className="text-[12px] font-semibold text-gray-500 mb-2">
                  Vendors
                </h4>
                {suggestions.vendors.map((s, i) => (
                  <div
                    key={`vendor-${i}`}
                    className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSuggestionClick(s, "vendor")}
                  >
                    <div className="w-[35px] h-[35px] rounded-sm border p-1 bg-white relative">
                      <Image
                        src={s.image || "/default-vendor-logo.png"}
                        alt={s.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[14px]">{s.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default Search;
