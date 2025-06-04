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
    context?.setOpenSearchPanel(false);
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
