import React, { useEffect, useState } from "react";
import {
  Search,
  Package,
  Truck,
  ShoppingBag,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  FileText,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import {
  getOrderManagment,
  updateOrderByOrderId,
  updatePaymentStatusByOrderId,
} from "../../auth/ApiConnect";
import { useNavigate } from "react-router-dom";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "error":
        return <X className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "info":
        return <Eye className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${getToastStyles()} min-w-72 max-w-96`}
    >
      {getIcon()}
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [orderManagement, setOrderManagment] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    completedOrders: 0,
    disputeOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Toast helper function
  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleOpenImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrderManagment();
        if (response && response.data) {
          const transformedOrders = response.data.map((order) => ({
            id: order._id,
            orderId: order._id.slice(-6),
            customer: order.user.name,
            userPhone: order.shippingAddress.phone,
            fullName: order.shippingAddress.fullName,
            amount: order.totalAmount,
            status: order.orderStatus,
            date: order.createdAt,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            image: order.image,
            hasDispute: false,
            shippingAddress: order.shippingAddress,
            user: order.user,
            items: order.items.map((item) => ({
              id: item._id,
              name: item.product ? item.product.name : "Unknown Product",
              quantity: item.quantity,
              price: item.price,
            })),
          }));

          setOrders(transformedOrders);
          setOrderManagment({
            totalOrders: response.data.length,
            pendingOrders: response.data.filter(
              (o) => o.orderStatus === "processing"
            ).length,
            confirmedOrders: response.data.filter(
              (o) => o.orderStatus === "confirmed"
            ).length,
            completedOrders: response.data.filter(
              (o) => o.orderStatus === "delivered"
            ).length,
            disputeOrders: response.data.filter(
              (o) => o.orderStatus === "cancelled"
            ).length,
          });
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch orders:", err);
        showToast("Failed to fetch orders", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.userPhone &&
        order.userPhone.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order) => {
    console.log(order, "order");
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusDisplayName = (status) => {
    const statusMap = {
      processing: "Processing",
      confirmed: "Confirmed",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      pending: "Pending",
    };
    return (
      statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
    );
  };

  const getPaymentStatusDisplayName = (status) => {
    const statusMap = {
      paid: "Paid",
      pending: "Pending",
      failed: "Failed",
    };
    return (
      statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1)
    );
  };
  const handleStatusChange = async (orderId, newStatus) => {
    console.log("order", orderId, newStatus);
    const response = await updateOrderByOrderId(orderId, newStatus);
    console.log(response, "response");
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      console.log("Updating payment status:", orderId, newPaymentStatus);

      const response = await updatePaymentStatusByOrderId(
        orderId,
        newPaymentStatus
      );

      console.log("Payment status update response:", response);

      // Check if the API call was successful based on your controller's response structure
      if (response && response.success) {
        // Update the orders list
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, paymentStatus: newPaymentStatus }
              : order
          )
        );

        // Update the selected order in modal if it's the same order
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prevSelectedOrder) => ({
            ...prevSelectedOrder,
            paymentStatus: newPaymentStatus,
          }));
        }

        // This part is optional but helps keep the stats in sync
        const updatedOrders = orders.map((order) =>
          order.id === orderId
            ? { ...order, paymentStatus: newPaymentStatus }
            : order
        );
        console.log("Payment status updated successfully");
      } else {
        throw new Error(response?.message || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      // Show error message to user
      alert("Failed to update payment status. Please try again.");
    }
  };

  const resolveDispute = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, hasDispute: false } : order
      )
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, hasDispute: false });
    }

    showToast("Dispute resolved successfully", "success");
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <span className="badge badge-success">Paid</span>;
      case "pending":
        return <span className="badge badge-warning">Pending</span>;
      case "failed":
        return <span className="badge badge-danger">Failed</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="badge badge-warning">Pending</span>;
      case "confirmed":
        return <span className="badge badge-primary">Confirmed</span>;
      case "shipped":
        return <span className="badge badge-info">Shipped</span>;
      case "delivered":
        return <span className="badge badge-success">Delivered</span>;
      case "cancelled":
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="">
      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {/* Image Modal */}
      {isImageModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={handleCloseImageModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors duration-200"
              title="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedImage}
              alt="Payment Screenshot"
              className="max-w-full max-h-[80vh] object-contain rounded"
            />
            <div className="mt-2 text-center text-white text-sm">
              Payment Screenshot
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 mb-6 pt-6">
        Order Management
      </h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card border-l-indigo-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 text-sm uppercase font-semibold">
                Total Orders
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {orderManagement.totalOrders}
              </p>
            </div>
            <div className="bg-indigo-100 p-2 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="stat-card border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 text-sm uppercase font-semibold">
                In Progress
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {orderManagement.pendingOrders}
              </p>
            </div>
            <div className="bg-amber-100 p-2 rounded-lg">
              <Truck className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="stat-card border-l-green-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 text-sm uppercase font-semibold">
                Completed
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {orderManagement.completedOrders}
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="stat-card border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 text-sm uppercase font-semibold">
                Cancel
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {orderManagement.disputeOrders}
              </p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search order ID, customer, vendor..."
              className=" p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex  items-center gap-2">
            <select
              className="form-input bg-white py-5"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select className="form-input bg-white py-2">
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>

            <button className="btn btn-primary flex items-center gap-1">
              <FileText className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Order ID</th>
                <th className="table-header-cell">Customer Name</th>
                <th className="table-header-cell">Customer Number</th>
                <th className="table-header-cell">Amount</th>
                <th className="table-header-cell">Payment Screenshot</th>
                <th className="table-header-cell">Payment Status</th>
                <th className="table-header-cell">Order Status</th>
                <th className="table-header-cell">Date</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.orderId} className="table-row">
                    <td className="table-cell font-medium">
                      <div className="flex items-center">
                        {order.orderId}
                        {order.hasDispute && (
                          <span className="ml-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">
                        {order?.fullName}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">
                        {order?.userPhone}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order?.amount}
                      </div>
                    </td>
                    <td className="table-cell">
                      {order.image && (
                        <img
                          src={order.image}
                          alt="Payment Screenshot"
                          className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleOpenImageModal(order.image)}
                        />
                      )}
                    </td>
                    <td className="table-cell">
                      {getPaymentStatusBadge(order?.paymentStatus)}
                    </td>
                    <td className="table-cell">
                      {getStatusBadge(order?.status)}
                    </td>
                    <td className="table-cell">
                      <div className="text-xs text-gray-500">
                        Created:
                        <br />
                        {formatDate(order?.date)}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="table-cell text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No orders found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{filteredOrders.length}</span> of{" "}
              <span className="font-medium">{filteredOrders.length}</span>{" "}
              results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn btn-outline py-1 px-3">Previous</button>
            <button className="btn btn-primary py-1 px-3">Next</button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Enhanced Modal Header with prominent close button */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-gray-900">
                  Order #{selectedOrder.orderId}
                </h3>
                {selectedOrder.hasDispute && (
                  <span className="badge badge-danger flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Dispute
                  </span>
                )}
              </div>
              {/* Enhanced close button */}
              <button
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                title="Close Modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-6 py-4 max-h-[calc(90vh-140px)] overflow-y-auto">
              {/* Status and Key Info */}
              <div className="flex flex-wrap justify-between mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-500">Payment</p>
                  <div className="mt-1 flex items-center space-x-2">
                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                    <span className="text-gray-700 text-sm capitalize">
                      ({selectedOrder.paymentMethod})
                    </span>
                  </div>
                </div>
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-500">Date/ Time</p>
                  <p className="font-medium">
                    {formatDate(selectedOrder.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium text-lg">₹{selectedOrder.amount}</p>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Customer Info */}
                <div className="card">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedOrder.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedOrder.userPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Vendor & Scheduling Info */}
                <div className="card">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Shipping Details
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">
                        {selectedOrder?.shippingAddress?.addressLine}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium">
                        {selectedOrder?.shippingAddress?.city}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pin Code</p>
                      <p className="font-medium">
                        {selectedOrder?.shippingAddress?.postalCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Order Items
                </h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Item
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Unit Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{item.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            ₹{item.price * item.quantity}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td
                          colSpan="3"
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right"
                        >
                          Total Amount:
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          ₹{selectedOrder.amount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions for this order */}
              {selectedOrder.hasDispute && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Dispute Information
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>
                          Customer reported issues with the service. Please
                          contact the customer or vendor to resolve this issue.
                        </p>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => resolveDispute(selectedOrder.id)}
                          className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 text-sm py-2"
                        >
                          Mark as Resolved
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Actions */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Order Actions
                </h4>
                <div className="flex flex-col gap-4">
                  {/* Order Status Actions - First Line */}
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.status !== "completed" &&
                      selectedOrder.status !== "cancelled" && (
                        <button
                          onClick={() =>
                            handleStatusChange(selectedOrder.id, "confirmed")
                          }
                          className="btn btn-primary bg-blue-600 text-white hover:bg-blue-700 flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm Order
                        </button>
                      )}

                    {selectedOrder.status === "confirmed" && (
                      <button
                        onClick={() =>
                          handleStatusChange(selectedOrder.id, "shipped")
                        }
                        className="btn btn-info bg-blue-500 text-white hover:bg-blue-600 flex items-center"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Mark as Shipped
                      </button>
                    )}

                    {selectedOrder.status === "shipped" && (
                      <button
                        onClick={() =>
                          handleStatusChange(selectedOrder.id, "delivered")
                        }
                        className="btn btn-success bg-green-600 text-white hover:bg-green-700 flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Delivered
                      </button>
                    )}

                    {selectedOrder.status !== "cancelled" && (
                      <button
                        onClick={() =>
                          handleStatusChange(selectedOrder.id, "cancelled")
                        }
                        className="btn btn-danger flex items-center"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel Order
                      </button>
                    )}
                  </div>

                  {/* Payment Status Update Section - Second Line */}
                  <div>
                    <h5 className="text-md font-medium text-gray-700 mb-2">
                      Update Payment Status
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handlePaymentStatusChange(selectedOrder.id, "paid")
                        }
                        className={`btn ${
                          selectedOrder.paymentStatus === "paid"
                            ? "bg-green-700"
                            : "bg-green-600"
                        } text-white hover:bg-green-700 flex items-center`}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Paid
                      </button>

                      <button
                        onClick={() =>
                          handlePaymentStatusChange(selectedOrder.id, "pending")
                        }
                        className={`btn ${
                          selectedOrder.paymentStatus === "pending"
                            ? "bg-amber-600"
                            : "bg-amber-500"
                        } text-white hover:bg-amber-600 flex items-center`}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Mark as Pending
                      </button>

                      <button
                        onClick={() =>
                          handlePaymentStatusChange(selectedOrder.id, "failed")
                        }
                        className={`btn ${
                          selectedOrder.paymentStatus === "failed"
                            ? "bg-red-700"
                            : "bg-red-600"
                        } text-white hover:bg-red-700 flex items-center`}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Mark as Failed
                      </button>
                    </div>
                  </div>

                  {/* Print Invoice Button - Third Line */}
                  <div>
                    <button
                      className="btn btn-outline flex items-center"
                      onClick={() =>
                        navigate("/admin/invoice", {
                          state: { order: selectedOrder },
                        })
                      }
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Print Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer with Close Button */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Order ID: {selectedOrder.orderId}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={closeDetailModal}
                  className="btn btn-outline hover:bg-gray-100 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
