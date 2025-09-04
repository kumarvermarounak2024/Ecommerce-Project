import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  ShoppingBag,
  LayoutGrid,
  Package,
  Image as ImageIcon,
  FileText,
  Percent,
} from "lucide-react";

import Navbar from "../components/NavbarInside";
import SideBar from "../components/SideBar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <Home /> },
    { path: "/admin/users", label: "User Management", icon: <Users /> },
    { path: "/admin/orders", label: "Order Management", icon: <ShoppingBag /> },
    {
      path: "/admin/categories",
      label: "Category Management",
      icon: <LayoutGrid />,
    },
    {
      path: "/admin/product",
      label: "Product Management",
      icon: <Package />,
    },
    {
      path: "/admin/header",
      label: "Header Management",
      icon: <ImageIcon />,
    },
    {
      path: "/admin/footer",
      label: "Footer Management",
      icon: <FileText />,
    },
    {
      path: "/admin/offer",
      label: "Offer Management",
      icon: <Percent />,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar
        isActive={isActive}
        navItems={navItems}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? "224px" : "64px" }}
      >
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
