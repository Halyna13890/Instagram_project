import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./SideBar/SideBar"
import Footer from "../components/footer/Footer";

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div style={{ display: "flex" }}>
      {!isAuthPage && <Sidebar />} 
      <div style={{ flex: 1 }}>
        <main>
          <Outlet /> 
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
