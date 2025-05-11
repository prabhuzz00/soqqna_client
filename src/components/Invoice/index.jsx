"use client";
import React from "react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

const Invoice = React.forwardRef(({ order }, ref) => {
  if (!order) return null;

  const discount = order.totalAmt * 0.1;
  const taxable = order.totalAmt - discount;
  const cgst = taxable * 0.09;
  const sgst = taxable * 0.09;
  const total = taxable + cgst + sgst;

  return (
    <div
      ref={ref}
      style={{ padding: "20px", width: "800px", background: "#fff" }}
    >
      <h2 style={{ textAlign: "center" }}>Invoice</h2>
      <p>
        <strong>Order ID:</strong> {order._id}
      </p>
      <p>
        <strong>Customer:</strong> {order.userId?.name}
      </p>
      <p>
        <strong>Address:</strong> {order.delivery_address?.address_line1},{" "}
        {order.delivery_address?.city}
      </p>

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Item</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Qty</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Price</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((item, idx) => (
            <tr key={idx}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {item.productTitle}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {item.quantity}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {formatCurrency(item.price)}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {formatCurrency(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <p>Subtotal: {formatCurrency(order.totalAmt)}</p>
        <p>Discount: {formatCurrency(discount)}</p>
        <p>Taxable: {formatCurrency(taxable)}</p>
        <p>CGST (9%): {formatCurrency(cgst)}</p>
        <p>SGST (9%): {formatCurrency(sgst)}</p>
        <h3>Total: {formatCurrency(total)}</h3>
      </div>
    </div>
  );
});

export default Invoice;
