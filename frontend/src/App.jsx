import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/sideBar/sideBar";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/registerPage";
import LoginPage from "./pages/loginPage";
import HomePage from "./pages/homePage";
import OnePostPopUp from "./pages/onePostPopUp";
import CreatePostPage from "./pages/CreatePost";
import EditPostPopUp from "./pages/editPostPopUp";
import UserPage from "./pages/userPage";
import ProfileLink from "./components/profileLink/ProfileLink";
import EditProfilePage from "./pages/EditProfilePage";
import Search from "./components/search/Search";
import Notification from "./components/notification/Notification";
import OverlaySidebar from "./components/overlaySideBar/OverlaySideBar";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const noSidebarRoutes = ["/register", "/login"];
  const isSidebarVisible = !noSidebarRoutes.includes(location.pathname);

  // Состояние для управления оверлейным сайдбаром
  const [overlayContent, setOverlayContent] = useState(null);

  // Функция для открытия оверлея
  const openOverlay = (content) => {
    setOverlayContent(content);
  };

  // Функция для закрытия оверлея
  const closeOverlay = () => {
    setOverlayContent(null);
  };

  return (
    <div className="app-container">
      {isSidebarVisible && <Sidebar openOverlay={openOverlay} />} {/* Передаем функцию для открытия оверлея */}
      
      <div className="content">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/post/:id" element={<OnePostPopUp />} />
              <Route path="/post/edit/:postId" element={<EditPostPopUp />} />
              <Route path="/createPost" element={<CreatePostPage />} />
              <Route path="/profile/:userId" element={<UserPage />} />
              <Route path="/profile/:userId/edit" element={<EditProfilePage />}/>
            </Route>
          </Route>
        </Routes>
      </div>

      {/* Оверлейный сайдбар, который открывается без изменения маршрута */}
      <OverlaySidebar isOpen={!!overlayContent} onClose={closeOverlay}>
        {overlayContent}
      </OverlaySidebar>
    </div>
  );
}

export default App;