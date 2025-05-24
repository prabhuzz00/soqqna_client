"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import AccountSidebar from "@/components/AccountSidebar";
import { Button } from "@mui/material";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Badge from "@/components/Badge";
import { downloadFile, fetchDataFromApi } from "@/utils/api";
import Pagination from "@mui/material/Pagination";
import Breadcrumb from "@/components/Breadcrumb";
import { MyContext } from "@/context/ThemeProvider";
import { useRouter } from "next/navigation";

const Orders = () => {
  const context = useContext(MyContext);
  const router = useRouter();
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [openModalOrder, setOpenModalOrder] = useState(null);

  useEffect(() => {
    if (context?.isLogin === false) {
      router.push("/login");
    }
  }, [context?.isLogin, router]);

  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    fetchDataFromApi(`/api/order/order-list/orders?page=${page}&limit=5`).then(
      (res) => {
        if (res?.error === false) {
          setOrders(res);
        }
      }
    );
  }, [page]);

  const handleInvoiceDownload = (orderId) => {
    const filename = `invoice-${orderId}.pdf`;
    downloadFile(`/api/order/invoice/${orderId}`, filename);
  };

  return (
    <>
      <Breadcrumb
        paths={[
          {
            label: "My Orders",
            href: `/`,
          },
        ]}
      />
      <section className="py-5 lg:py-10 w-full">
        <div className="container flex flex-col lg:flex-row gap-5">
          <div className="col1 w-[20%] hidden lg:block">
            <AccountSidebar />
          </div>

          <div className="col2 w-full lg:w-[80%]">
            <div className="shadow-md rounded-md bg-white">
              <div className="py-5 px-5 border-b border-[rgba(0,0,0,0.1)]">
                <h2>My Orders</h2>
                <p className="mt-0 mb-0">
                  There are{" "}
                  <span className="font-bold text-primary">
                    {orders?.data?.length}
                  </span>{" "}
                  orders
                </p>

                <div className="relative overflow-x-auto mt-5">
                  <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                           
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Order Id
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Payment Id
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Phone Number
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Address
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Pincode
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Total Amount
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          User Id
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Order Status
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Action
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Invoice
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders?.data?.length !== 0 &&
                        orders?.data?.map((order, index) => {
                          // Check if any product in this order has a selectedColor
                          const hasColor = order?.products?.some(
                            (item) => item?.selectedColor
                          );

                          return (
                            <>
                              <tr
                                key={index}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                              >
                                <td className="px-6 py-4 font-[500]">
                                  <Button
                                    className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]"
                                    onClick={() => isShowOrderdProduct(index)}
                                  >
                                    {isOpenOrderdProduct === index ? (
                                      <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                                    ) : (
                                      <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                                    )}
                                  </Button>
                                </td>
                                <td className="px-6 py-4 font-[500]">
                                  <span className="text-primary">
                                    {order?._id}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-[500]">
                                  <span className="text-primary whitespace-nowrap text-[13px]">
                                    {order?.paymentId
                                      ? order?.paymentId
                                      : "CASH ON DELIVERY"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-[500] whitespace-nowrap">
                                  {order?.userId?.name}
                                </td>
                                <td className="px-6 py-4 font-[500]">
                                  {order?.delivery_address?.mobile}
                                </td>
                                <td className="px-6 py-4 font-[500]">
                                  <span className="inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md">
                                    {order?.delivery_address?.addressType}
                                  </span>
                                  <span className="block w-[400px]">
                                    {order?.delivery_address?.address_line1 +
                                      " " +
                                      order?.delivery_address?.city +
                                      " " +
                                      order?.delivery_address?.landmark +
                                      " " +
                                      order?.delivery_address?.state +
                                      " " +
                                      order?.delivery_address?.country}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-[500]">
                                  {order?.delivery_address?.pincode}
                                </td>
                                <td className="px-6 py-4 font-[500]">
                                  {order?.totalAmt}
                                </td>
                                <td className="px-6 py-4 font-[500]">
                                  <span className="text-primary">
                                    {order?.userId?._id}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-[500]">
                                  <Badge status={order?.order_status} />
                                </td>
                                <td className="px-6 py-4 font-[500] whitespace-nowrap">
                                  {order?.createdAt?.split("T")[0]}
                                </td>
                                <td className="px-6 py-4 font-[500] whitespace-nowrap">
                                  <button
                                    onClick={() => setOpenModalOrder(order)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                                  >
                                    Track
                                  </button>
                                </td>
                                <td className="px-6 py-4 font-[500] whitespace-nowrap">
                                  <button
                                    onClick={() =>
                                      handleInvoiceDownload(order._id)
                                    }
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                                  >
                                    Download
                                  </button>
                                </td>
                              </tr>

                              {isOpenOrderdProduct === index && (
                                <tr>
                                  <td className="pl-20" colSpan="13">
                                    <div className="relative overflow-x-auto">
                                      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                          <tr>
                                            <th
                                              scope="col"
                                              className="px-6 py-3 whitespace-nowrap"
                                            >
                                              Product Id
                                            </th>
                                            <th
                                              scope="col"
                                              className="px-6 py-3 whitespace-nowrap"
                                            >
                                              Product Title
                                            </th>
                                            <th
                                              scope="col"
                                              className="px-6 py-3 whitespace-nowrap"
                                            >
                                              Image
                                            </th>
                                            {hasColor && (
                                              <>
                                                <th
                                                  scope="col"
                                                  className="px-6 py-3 whitespace-nowrap"
                                                >
                                                  Color
                                                </th>
                                                <th
                                                  scope="col"
                                                  className="px-6 py-3 whitespace-nowrap"
                                                >
                                                  Size
                                                </th>
                                              </>
                                            )}
                                            <th
                                              scope="col"
                                              className="px-6 py-3 whitespace-nowrap"
                                            >
                                              Quantity
                                            </th>
                                            <th
                                              scope="col"
                                              className="px-6 py-3 whitespace-nowrap"
                                            >
                                              Price
                                            </th>
                                            <th
                                              scope="col"
                                              className="px-6 py-3 whitespace-nowrap"
                                            >
                                              Sub Total
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {order?.products?.map(
                                            (item, index) => {
                                              return (
                                                <tr
                                                  key={index}
                                                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                >
                                                  <td className="px-6 py-4 font-[500]">
                                                    <span className="text-gray-600">
                                                      {item?._id}
                                                    </span>
                                                  </td>
                                                  <td className="px-6 py-4 font-[500]">
                                                    <div className="w-[200px]">
                                                      {item?.name}
                                                    </div>
                                                  </td>
                                                  <td className="px-6 py-4 mortgaged-[500]">
                                                    <img
                                                      src={item?.image}
                                                      className="w-[40px] h-[40px] object-cover rounded-md"
                                                      alt="Product"
                                                    />
                                                  </td>
                                                  {hasColor && (
                                                    <>
                                                      <td className="px-6 py-4 font-[500]">
                                                        <div className="w-[100px]">
                                                          {item?.selectedColor ||
                                                            "-"}
                                                        </div>
                                                      </td>
                                                      <td className="px-6 py-4 font-[500]">
                                                        <div className="w-[100px]">
                                                          {item?.size || "-"}
                                                        </div>
                                                      </td>
                                                    </>
                                                  )}
                                                  <td className="px-6 py-4 font-[500] whitespace-nowrap">
                                                    {item?.quantity}
                                                  </td>
                                                  <td className="px-6 py-4 font-[500]">
                                                    {item?.price?.toLocaleString(
                                                      "en-US",
                                                      {
                                                        style: "currency",
                                                        currency: "USD",
                                                      }
                                                    )}
                                                  </td>
                                                  <td className="px-6 py-4 font-[500]">
                                                    {(
                                                      item?.price *
                                                      item?.quantity
                                                    )?.toLocaleString("en-US", {
                                                      style: "currency",
                                                      currency: "USD",
                                                    })}
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )}
                                          <tr>
                                            <td
                                              className="bg-[#f1f1f1]"
                                              colSpan={hasColor ? 8 : 6}
                                            ></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                {openModalOrder && (
                  <div className="fixed inset-0 ordmodal flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[800px] p-6 relative overflow-y-auto max-h-[90vh]">
                      <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-black"
                        onClick={() => setOpenModalOrder(null)}
                      >
                        Close
                      </button>

                      {/* Shipment Tracking */}
                      <h2 className="text-2xl font-bold mb-6">
                        Shipment Tracking
                      </h2>
                      <div className="flex items-center justify-between mb-8 relative">
                        {openModalOrder?.statusHistory?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center text-center relative w-full"
                          >
                            {idx !==
                              openModalOrder.statusHistory.length - 1 && (
                              <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-300 z-0"></div>
                            )}
                            <div className="relative z-10 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center mb-2 mx-auto">
                              ✓
                            </div>
                            <p className="text-sm font-medium capitalize">
                              {item.status}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(item.updatedAt).toLocaleDateString()}
                              <br />
                              {new Date(item.updatedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Details */}
                      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                      <p className="text-gray-600 mb-2">
                        Order placed{" "}
                        {new Date(
                          openModalOrder?.createdAt
                        ).toLocaleDateString()}{" "}
                        | Order number {openModalOrder?._id}
                      </p>

                      <div className="border rounded-md p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h3 className="font-bold mb-2">Ship to</h3>
                          <p>{openModalOrder?.delivery_address?.full_name}</p>
                          <p>
                            {openModalOrder?.delivery_address?.address_line1}
                          </p>
                          <p>
                            {openModalOrder?.delivery_address?.city},{" "}
                            {openModalOrder?.delivery_address?.state}{" "}
                            {openModalOrder?.delivery_address?.pincode}
                          </p>
                          <p>{openModalOrder?.delivery_address?.country}</p>
                        </div>
                        <div>
                          <h3 className="font-bold mb-2">Payment Methods</h3>
                          <p>
                            {openModalOrder?.payment_type || "Cash on Delivery"}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-bold mb-2">Order Summary</h3>
                          <div className="space-y-1">
                            <p>
                              Item(s) Subtotal: ₹
                              {openModalOrder?.subtotal ||
                                openModalOrder?.totalAmt}
                            </p>
                            <p>Shipping: ₹0.00</p>
                            <p>
                              Cash/Pay on Delivery Fee: ₹
                              {openModalOrder?.cod_fee || 0}
                            </p>
                            <p>Total: ₹{openModalOrder?.totalAmt}</p>
                            <p className="font-bold">
                              Grand Total: ₹{openModalOrder?.totalAmt}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {orders?.totalPages > 1 && (
                  <div className="flex items-center justify-center mt-10">
                    <Pagination
                      showFirstButton
                      showLastButton
                      count={orders?.totalPages}
                      page={page}
                      onChange={(e, value) => setPage(value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Orders;
