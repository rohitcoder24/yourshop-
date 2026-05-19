// src/components/SideBar.jsx
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Box,
  ListItemIcon,
  IconButton,
  useMediaQuery,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SideBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { text: "Bill", path: "/bill", icon: <ReceiptIcon /> },
    { text: "Order", path: "/order", icon: <ShoppingCartIcon /> },
    { text: "Product", path: "/product", icon: <CategoryIcon /> },
    { text: "Customer", path: "/customer", icon: <PeopleIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ backgroundColor: "#1F2937", height: "100%", color: "white" }}>
      <Toolbar sx={{ flexDirection: "column", py: 2 }}>
        <Box component="img" src={logo} alt="Logo" sx={{ width: 200, height: 100, mb: 2 }} />
        {isMobile && (
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{ color: "white", position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              "&:hover": { backgroundColor: "#1A252F" },
              py: 1.5,
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Hamburger Icon for Mobile */}
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            color: "white",
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1301, // above Drawer
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isMobile ? 250 : "20%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile ? 250 : "20%",
            boxSizing: "border-box",
            backgroundColor: "#1F2937",
            color: "white",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default SideBar;
