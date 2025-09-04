import React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
// import logo from "../assets/logo.png";
import logo1 from "../assets/logo1.png"

function SideBar({ isActive, navItems, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Top Logo Bar */}
      <div
        className={`fixed left-0 top-0 z-50 bg-white shadow-md flex items-center transition-all duration-300 ${sidebarOpen ? "w-56" : "w-16"
          } h-16 px-2`}
      >
        {/* <p>LOGO</p> */}
        {/* <img className=""  src={logo1} alt=""/> */}
        <img className="h-10 w-10 ml-2 rounded-full object-cover" src={logo1} alt="Logo" />


      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-40 bg-white shadow-md transition-all duration-300 h-[calc(100%-4rem)] ${sidebarOpen ? "w-56" : "w-16"
          }`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        {/* Menu Toggle */}
        <div className="flex items-center justify-between px-2 mt-4">
          {sidebarOpen && (
            <span className="font-semibold text-base px-4">Menu</span>
          )}
          <button
            className="p-1 rounded hover:bg-gray-200"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            {!sidebarOpen && <Menu size={22} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="mt-6">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={`flex items-center py-2 px-4 mx-2 rounded transition-colors hover:bg-gray-100 ${isActive(item.path)
                  ? "bg-purple-100 text-purple-600 font-medium"
                  : "text-gray-700"
                }`}
              style={{
                justifyContent: sidebarOpen ? "flex-start" : "center",
              }}
            >
              <span className={sidebarOpen ? "mr-3" : ""}>
                {React.cloneElement(item.icon, { size: 20 })}
              </span>
              {sidebarOpen && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
}

export default SideBar;
