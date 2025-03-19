import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";

const Layout = () => {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <main>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
