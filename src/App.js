import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import PrivateRoute from "./components/Auth/PrivateRoute";
import UploadPage from "./components/Upload/UploadPage";
import Gallery from "./components/Gallery/Gallery";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <UploadPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <PrivateRoute>
              <Gallery />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
