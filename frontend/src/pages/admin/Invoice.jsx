import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react"; // Import X icon

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Add navigate hook
  const passedOrder = location.state?.order;
  const orderId = passedOrder?.id || passedOrder?._id;
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/order/getOrder/${orderId}`
        );
        setOrderData(res.data.data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  if (!orderData) {
    return (
      <div className="p-8 text-center text-lg text-red-600">
        No order data found. Please navigate from the order management page.
      </div>
    );
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const subTotal = orderData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate total shipping price
  const totalShippingPrice = orderData.items.reduce(
    (sum, item) => sum + (item.product?.shippingPrice || 0) * item.quantity,
    0
  );

  const totalValue = subTotal + totalShippingPrice;
  const invoiceValue = subTotal + totalShippingPrice;

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            z-index: 9999;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto p-6 bg-white text-black border border-gray-300 shadow-md text-sm font-sans">
        <div className="flex justify-between items-center mb-4 print:hidden">
          {/* Close button on the left */}
          <button
            onClick={handleClose}
            className="bg-red-600 text-white p-2 rounded hover:bg-red-700 flex items-center justify-center"
            title="Close Invoice"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Print button on the right */}
          <button
            onClick={() => window.print()}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Print Invoice
          </button>
        </div>

        <div id="invoice-content">
          <h2 className="text-xl font-bold mb-2">Order Invoice</h2>
          <div className="flex justify-between mb-2">
            <div>
              <p className="font-semibold">Invoice No: {orderData.invoiceId}</p>
              <p className="font-semibold">Order ID: {orderData._id}</p>
              <p>{formatDate(orderData.createdAt)}</p>
            </div>

            <div className="text-right space-y-1 text-sm">
              <p>
                <strong>Status:</strong> {orderData.orderStatus}
              </p>
              <p>
                <strong>Payment Method:</strong> {orderData.paymentMethod}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    orderData.paymentStatus === "paid"
                      ? "text-green-600"
                      : orderData.paymentStatus === "pending"
                      ? "text-amber-600"
                      : orderData.paymentStatus === "failed"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {orderData.paymentStatus}
                </span>
              </p>
            </div>
          </div>

          <table className="w-full border mt-4 mb-6">
            <thead className="bg-gray-100 border-b text-center">
              <tr>
                <th className="border px-2 py-1">S.no</th>
                <th className="border px-2 py-1">Item Name</th>
                <th className="border px-2 py-1">HSN</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Shipping Price</th>
                <th className="border px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {orderData.items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">{item.product?.name}</td>
                  <td className="border px-2 py-1">{item.product?.hsnCode}</td>
                  <td className="border px-2 py-1">{item.quantity}</td>
                  <td className="border px-2 py-1">₹{item.price}</td>
                  <td className="border px-2 py-1">
                    ₹{item.product?.shippingPrice || 0}
                  </td>
                  <td className="border px-2 py-1">
                    ₹
                    {item.price * item.quantity +
                      (item.product?.shippingPrice || 0) * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mb-6 space-y-1 pr-2 text-sm">
            <p>
              <strong>Sub Total</strong>: ₹{subTotal}
            </p>
            <p>
              <strong>Total Shipping</strong>: ₹{totalShippingPrice}
            </p>
            <p className="font-bold text-base">
              Invoice Value: ₹{invoiceValue}
            </p>
          </div>

          <table className="w-full border mt-4 mb-6">
            <thead className="bg-gray-100 border-b text-center">
              <tr>
                <th className="border px-2 py-1">S.no</th>
                <th className="border px-2 py-1">Item</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Shipping Price</th>
                <th className="border px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {orderData.items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">{item.product?.name}</td>
                  <td className="border px-2 py-1">{item.quantity}</td>
                  <td className="border px-2 py-1">
                    ₹{item.price * item.quantity}
                  </td>
                  <td className="border px-2 py-1">
                    ₹{(item.product?.shippingPrice || 0) * item.quantity}
                  </td>
                  <td className="border px-2 py-1">
                    ₹
                    {item.price * item.quantity +
                      (item.product?.shippingPrice || 0) * item.quantity}
                  </td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={5} className="text-right border px-2 py-1">
                  Total Invoice Value
                </td>
                <td className="border px-2 py-1">₹{invoiceValue}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Invoice;
