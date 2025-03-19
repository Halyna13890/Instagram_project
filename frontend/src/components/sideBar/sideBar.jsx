import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import OverlaySidebar from "../overlaySideBar/OverlaySideBar";
import ProfileLink from "../profileLink/ProfileLink";
import Search from "../search/Search"
import Notifications from "../notification/Notification"
import "../../App.css";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); // Получаем текущий маршрут

  // Функция для открытия оверлейного сайдбара
  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  // Функция для закрытия оверлейного сайдбара
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Определяем, какой контент показывать в оверлейном сайдбаре, в зависимости от маршрута
  const getOverlayContent = () => {
    switch (location.pathname) {
      case "/search":
        return <Search />; // Рендерим компонент Search
      case "/notifications":
        return <Notifications />; // Рендерим компонент Notifications
      default:
        return <h2>Choose an option</h2>; // По умолчанию
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar" style={{ position: "fixed", zIndex: 10 }}>
        <h2>ICNGram</h2>
        <nav>
          <Link to="/home">Home</Link>
          <span className="sidebar-link" onClick={openSidebar}>
            Search
          </span>
          <span className="sidebar-link" onClick={openSidebar}>
            Notifications
          </span>
          <Link to="/createPost">Create</Link>
          <ProfileLink />
        </nav>
      </div>

      <OverlaySidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        {getOverlayContent()}
      </OverlaySidebar>
    </div>
  );
};

export default Sidebar;
