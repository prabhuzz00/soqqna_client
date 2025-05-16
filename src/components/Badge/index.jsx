"use client";
import React from "react";
import { IoMdCheckmark } from "react-icons/io";

const statusStyles = {
  Pending: "bg-primary text-white",
  Confirm: "bg-green-500 text-white",
  Delivered: "bg-green-700 text-white",
  Received: "bg-blue-500 text-white",
  Picked: "bg-yellow-500 text-black",
  "In-Transit": "bg-orange-400 text-white",
  "Out for Delivery": "bg-indigo-500 text-white",
  Canceled: "bg-red-500 text-white",
};

const Badge = ({ status }) => {
  const style = statusStyles[status] || "bg-gray-300 text-black";

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 py-1 px-4 rounded-full text-[11px] capitalize ${style}`}
    >
      {status === "Delivered" && <IoMdCheckmark size={13} />}
      {status}
    </span>
  );
};

export default Badge;
