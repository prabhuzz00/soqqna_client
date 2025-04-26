// "use client"
// import React, { useContext, useState } from "react";
// import "../Search/style.css";
// import Button from "@mui/material/Button";
// import { IoSearch } from "react-icons/io5";
// import { MyContext } from "@/context/ThemeProvider";
// import { useNavigate } from "react-router-dom";
// import { postData } from "@/utils/api";
// import CircularProgress from '@mui/material/CircularProgress';
// import { useRouter } from "next/navigation";

// const Search = () => {

//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const context = useContext(MyContext);

//   const router = useRouter();

//   const onChangeInput = (e) => {
//     setSearchQuery(e.target.value);
//   }

//   const search = () => {

//     setIsLoading(true)

//     const obj = {
//       page: 1,
//       limit: 3,
//       query: searchQuery
//     }

//     if (searchQuery !== "") {
//       postData(`/api/product/search/get`, obj).then((res) => {
//         context?.setSearchData(res);
//         setTimeout(() => {
//           setIsLoading(false);
//           context?.setOpenSearchPanel(false)
//           router.push("/search")
//         }, 1000);
//       })
//     }

//   }

//   return (
//     <div className="searchBox w-[100%] h-[50px] bg-[#e5e5e5] rounded-[5px] relative p-2">
//       <input
//         type="text"
//         placeholder="Search for products..."
//         className="w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px]"
//         value={searchQuery}
//         onChange={onChangeInput}
//       />
//       <Button className="!absolute top-[8px] right-[5px] z-50 !w-[37px] !min-w-[37px] h-[37px] !rounded-full !text-black" onClick={search}>
//         {
//           isLoading === true ? <CircularProgress /> : <IoSearch className="text-[#4e4e4e] text-[22px]" />
//         }

//       </Button>
//     </div>
//   );
// };

// export default Search;
"use client";
import React, { useContext, useState, useEffect } from "react";
import "../Search/style.css";
import Button from "@mui/material/Button";
import { IoSearch } from "react-icons/io5";
import { MyContext } from "@/context/ThemeProvider";
import { useRouter } from "next/navigation";
import { postData } from "@/utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/utils/useTranslation";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const context = useContext(MyContext);
  const router = useRouter();

  const { t } = useTranslation();
  // Reset search query when component mounts or panel is closed
  useEffect(() => {
    setSearchQuery(""); // Reset on mount
    return () => {
      // Cleanup: Reset when unmounted (e.g., navigating away)
      setSearchQuery("");
    };
  }, [context?.setOpenSearchPanel]); // Depend on setOpenSearchPanel to reset when panel state changes

  const onChangeInput = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 0) {
        setIsLoading(true);
        try {
          const obj = {
            page: 1,
            limit: 5,
            query: searchQuery,
          };
          const res = await postData(`/api/product/search/get`, obj);
          console.log("API Response:", res); // Debug: Log the full response
          // Adjust based on your API response structure
          const suggestionList =
            res?.products?.map((item) => ({
              name: item.name,
              id: item._id || item.id,
            })) ||
            res?.data?.map((item) => ({
              name: item.name,
              id: item._id || item.id,
            })) ||
            res?.results?.map((item) => ({
              name: item.name,
              id: item._id || item.id,
            })) ||
            [];
          setSuggestions(suggestionList);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const search = () => {
    if (searchQuery !== "") {
      setIsLoading(true);
      const obj = {
        page: 1,
        limit: 3,
        query: searchQuery,
      };
      postData(`/api/product/search/get`, obj).then((res) => {
        context?.setSearchData(res);
        setTimeout(() => {
          setIsLoading(false);
          context?.setOpenSearchPanel(false);
          router.push("/search");
        }, 1000);
      });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.id) {
      setSearchQuery(suggestion.name);
      setSuggestions([]);
      router.push(`/product/${suggestion.id}`); // Adjust route as needed
    } else {
      console.warn("No product ID available for:", suggestion.name);
      setSearchQuery(suggestion.name);
      setSuggestions([]);
      search();
    }
  };

  return (
    <div className="searchBox w-[100%] h-[50px] bg-[#e5e5e5] rounded-[5px] relative p-2">
      <input
        type="text"
        placeholder={t("header.searchPlaceholder")}
        className="w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px]"
        value={searchQuery}
        onChange={onChangeInput}
      />
      <Button
        className="!absolute top-[8px] right-[5px] z-50 !w-[37px] !min-w-[37px] h-[37px] !rounded-full !text-black"
        onClick={search}
      >
        {isLoading ? (
          <CircularProgress size={20} />
        ) : (
          <IoSearch className="text-[#4e4e4e] text-[22px]" />
        )}
      </Button>
      {suggestions.length > 0 && (
        <div className="absolute top-[50px] left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-[200px] overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name || "No name available"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
