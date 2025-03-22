import React from "react";
import { Outlet } from "react-router-dom";


const Layout = () => {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <main>
        <Outlet /> 
      </main>
    </div>
  );
};

export default Layout;
