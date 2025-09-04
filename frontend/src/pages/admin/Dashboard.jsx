import React, { useEffect, useState } from "react";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  Loader,
  Archive,
  Truck,
  X,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    packagingOrders: 0,
    outForDeliveryOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    returnedOrders: 0,
    failedDeliveries: 0,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Dummy chart data
  const ordersData = Array.from({ length: 17 }, (_, i) => ({
    day: i + 1,
    orders: Math.floor(Math.random() * 10),
  }));

  const revenueData = Array.from({ length: 17 }, (_, i) => ({
    day: i + 1,
    date: i + 1,
    revenue: Math.floor(Math.random() * 1000) + 200,
  }));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/order/dashboard`
        );
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Orders" status={stats.totalOrders} icon={ShoppingCart} borderColor="border-indigo-500" bgColor="bg-indigo-100" iconColor="text-indigo-600" onClick={() => navigate("/admin/orders")} />
        <StatCard title="Total Products" status={stats.totalProducts} icon={Package} borderColor="border-green-500" bgColor="bg-green-100" iconColor="text-green-600" onClick={() => navigate("/admin/products")} />
        <StatCard title="Total Customers" status={stats.totalCustomers} icon={Users} borderColor="border-blue-500" bgColor="bg-blue-100" iconColor="text-blue-500" onClick={() => navigate("/admin/users")} />
        <StatCard title="Total Revenue" status={`₹${stats.totalRevenue?.toLocaleString() || 0}`} icon={DollarSign} borderColor="border-purple-500" bgColor="bg-purple-100" iconColor="text-purple-600" />
        <StatCard title="Pending Orders" status={stats.pendingOrders} icon={Clock} borderColor="border-yellow-500" bgColor="bg-yellow-100" iconColor="text-yellow-600" />
        <StatCard title="Confirmed Orders" status={stats.confirmedOrders} icon={CheckCircle} borderColor="border-blue-600" bgColor="bg-blue-100" iconColor="text-blue-600" />
        <StatCard title="Packaging Orders" status={stats.packagingOrders} icon={Archive} borderColor="border-orange-500" bgColor="bg-orange-100" iconColor="text-orange-600" />
        <StatCard title="Out for Delivery" status={stats.outForDeliveryOrders} icon={Truck} borderColor="border-indigo-600" bgColor="bg-indigo-100" iconColor="text-indigo-700" />
        <StatCard title="Delivered Orders" status={stats.deliveredOrders} icon={Loader} borderColor="border-green-600" bgColor="bg-green-100" iconColor="text-green-700" />
        <StatCard title="Cancelled Orders" status={stats.cancelledOrders} icon={X} borderColor="border-red-500" bgColor="bg-red-100" iconColor="text-red-600" />
        <StatCard title="Returned Orders" status={stats.returnedOrders} icon={RotateCcw} borderColor="border-gray-500" bgColor="bg-gray-100" iconColor="text-gray-600" />
        <StatCard title="Failed Deliveries" status={stats.failedDeliveries} icon={AlertTriangle} borderColor="border-pink-500" bgColor="bg-pink-100" iconColor="text-pink-600" />
      </div>

      {/* Charts */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
       
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Orders Statics</h2>
            <div className="space-x-2">
              <button className="text-sm px-3 py-1 border rounded">This Year</button>
              <button className="text-sm px-3 py-1 border rounded bg-blue-600 text-white">This Month</button>
              <button className="text-sm px-3 py-1 border rounded">This Week</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Statistics 
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Revenue Statics</h2>
            <div className="space-x-2">
              <button className="text-sm px-3 py-1 border rounded">This Year</button>
              <button className="text-sm px-3 py-1 border rounded bg-blue-600 text-white">This Month</button>
              <button className="text-sm px-3 py-1 border rounded">This Week</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="date" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div> */}
    </div>
  );
};

const StatCard = ({
  title,
  status,
  icon: Icon,
  borderColor,
  bgColor,
  iconColor,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex h-40 justify-between items-center bg-white border-l-4 ${borderColor} rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer`}
    >
      <div>
        <h3 className="text-sm font-semibold text-gray-600 uppercase">{title}</h3>
        <p className="mt-1 text-sm font-medium text-gray-800">{status}</p>
      </div>
      <div className={`p-2 rounded-md ${bgColor}`}>
        <Icon className={`${iconColor}`} size={24} />
      </div>
    </div>
  );
};

export default DashboardStats;


