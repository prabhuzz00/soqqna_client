// src/utils/generateInvoice.js
"use client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generateInvoice = async (order) => {
  // Create a hidden container
  let container = document.getElementById("invoice-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "invoice-container";
    container.style.position = "absolute";
    container.style.top = "-9999px";
    container.style.left = "-9999px";
    container.style.width = "800px";
    document.body.appendChild(container);
  }

  container.innerHTML = renderInvoiceHTML(order);

  // Wait for DOM rendering
  await new Promise((res) => setTimeout(res, 500));

  const canvas = await html2canvas(container, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`invoice-${order._id}.pdf`);
};

function renderInvoiceHTML(order) {
  const format = (n) =>
    Number(n).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  const total = order?.totalAmt || 0;
  const discount = total * 0.1;
  const taxable = total - discount;
  const cgst = taxable * 0.09;
  const sgst = taxable * 0.09;
  const grandTotal = taxable + cgst + sgst;

  return `
    <div style="font-family: Arial; padding: 20px; background: #fff;">
      <h2 style="text-align: center;">INVOICE</h2>
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <strong>From:</strong>
          <p>The Fast Find</p>
          <p>Balasore, Odisha</p>
        </div>
        <div>
          <strong>To:</strong>
          <p>${order.userId?.name || "Customer"}</p>
          <p>${order.delivery_address?.address_line1}, ${
    order.delivery_address?.city
  }</p>
        </div>
      </div>

      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border:1px solid #ccc; padding:8px;">Item</th>
            <th style="border:1px solid #ccc; padding:8px;">Qty</th>
            <th style="border:1px solid #ccc; padding:8px;">Price</th>
            <th style="border:1px solid #ccc; padding:8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.products
            .map(
              (item) => `
            <tr>
              <td style="border:1px solid #ccc; padding:8px;">${
                item.productTitle
              }</td>
              <td style="border:1px solid #ccc; padding:8px;">${
                item.quantity
              }</td>
              <td style="border:1px solid #ccc; padding:8px;">${format(
                item.price
              )}</td>
              <td style="border:1px solid #ccc; padding:8px;">${format(
                item.quantity * item.price
              )}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div style="margin-top: 20px; text-align: right;">
        <p>Subtotal: ${format(total)}</p>
        <p>Discount: -${format(discount)}</p>
        <p>Taxable Amount: ${format(taxable)}</p>
        <p>CGST (9%): ${format(cgst)}</p>
        <p>SGST (9%): ${format(sgst)}</p>
        <h3>Total: ${format(grandTotal)}</h3>
      </div>
    </div>
  `;
}
