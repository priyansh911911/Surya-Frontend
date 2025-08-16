import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const SidebarLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar fixed */}
      <SideBar />
      {/* Pages will load here */}
      <div className="flex-1 p-5 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
