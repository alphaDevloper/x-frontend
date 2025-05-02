import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/HomePage";
import Sidebar from "./components/common/Sidebar";
import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotificationPage";
import RightPanel from "./components/common/RightPanel";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { Toaster } from "react-hot-toast";

function App() {
  // it is used to get the user data from the server
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        console.log("data:", data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner size="lg" />
    </div>;
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      <BrowserRouter>
        {authUser && <Sidebar />}
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:username"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>
        {authUser && <RightPanel />}
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
