'use client';
import React, { useContext, useState, useEffect } from 'react';
import '../Search/style.css';
import Button from '@mui/material/Button';
import { IoSearch } from 'react-icons/io5';
import { MyContext } from '@/context/ThemeProvider';
import { useRouter } from 'next/navigation';
import { postData } from '@/utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from '@/utils/useTranslation';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);

  const context = useContext(MyContext);
  const router = useRouter();

  const { t } = useTranslation();
  useEffect(() => {
    setSearchQuery(''); 
    return () => {
      setSearchQuery('');
    };
  }, [context?.setOpenSearchPanel]); 
  
  const onChangeInput = (e) => {
    setSearchQuery(e.target.value);
  };
  const popularCategories = [
    'apple',
    'xyz',
    'kurti set',
    'bangle',
    'mobiles',
    'water bottle',
  ];
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
          console.log('API Response:', res); 
          const suggestionList =
            res?.products?.map((item) => ({
              name: item.name,
              img: item?.images[0],
              id: item._id || item.id,
            })) ||
            res?.data?.map((item) => ({
              name: item.name,
              img: item?.images[0],
              id: item._id || item.id,
            })) ||
            res?.results?.map((item) => ({
              name: item.name,
              img: item?.images[0],
              id: item._id || item.id,
            })) ||
            [];
          setSuggestions(suggestionList);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
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

  const handleCategoryClick = (category) => {
    setSearchQuery(category);
    setSuggestions([]); 
    search(category); 
  };
  
  const search = (queryToSearch = searchQuery) => { 
    if (queryToSearch !== '') { 
      setIsLoading(true);
      const obj = {
        page: 1,
        limit: 3,
        query: queryToSearch, 
      };
      postData(`/api/product/search/get`, obj).then((res) => {
        context?.setSearchData(res);
        router.refresh();
        setIsLoading(false);
        context?.setOpenSearchPanel(false);
        router.push('/search');
      });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.id) {
      setSearchQuery(suggestion.name);
      setSuggestions([]);
      router.push(`/product/${suggestion.id}`); 
    } else {
      console.warn('No product ID available for:', suggestion.name);
      setSearchQuery(suggestion.name);
      setSuggestions([]);
      search();
    }
  };

  return (
    <div className="searchBox w-[100%] h-[50px] bg-[#e5e5e5] rounded-[5px] relative p-2">
      <input
        type="text"
        placeholder={t('header.searchPlaceholder')}
        className="w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px]"
        value={searchQuery}
        onChange={onChangeInput}
        onFocus={() => setIsOpenSuggestions(true)}
        onBlur={() => {
          setTimeout(() => {
            setIsOpenSuggestions(false);
            setSuggestions([]);
          }, 200); 
        }}
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
      {isOpenSuggestions === true && (
        <div className="absolute top-[50px] left-0 w-full bg-white rounded-md rounded-t-none rounded-b-md shadow-lg z-50 max-h-[200px] overflow-y-auto">
          {!suggestions.length && (
            <div className="p-3 box">
              <h3>Popular Searches</h3>
              <ul className="flex flex-wrap gap-2 mt-2">
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

          {suggestions.length > 0 &&
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="img w-[35px] h-[35px] rounded-sm border border-[rgba(0,0,0,0.1)] p-1 bg-white">
                  <img
                    src={suggestion?.img}
                    className="object-cover w-full h-full"
                    alt={suggestion.name}
                  />
                </div>
                <span className="text-[14px]"> {suggestion.name}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Search;
