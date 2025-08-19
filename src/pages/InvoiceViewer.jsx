// InvoiceViewer.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function formatIST(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function InvoiceViewer() {
  const { orderId } = useParams();
  const { axios } = useAppContext();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}/invoice`);
        setInvoice(response.data.invoice);
      } catch (err) {
        console.error("Failed to fetch invoice:", err);
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [orderId, axios]);

const handlePrint = () => {
  if (printRef.current) {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Medical Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; margin: 0; color: #000; }
            .text-center { text-align: center; }
            .border-b-2 { border-bottom: 2px solid #2563eb; }
            .pb-6 { padding-bottom: 24px; }
            .mb-6 { margin-bottom: 24px; }
            .text-2xl { font-size: 24px; }
            .text-3xl { font-size: 30px; }
            .font-bold { font-weight: bold; }
            .text-blue-600 { color: #2563eb; }
            .text-sm { font-size: 14px; }
            .text-xs { font-size: 12px; }
            .text-gray-600 { color: #666; }
            .text-gray-500 { color: #999; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .gap-6 { gap: 24px; }
            .font-semibold { font-weight: 600; }
            .text-gray-800 { color: #333; }
            .mb-3 { margin-bottom: 12px; }
            .space-y-1 > * + * { margin-top: 4px; }
            .font-medium { font-weight: 500; }
            table { border-collapse: collapse; width: 100%; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f8fafc; font-weight: 600; text-transform: uppercase; font-size: 12px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .border-t { border-top: 1px solid #ddd; }
            .pt-4 { padding-top: 16px; }
            .w-80 { width: 320px; }
            .space-y-2 > * + * { margin-top: 8px; }
            .text-red-600 { color: #dc2626; }
            .text-lg { font-size: 18px; }
            .pt-2 { padding-top: 8px; }
            .mt-8 { margin-top: 32px; }
            .pt-6 { padding-top: 24px; }
            .mt-1 { margin-top: 4px; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .flex-col { flex-direction: column; }
            .items-end { align-items: flex-end; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  }
};


  const handleDownload = () => {
    if (printRef.current) {
      const element = document.createElement("a");
      const html = `
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Medical Invoice</title>
          </head>
          <body>${printRef.current.innerHTML}</body>
        </html>
      `;
      const blob = new Blob([html], { type: "text/html" });
      element.href = URL.createObjectURL(blob);
      element.download = `medical-invoice-${invoice.invoiceNumber || orderId}.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleSend = () => {
    if (!invoice) return;
    const subject = `Medical Invoice #${invoice.invoiceNumber}`;
    let body = `Medical Invoice%0D%0A%0D%0AInvoice Number: ${invoice.invoiceNumber}%0D%0APatient: ${invoice.customerName}%0D%0APhone: ${invoice.customerPhone}%0D%0ADate: ${formatIST(invoice.date)}%0D%0A%0D%0APrescribed Items:%0D%0A`;
    invoice.items?.forEach((item, idx) => {
      body += `${idx + 1}. ${item.itemName} x${item.quantity} @ ₹${item.unitPrice} = ₹${item.totalPrice}%0D%0A`;
    });
    body += `%0D%0ATotal Amount: ₹${invoice.grandTotal || invoice.total || invoice.totalAmount || "N/A"}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${body}`);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading invoice...</div>;
  if (!invoice) return <div className="flex justify-center items-center min-h-screen text-red-600">Invoice not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
          <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            🖨️ Print
          </button>
          <button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            📥 Download
          </button>
          <button onClick={handleSend} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            📧 Send
          </button>
        </div>

        {/* Invoice */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div ref={printRef} className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center border-b-2 border-blue-600 pb-6 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">MEDICAL CLINIC</h1>
              <p className="text-sm text-gray-600">📍 123 Health Street, Medical District</p>
              <p className="text-sm text-gray-600">📞 +91-9876543210 | 📧 clinic@medical.com</p>
              <p className="text-xs text-gray-500 mt-2">Reg. No: MED12345 | License: DL-2024-001</p>
            </div>

            {/* Invoice Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">📋 Invoice Details</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}</p>
                  <p><span className="font-medium">Order #:</span> {invoice.orderNumber}</p>
                  <p><span className="font-medium">Date:</span> {formatIST(invoice.date)}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">👤 Patient Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {invoice.customerName}</p>
                  <p><span className="font-medium">Phone:</span> {invoice.customerPhone}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">💊 Prescribed Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">#</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase">Item Name</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-700 uppercase hidden sm:table-cell">Category</th>
                      <th className="p-3 text-center text-xs font-medium text-gray-700 uppercase">Qty</th>
                      <th className="p-3 text-right text-xs font-medium text-gray-700 uppercase">Rate</th>
                      <th className="p-3 text-right text-xs font-medium text-gray-700 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-3 text-sm">{idx + 1}</td>
                        <td className="p-3 text-sm font-medium">{item.itemName}</td>
                        <td className="p-3 text-sm text-gray-600 hidden sm:table-cell">{item.category || "-"}</td>
                        <td className="p-3 text-sm text-center">{item.quantity}</td>
                        <td className="p-3 text-sm text-right">₹{item.unitPrice}</td>
                        <td className="p-3 text-sm text-right font-medium">₹{item.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-4">
              <div className="flex flex-col sm:items-end">
                <div className="w-full sm:w-80 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{invoice.subtotal ?? "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Discount ({invoice.discount}%):</span>
                    <span>-₹{invoice.discountAmount ?? "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax ({invoice.tax}%):</span>
                    <span>₹{invoice.totalAmount ?? "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Grand Total:</span>
                    <span className="text-blue-600">₹{invoice.grandTotal || invoice.total || invoice.totalAmount || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t text-center text-xs text-gray-500">
              <p>Thank you for choosing our medical services!</p>
              <p className="mt-1">For any queries, please contact us at the above details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
