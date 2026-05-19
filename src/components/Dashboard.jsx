// src/components/Dashboard.jsx
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";  // 👈 Import Outlet for dynamic content
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, width: "80%" }}>
        <NavBar />
        <Toolbar /> {/* Offset Navbar height */}
        <Box sx={{ p: 3 }}>
          <Outlet />  {/* 👈 This will load Home, About, Contact, etc. dynamically */}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
