"use client";
import React from "react";
import AccountSidebar from "@/components/AccountSidebar";
import { useContext } from "react";
import { MyContext } from "@/context/ThemeProvider";

import { useState } from "react";

import { useEffect } from "react";
import AddressBox from "./addressBox";
import { deleteData, fetchDataFromApi } from "@/utils/api";
import Breadcrumb from "@/components/Breadcrumb";
import { useRouter } from "next/navigation";
// import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";

const label = { inputProps: { "aria-label": "Radio demo" } };

const Address = () => {
  const [address, setAddress] = useState([]);

  const context = useContext(MyContext);
  const router = useRouter();

  // Simple authentication check
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = Cookies.get("accessToken");

    if (!token) {
      router.push("/login");
      return;
    }

    setTimeout(() => {
      setIsCheckingAuth(false);
    }, 500);
  });

  // Handle context changes after initial load
  useEffect(() => {
    if (context?.isLogin === false) {
      router.push("/login");
    }
  });

  useEffect(() => {
    if (context?.windowWidth < 992) {
      window.scrollTo(0, 450);
    } else {
      window.scrollTo(0, 0);
    }

    if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
      console.log("Fetching address for user ", context?.userData);
      setAddress(context?.userData?.address_details);
    }
  }, [context?.userData]);

  const removeAddress = (id) => {
    deleteData(`/api/address/${id}`).then((res) => {
      fetchDataFromApi(
        `/api/address/get?userId=${context?.userData?._id}`
      ).then((res) => {
        console.log("Address removed successfully", res);
        setAddress(res.data);
        context?.getUserDetails();
      });
    });
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        paths={[
          {
            label: "Address",
            href: `/`,
          },
        ]}
      />
      <section className="py-5 lg:py-10 w-full">
        <div className="container flex flex-col md:flex-row gap-5">
          <div className="col1 w-full  md:w-[30%] lg:w-[20%]">
            <AccountSidebar />
          </div>

          <div className="col2 w-full md:w-[70%] lg:w-[50%]">
            <div className="card bg-white p-5 shadow-md rounded-md mb-5">
              <div className="flex items-center pb-3">
                <h2 className="pb-0">Address</h2>
              </div>
              <hr />

              <div
                className="flex items-center justify-center p-5 rounded-md border border-dashed border-[rgba(0,0,0,0.2)] bg-[#f1faff] hover:bg-[#e7f3f9] cursor-pointer"
                onClick={() => {
                  context?.setOpenAddressPanel(true);
                  context?.setAddressMode("add");
                }}
              >
                <span className="text-[14px] font-[500]">Add Address</span>
              </div>

              <div className="flex gap-2 flex-col mt-4">
                {address?.length > 0 &&
                  address?.map((address, index) => {
                    return (
                      <AddressBox
                        address={address}
                        key={index}
                        removeAddress={removeAddress}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Address;
