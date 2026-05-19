// src/pages/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Grid, Paper, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom"; // Import for navigation
import Lottie from "lottie-react";
import axios from "axios";
import animationData from "../assets/animation/animation3.json";
import Swal from "sweetalert2";

const firebaseBaseURL = "https://yourshop-93ef4-default-rtdb.firebaseio.com/Products";

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productToEdit = location.state?.product || null; // Get product data if editing

  // ✅ Form State
  const [formData, setFormData] = useState({
    srNo: "",
    productName: "",
    price: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Fetch latest Sr. No when mounting
  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit); // If editing, set form data
      setIsEditing(true);
    } else {
      fetchLatestSrNo();
    }
  }, [productToEdit]);

  // ✅ Fetch latest Sr. No from Firebase
  const fetchLatestSrNo = async () => {
    try {
      const response = await axios.get(`${firebaseBaseURL}.json`);
      const data = response.data;
      if (data) {
        const productsArray = Object.values(data);
        const lastSrNo = productsArray.length > 0 ? Math.max(...productsArray.map(p => Number(p.srNo) || 0)) : 0;
        setFormData(prev => ({ ...prev, srNo: lastSrNo + 1 }));
      } else {
        setFormData(prev => ({ ...prev, srNo: 1 }));
      }
    } catch (error) {
      console.error("Error fetching serial number:", error);
    }
  };

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && !/^\d{0,7}(\.\d{0,2})?$/.test(value)) {
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Handle Form Submission (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await axios.put(`${firebaseBaseURL}/${formData.id}.json`, formData);
        Swal.fire("Updated!", "Product details updated successfully.", "success");
      } else {
        await axios.post(`${firebaseBaseURL}.json`, formData);
        Swal.fire("Added!", "Product added successfully.", "success");
      }
      navigate("/product"); // Redirect to products list
    } catch (error) {
      console.error("Error saving product:", error);
      Swal.fire("Error", "Failed to save product. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} sx={{ height: "100vh", alignItems: "center", justifyContent: "center" }}>
      {/* Left Column - Animation */}
      <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
        <Lottie animationData={animationData} loop={true} style={{ width: "80%", maxWidth: 400 }} />
      </Grid>

      {/* Right Column - Form */}
      <Grid item xs={12} md={6}>
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
            {isEditing ? "Edit Product" : "Add New Product"}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Sr. No" name="srNo" fullWidth variant="outlined" value={formData.srNo} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Product Name" name="productName" fullWidth variant="outlined" value={formData.productName} onChange={handleChange} required />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Price" name="price" fullWidth variant="outlined" value={formData.price} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Product Description"
                  name="description"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>

            {/* Buttons */}
            <Box mt={3} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button type="submit" variant="contained" color="primary" sx={{ px: 4, py: 1 }} disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update" : "Submit"}
              </Button>
              <Button onClick={() => navigate("/product")} variant="outlined" color="secondary" sx={{ px: 4, py: 1 }} disabled={loading}>
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AddProduct;
