"use client";
import React from "react";

const InvoiceTemplate = ({ order }) => {
  const formatCurrency = (amount) =>
    amount?.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  const totalAmount = order?.totalAmt || 0;
  const discount = 0.1 * totalAmount;
  const taxable = totalAmount - discount;
  const cgst = taxable * 0.09;
  const sgst = taxable * 0.09;
  const finalTotal = taxable + cgst + sgst;

  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: "2rem",
        width: "800px",
        background: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Invoice</h2>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h3>Foobar Labs</h3>
          <p>Address: 46 Raghavpur, Bangalore</p>
        </div>
        <div>
          <h3>Customer</h3>
          <p>{order?.userId?.name}</p>
          <p>
            {order?.delivery_address?.address_line1},{" "}
            {order?.delivery_address?.city}
          </p>
        </div>
      </div>

      <table
        width="100%"
        style={{ marginTop: "1rem", borderCollapse: "collapse" }}
      >
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th style={cell}>Item</th>
            <th style={cell}>Qty</th>
            <th style={cell}>Price</th>
            <th style={cell}>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((item, idx) => (
            <tr key={idx}>
              <td style={cell}>{item.productTitle}</td>
              <td style={cell}>{item.quantity}</td>
              <td style={cell}>{formatCurrency(item.price)}</td>
              <td style={cell}>{formatCurrency(item.quantity * item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "1rem", textAlign: "right" }}>
        <p>Subtotal: {formatCurrency(totalAmount)}</p>
        <p>Discount: -{formatCurrency(discount)}</p>
        <p>Taxable: {formatCurrency(taxable)}</p>
        <p>CGST: {formatCurrency(cgst)}</p>
        <p>SGST: {formatCurrency(sgst)}</p>
        <h3>Total: {formatCurrency(finalTotal)}</h3>
      </div>
    </div>
  );
};

const cell = {
  border: "1px solid #ccc",
  padding: "8px",
};

export default InvoiceTemplate;
