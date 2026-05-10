import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import ProfileDetail from "./pages/ProfileDetail";
import Messages from "./pages/Messages";
import { messageService } from "./api/services";

function App() {
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadUnreadCount = async () => {
      try {
        const response = await messageService.getInbox();
        const unreadMessages = response.data.filter((m) => !m.isRead);
        setUnreadCount(unreadMessages.length);
      } catch (error) {
        console.error("Erro ao carregar mensagens não lidas:", error);
      }
    };

    loadUnreadCount();
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setUnreadCount(0);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateUnreadCount = () => {
    if (!user) return;
    const loadUnreadCount = async () => {
      try {
        const response = await messageService.getInbox();
        const unreadMessages = response.data.filter((m) => !m.isRead);
        setUnreadCount(unreadMessages.length);
      } catch (error) {
        console.error("Erro ao carregar mensagens não lidas:", error);
      }
    };
    loadUnreadCount();
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} onLogout={handleLogout} unreadCount={unreadCount} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/register"
              element={<Register onRegisterSuccess={handleRegisterSuccess} />}
            />
            <Route
              path="/search"
              element={
                user ? (
                  <Search />
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route path="/profile/:profileId" element={<ProfileDetail />} />
            <Route
              path="/profile"
              element={
                user ? (
                  <Profile />
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/messages"
              element={
                user ? (
                  <Messages onUnreadUpdate={updateUnreadCount} />
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
