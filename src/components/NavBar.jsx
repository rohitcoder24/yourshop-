// src/components/NavBar.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const NavBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Add User", path: "/add-user" },
    { label: "Add Product", path: "/add-product" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: isMobile ? "100%" : "80%",
          ml: isMobile ? 0 : "20%",
          backgroundColor: "#1F2937"
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {/* Left: Welcome message */}
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              ml: isMobile ? "calc(50% - 30px)" : 0
            }}
          >
            Welcome,
          </Typography>

          {/* Right: Desktop view navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {navLinks.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </Button>
              ))}
              <Tooltip title="Logout">
                <IconButton color="error" onClick={logout}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Mobile: Profile icon triggers drawer */}
          {isMobile && (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <AccountCircleIcon />
            </IconButton>
          )}
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box
            sx={{
              width: 250,
              backgroundColor: "#1F2937",
              height: "100%",
              color: "#fff"
            }}
            role="presentation"
          >
            <List>
              {navLinks.map((item) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton onClick={() => handleNavigation(item.path)}>
                    <ListItemText primary={item.label} sx={{ color: "#fff" }} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding sx={{ justifyContent: "center" }}>
                <Tooltip title="Logout">
                  <IconButton color="error" onClick={logout}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </AppBar>
    </>
  );
};

export default NavBar;
