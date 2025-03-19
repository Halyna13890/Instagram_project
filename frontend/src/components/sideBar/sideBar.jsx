import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import OverlaySidebar from "../overlaySideBar/OverlaySideBar";
import ProfileLink from "../profileLink/ProfileLink";
import Search from "../search/Search";
import Notifications from "../notification/Notification";
import "../../App.css";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [overlayContent, setOverlayContent] = useState(null);

 
  const openSidebar = (content) => {
    setIsSidebarOpen(true);
    setOverlayContent(content);
  };

  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setOverlayContent(null);
  };

  return (
    <>
      <div className="sidebar">
        <h2>ICNGram</h2>
        <nav>
          <Link to="/home">Home</Link>
          <span className="sidebar-link" onClick={() => openSidebar(<Search />)}>
            Search
          </span>
          <span className="sidebar-link" onClick={() => openSidebar(<Notifications />)}>
            Notifications
          </span>
          <Link to="/createPost">Create</Link>
          <ProfileLink />
        </nav>
      </div>

     
      <OverlaySidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        {overlayContent}
      </OverlaySidebar>
    </>
  );
};

export default Sidebar;


