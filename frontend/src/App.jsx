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
import EditProfilePage from "./pages/EditProfilePage";
import OverlaySidebar from "./components/overlaySideBar/OverlaySideBar";
import Explore from './pages/explore';

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

  
  const [overlayContent, setOverlayContent] = useState(null);

 
  const openOverlay = (content) => {
    setOverlayContent(content);
  };

 
  const closeOverlay = () => {
    setOverlayContent(null);
  };

  return (
    <div className="app-container">
      {isSidebarVisible && <Sidebar openOverlay={openOverlay} />} 
      
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
              <Route path="/explore" element={<Explore />}/>
            </Route>
          </Route>
        </Routes>
      </div>

      <OverlaySidebar isOpen={!!overlayContent} onClose={closeOverlay}>
        {overlayContent}
      </OverlaySidebar>
    </div>
  );
}

export default App;