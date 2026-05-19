// src/pages/About.jsx
import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

const About = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eceff1, #cfd8dc)",
        padding: 3,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          padding: 5,
          maxWidth: 650,
          textAlign: "center",
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom color="secondary">
          About Us
        </Typography>
        <Divider sx={{ mb: 3, bgcolor: "#d32f2f", height: 2 }} />
        <Typography variant="h5" color="primary" gutterBottom>
          Welcome to <span style={{ fontWeight: "bold", color: "#d32f2f" }}>YourShop</span>
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
          YourShop is a premier shopping destination in Agra, committed to delivering top-notch products
          and unparalleled customer service. Our goal is to ensure a seamless and enjoyable shopping
          experience for all our valued customers.
        </Typography>
        <Divider sx={{ my: 3, bgcolor: "#d32f2f", height: 1 }} />
        <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
          <b>📍 Location:</b> Agra
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
          <b>📞 Contact No:</b> +91 XXXXXXXXXX
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
          <b>📧 Email:</b> contact@yourshop.com
        </Typography>
      </Paper>
    </Box>
  );
};

export default About;