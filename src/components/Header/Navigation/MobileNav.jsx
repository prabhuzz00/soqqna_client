"use client"
import { Button } from '@mui/material'
import React, { useContext, useEffect } from 'react';
import { IoHomeOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { LuHeart } from "react-icons/lu";
import { BsBagCheck } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { NavLink } from "react-router";
import { MdOutlineFilterAlt } from "react-icons/md";
import { MyContext } from '@/context/ThemeProvider';
import { usePathname } from "next/navigation";
import Link from 'next/link';


const MobileNav = () => {

    const context = useContext(MyContext);
    const pathname = usePathname();

    useEffect(() => {

        if (pathname === "/products" || pathname === "/search") {
            context?.setisFilterBtnShow(true)
            // Perform your action here
        } else {
            context?.setisFilterBtnShow(false)
        }
    }, [pathname]);

    const openFilters = () => {
        context?.setOpenFilter(true);
        context?.setOpenSearchPanel(false)
    }


    return (
        <div className='mobileNav bg-white p-1 px-3 w-full flex items-center justify-between fixed bottom-0 left-0 gap-0 z-[51]'>
            <Link href="/" className={pathname === "/" ? "active" : ""} onClick={() => context?.setOpenSearchPanel(false)}>
                <Button className="flex-col !w-[40px] !min-w-[40px] !capitalize !text-gray-700">
                    <IoHomeOutline size={18} />
                    <span className='text-[12px]'>Home</span>
                </Button>
            </Link>


            {
                context?.isFilterBtnShow === true &&
                <Button className="flex-col !w-[40px] !h-[40px] !min-w-[40px] !capitalize !text-gray-700 !bg-primary !rounded-full" onClick={openFilters}>
                    <MdOutlineFilterAlt size={18} className='text-white' />
                </Button>
            }

            <Button className="flex-col !w-[40px] !min-w-[40px] !capitalize !text-gray-700"
                onClick={() => context?.setOpenSearchPanel(true)}>
                <IoSearch size={18} />
                <span className='text-[12px]'>Search</span>
            </Button>




            <Link href="/my-list" className={pathname === "/my-list" ? "active" : ""} onClick={() => context?.setOpenSearchPanel(false)}>
                <Button className="flex-col !w-[40px] !min-w-[40px] !capitalize !text-gray-700">
                    <LuHeart size={18} />
                    <span className='text-[12px]'>Wishlist</span>
                </Button>
            </Link>


            <Link href="/my-orders" className={pathname === "/my-orders" ? "active" : ""} onClick={() => context?.setOpenSearchPanel(false)}>
                <Button className="flex-col !w-[40px] !min-w-[40px] !capitalize !text-gray-700">
                    <BsBagCheck size={18} />
                    <span className='text-[12px]'>Orders</span>
                </Button>
            </Link>


            {
                context?.isLogin === true &&
                <Link href="/my-account" className={pathname === "/my-account" ? "active" : ""} onClick={() => context?.setOpenSearchPanel(false)}>
                    <Button className="flex-col !w-[40px] !min-w-[40px] !capitalize !text-gray-700">
                        <FiUser size={18} />
                        <span className='text-[12px]'>Account</span>
                    </Button>
                </Link>
            }


        </div>
    )
}

export default MobileNav