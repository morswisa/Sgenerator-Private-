import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../Layout";
import ArtistProfilePage from "./ArtistProfile";
import Explore from "./Explore";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/Dashboard" />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Explore" element={<Explore />} />
        <Route path="/ArtistProfile/:id" element={<ArtistProfilePage />} />
      </Routes>
    </Layout>
  );
}

export default App;