// src/pages/Contact.jsx
import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

const Contact = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eceff1, #cfd8dc)",
        padding: 4,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 5,
          maxWidth: 650,
          textAlign: "center",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(15px)",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom color="primary" sx={{ letterSpacing: "1px" }}>
          📞 Contact Us
        </Typography>
        <Divider sx={{ mb: 3, bgcolor: "#0288d1", height: 3, width: "50%", margin: "auto" }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#01579b" }}>
          YourShop
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: "1.2rem", lineHeight: 1.8, color: "#37474f" }}>
          <b>📍 Address:</b> Agra, Uttar Pradesh, India
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: "1.2rem", color: "#37474f" }}>
          <b>📞 Phone:</b> +91 XXXXXXXXXX
        </Typography>
        <Typography variant="body1" sx={{ fontSize: "1.2rem", color: "#37474f" }}>
          <b>📧 Email:</b> yourshop@example.com
        </Typography>
      </Paper>

      {/* Google Map Embed */}
      <Box sx={{ mt: 4, width: "100%", maxWidth: 650, borderRadius: "16px", overflow: "hidden", boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)" }}>
        <iframe
          title="Google Map"
          width="100%"
          height="400"
          style={{ border: 0, borderRadius: "16px" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14128.539648231342!2d78.0080742903451!3d27.17667089759945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397477432b13f5df%3A0xabb7cfb20e36b24!2sAgra%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1710000000000"
        ></iframe>
      </Box>
    </Box>
  );
};

export default Contact;