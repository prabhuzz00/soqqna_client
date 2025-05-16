import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import Link from 'next/link';
import { Button } from '@mui/material';
import { IoIosArrowDown } from "react-icons/io";
import { Collapse } from "react-collapse";

const MobileMenu = ({ catData, isOpenMobileMenu, openMobileMenu }) => {

    const [submenuIndex, setSubmenuIndex] = useState(null);
    const [submenuToggle, setSubmenuToggle] = useState(false);

    const isOpenSubmenu = (index) => {
        setSubmenuIndex(index)
        setSubmenuToggle(!submenuToggle)
    }


    return (
        <>
            <div className={`mobileMenu w-[80%] h-[100%] fixed top-0 left-[-100%] opacity-0 bg-white z-[101] transition-all ${isOpenMobileMenu === true && 'left-[0px] opacity-100'}`}>
                <div className='logoWrapper p-3'>
                    <img src={Cookies.get('logo')} className='w-[100px]' />
                </div>

                <ul className="w-full mb-0 p-2 max-h-[80vh] overflow-y-scroll">
                    {catData?.length !== 0 && catData?.filter((cat, idx) => idx < 8)
                        ?.map((cat, index) => {
                            return (
                                <li className="list-none relative w-full group" key={index}>
                                    <Link
                                        href={`/products?catId=${cat?._id}`}
                                        className="link transition text-[14px] !font-[500]"
                                    >
                                        <Button className="link transition !font-[500] !text-gray-800 hover:!text-primary !py-2 !w-full !text-left !justify-start !capitalize">
                                            <img src={cat?.images[0]} alt="image" className="w-[20px] mr-2" />
                                            {cat?.name}

                                        </Button>
                                    </Link>


                                    {
                                        cat?.children?.length !== 0 &&
                                        <span className="ml-auto absolute top-[10px] right-[0px] z-[100] block w-[30px] h-[30px]" onClick={() => isOpenSubmenu(index)}>
                                            <IoIosArrowDown size={18} />
                                        </span>
                                    }


                                    {cat?.children?.length !== 0 && (
                                        <Collapse isOpened={submenuIndex === index && submenuToggle}>
                                            <div className="submenu w-full bg-white">
                                                <ul>
                                                    {cat?.children?.map((subCat, index_) => {
                                                        return (
                                                            <li
                                                                className="list-none w-full relative"
                                                                key={index_}
                                                            >
                                                                <Link
                                                                    href={`/products?subCatId=${subCat?._id}`}
                                                                    className="w-full"
                                                                >
                                                                    <Button className="!text-[rgba(0,0,0,0.8)]  w-full !text-left !justify-start !rounded-none !text-gray-800 hover:!text-primary !py-2 !capitalize">
                                                                        {subCat?.name}
                                                                    </Button>
                                                                </Link>

                                                                {subCat?.children?.length !== 0 && (
                                                                    <div className="submenu w-full bg-white transition-all">
                                                                        <ul>
                                                                            {subCat?.children?.map(
                                                                                (thirdLavelCat, index__) => {
                                                                                    return (
                                                                                        <li
                                                                                            className="list-none w-full"
                                                                                            key={index__}
                                                                                        >
                                                                                            <Link
                                                                                                href={`/products?thirdLavelCatId=${thirdLavelCat?._id}`}
                                                                                                className="w-full"
                                                                                            >
                                                                                                <Button className="!text-[rgba(0,0,0,0.8)]  w-full !text-left !justify-start !rounded-none !text-gray-800 hover:!text-primary !py-2 ">
                                                                                                    {thirdLavelCat?.name}
                                                                                                </Button>
                                                                                            </Link>
                                                                                        </li>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </Collapse>
                                    )}
                                </li>
                            );
                        })}
                </ul>


                <div className="px-3 mt-4 grid grid-cols-2 gap-2">
                    <Link href="https://seller.soouqna.com">
                        <Button className="flex w-full gap-3 btn-org btn-dark !px-2 !py-2 !text-[11px]">
                            Become Vendor
                        </Button>
                    </Link>

                    <Link href="/login">
                        <Button className="flex w-full gap-3 btn-org !px-2 !py-2 !text-[11px]">
                            Login
                        </Button>
                    </Link>
                </div>
            </div>

            {
                isOpenMobileMenu === true &&
                <div className="mobileMenuOverlay fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] w-full h-[100%] z-[100]" onClick={() => openMobileMenu(false)}></div>
            }

        </>
    )
}

export default MobileMenu