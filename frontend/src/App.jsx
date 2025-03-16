import './App.css'
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/registerPage"
import LoginPage from "./pages/loginPage"
import HomePage from './pages/homePage';
import OnePostPopUp from "./pages/onePostPopUp"

function App() {
  return (
    <>
      <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
       
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
          <Route path="/home"  element={<HomePage />}/>
          <Route path="/post/:id" element={<OnePostPopUp />} />
            {/* <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} /> */}
          </Route>
        </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
