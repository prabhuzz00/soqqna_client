import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import Link from 'next/link';
import { Button } from '@mui/material';
import { IoIosArrowDown } from "react-icons/io";
import { Collapse } from "react-collapse";
import { RiGridFill } from "react-icons/ri";
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
                                <li className="list-none relative w-full group border border-t-0 border-r-0 border-l-0 border-b-slate-100" key={index}>
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
                                            <div className="submenu w-full bg-white py-5">

                                                <h3 className="pl-3">SHOP BY CATEGORY</h3>

                                                <div className="grid grid-cols-4 mt-4 gap-4">
                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden bg-gray-200">
                                                            <RiGridFill size={30} className="hover:!text-primary" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">View All</h4>
                                                    </Link>

                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742452096038_thth1.jpg" className="w-full h-full object-cover transition" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">New In</h4>
                                                    </Link>

                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742452035507_rtrt1.jpg" className="w-full h-full object-cover" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">Top Rated</h4>
                                                    </Link>


                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742447215241_blubags-waterproof-school-backpack-36-l-laptop-bag-college-backpack-school-bag-product-images-rvxyzquw2b-0-202312201359.webp" className="w-full h-full object-cover" />

                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">Top Bags</h4>
                                                    </Link>


                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742445932012_paragon-puk7014l-women-sandals-casual-everyday-sandals-stylish-comfortable-durable-for-daily-occasion-wear-product-images-rvy1o3iatj-0-202309191612.jpg" className="w-full h-full object-cover" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">Top Sandels</h4>
                                                    </Link>



                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742439142762_gespo-peach-solid-mandarin-collar-half-sleeve-casual-t-shirt-product-images-rvrtzhyumb-0-202304080900.webp" className="w-full h-full object-cover" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">Men T-Shirts</h4>
                                                    </Link>

                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742439426966_modestouze-attires-women-s-mukaish-worked-ethnic-jacket-with-top-and-pant-set-product-images-rvziicqwq6-0-202403231855.jpg" className="w-full h-full object-cover" />

                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">New Arrivals</h4>
                                                    </Link>

                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742439504084_deel-band-women-rayon-embroidered-kurta-pant-dupatta-set-product-images-rvz2bvyrm2-0-202404071602.webp" className="w-full h-full object-cover" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">Girls Suits</h4>
                                                    </Link>


                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742439887415_miss-ayse-women-s-multicolor-crepe-printed-top-product-images-rvvlrud6qm-0-202410111253.webp" className="w-full h-full object-cover" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">Girls Tops</h4>
                                                    </Link>

                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742451878625_gosriki-women-s-pink-ethnic-motifs-printed-kurta-with-trouser-dupatta-product-images-rvpkyh5qdr-4-202310141511.jpg" className="w-full h-full object-cover" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">Girls Kurta</h4>
                                                    </Link>


                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742452096038_thth1.jpg" className="w-full h-full object-cover" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">New In</h4>
                                                    </Link>

                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742452035507_rtrt1.jpg" className="w-full h-full object-cover" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">Top Rated</h4>
                                                    </Link>


                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742447215241_blubags-waterproof-school-backpack-36-l-laptop-bag-college-backpack-school-bag-product-images-rvxyzquw2b-0-202312201359.webp" className="w-full h-full object-cover" />

                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">Top Bags</h4>
                                                    </Link>


                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742445932012_paragon-puk7014l-women-sandals-casual-everyday-sandals-stylish-comfortable-durable-for-daily-occasion-wear-product-images-rvy1o3iatj-0-202309191612.jpg" className="w-full h-full object-cover" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">Top Sandels</h4>
                                                    </Link>



                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742439142762_gespo-peach-solid-mandarin-collar-half-sleeve-casual-t-shirt-product-images-rvrtzhyumb-0-202304080900.webp" className="w-full h-full object-cover" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">Men T-Shirts</h4>
                                                    </Link>

                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742439426966_modestouze-attires-women-s-mukaish-worked-ethnic-jacket-with-top-and-pant-set-product-images-rvziicqwq6-0-202403231855.jpg" className="w-full h-full object-cover" />

                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">New Arrivals</h4>
                                                    </Link>

                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742439504084_deel-band-women-rayon-embroidered-kurta-pant-dupatta-set-product-images-rvz2bvyrm2-0-202404071602.webp" className="w-full h-full object-cover" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">Girls Suits</h4>
                                                    </Link>


                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742439887415_miss-ayse-women-s-multicolor-crepe-printed-top-product-images-rvvlrud6qm-0-202410111253.webp" className="w-full h-full object-cover" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">Girls Tops</h4>
                                                    </Link>

                                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                                            <img src="https://serviceapi.spicezgold.com/download/1742451878625_gosriki-women-s-pink-ethnic-motifs-printed-kurta-with-trouser-dupatta-product-images-rvpkyh5qdr-4-202310141511.jpg" className="w-full h-full object-cover" />
                                                        </div>
                                                        <h4 className="text-center text-[12px] hover:!text-primary">Girls Kurta</h4>
                                                    </Link>


                                                </div>


                                                {
                                                    //  <ul>
                                                    //         {cat?.children?.map((subCat, index_) => {
                                                    //             return (
                                                    //                 <li
                                                    //                     className="list-none w-full relative"
                                                    //                     key={index_}
                                                    //                 >
                                                    //                     <Link
                                                    //                         href={`/products?subCatId=${subCat?._id}`}
                                                    //                         className="w-full"
                                                    //                     >
                                                    //                         <Button className="!text-[rgba(0,0,0,0.8)]  w-full !text-left !justify-start !rounded-none !text-gray-800 hover:!text-primary !py-2 !capitalize">
                                                    //                             {subCat?.name}
                                                    //                         </Button>
                                                    //                     </Link>

                                                    //                     {subCat?.children?.length !== 0 && (
                                                    //                         <div className="submenu w-full bg-white transition-all">
                                                    //                             <ul>
                                                    //                                 {subCat?.children?.map(
                                                    //                                     (thirdLavelCat, index__) => {
                                                    //                                         return (
                                                    //                                             <li
                                                    //                                                 className="list-none w-full"
                                                    //                                                 key={index__}
                                                    //                                             >
                                                    //                                                 <Link
                                                    //                                                     href={`/products?thirdLavelCatId=${thirdLavelCat?._id}`}
                                                    //                                                     className="w-full"
                                                    //                                                 >
                                                    //                                                     <Button className="!text-[rgba(0,0,0,0.8)]  w-full !text-left !justify-start !rounded-none !text-gray-800 hover:!text-primary !py-2 ">
                                                    //                                                         {thirdLavelCat?.name}
                                                    //                                                     </Button>
                                                    //                                                 </Link>
                                                    //                                             </li>
                                                    //                                         );
                                                    //                                     }
                                                    //                                 )}
                                                    //                             </ul>
                                                    //                         </div>
                                                    //                     )}
                                                    //                 </li>
                                                    //             );
                                                    //         })}
                                                    //     </ul>
                                                }
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