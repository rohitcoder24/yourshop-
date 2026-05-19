import React, { useState, useEffect } from "react";
import {
  Box, TextField, Button, Grid, Paper, Typography, MenuItem, Select,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const firebaseBaseURL = "https://yourshop-93ef4-default-rtdb.firebaseio.com/Orders";
const firebaseProductsURL = "https://yourshop-93ef4-default-rtdb.firebaseio.com/Products.json";

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const orderToEdit = location.state?.order || null;

  const [formData, setFormData] = useState({
    userName: "",
    totalAmount: 0,
    timestamp: "",
    products: [],
  });

  const [availableProducts, setAvailableProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(""); 

  // Fetch products from Firebase
  useEffect(() => {
    axios.get(firebaseProductsURL)
      .then((response) => {
        if (response.data) {
          const productList = Object.entries(response.data).map(([key, value]) => ({
            id: key,
            ...value
          }));
          setAvailableProducts(productList);
        }
      })
      .catch((error) => console.error("Error fetching products:", error));

    if (orderToEdit) {
      setFormData({
        userName: orderToEdit.user?.name || "",
        totalAmount: orderToEdit.totalAmount || 0,
        timestamp: new Date(orderToEdit.timestamp).toISOString().slice(0, 16),
        products: orderToEdit.products || [],
      });
    }
  }, [orderToEdit]);

  // Recalculate Total Amount
  const recalculateTotal = (products) => {
    const newTotal = products.reduce((sum, p) => sum + (p.productPrice * p.productQuantity), 0);
    setFormData((prev) => ({ ...prev, totalAmount: newTotal }));
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Quantity Change
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = Number(value);
    setFormData((prev) => ({ ...prev, products: updatedProducts }));
    recalculateTotal(updatedProducts);
  };

  // Delete a Product
  const handleDeleteProduct = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, products: updatedProducts }));
    recalculateTotal(updatedProducts);
  };

  // Add a New Product
  const handleAddProduct = () => {
    if (!newProduct) return;
  
    // Find the selected product
    const selectedProduct = availableProducts.find(p => p.productName === newProduct);
  
    if (!selectedProduct) {
      console.error("Selected product not found:", newProduct);
      return;
    }
  
    console.log("Selected Product:", selectedProduct);
  
    const newProductEntry = {
      srNo: formData.products.length + 1,
      productName: selectedProduct.productName,
      productPrice: selectedProduct.price,  // No need for conversion now
      productQuantity: 1, 
    };
  
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, newProductEntry]
    }));
  
    setNewProduct(""); 
    recalculateTotal([...formData.products, newProductEntry]);
  };
  
  

  // Submit Order Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${firebaseBaseURL}/${id}.json`, {
        user: { name: formData.userName },
        totalAmount: formData.totalAmount,
        timestamp: new Date(formData.timestamp).getTime(),
        products: formData.products,
      });

      Swal.fire("Updated!", "Order updated successfully.", "success");
      navigate("/order");
    } catch (error) {
      console.error("Error updating order:", error);
      Swal.fire("Error", "Failed to update order. Please try again.", "error");
    }
  };

  return (
    <Grid container spacing={2} sx={{ height: "100vh", alignItems: "center", justifyContent: "center" }}>
      <Grid item xs={12} md={8}>
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
            Edit Order
          </Typography>

          {/* Order Details */}
          <Box mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="subtitle1" fontWeight="bold">User Name:</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth variant="outlined" name="userName" value={formData.userName} onChange={handleChange} required />
              </Grid>

              <Grid item xs={3}>
                <Typography variant="subtitle1" fontWeight="bold">Total Amount:</Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth variant="outlined" name="totalAmount" value={formData.totalAmount} disabled />
              </Grid>
            </Grid>
          </Box>

          {/* Product Table */}
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "blue" }}>
                  <TableCell sx={{ color: "white" }}><b>Sr No</b></TableCell>
                  <TableCell sx={{ color: "white" }}><b>Product Name</b></TableCell>
                  <TableCell sx={{ color: "white" }}><b>Price (₹)</b></TableCell>
                  <TableCell sx={{ color: "white" }}><b>Quantity</b></TableCell>
                  <TableCell sx={{ color: "white" }}><b>Total (₹)</b></TableCell>
                  <TableCell sx={{ color: "white" }}><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>₹{product.productPrice}</TableCell>
                    <TableCell>
                      <TextField type="number" size="small" value={product.productQuantity} onChange={(e) => handleProductChange(index, "productQuantity", e.target.value)} />
                    </TableCell>
                    <TableCell>₹{product.productPrice * product.productQuantity}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="error" onClick={() => handleDeleteProduct(index)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add Product Section */}
          <Box mt={2} display="flex" gap={2}>
            <Select value={newProduct} onChange={(e) => setNewProduct(e.target.value)} fullWidth>
              {availableProducts.map((prod) => (
                <MenuItem key={prod.id} value={prod.productName}>{prod.productName} - ₹{prod.productPrice}</MenuItem>
              ))}
            </Select>
            <Button variant="contained" color="primary" onClick={handleAddProduct}>Add Product</Button>
          </Box>

          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit} fullWidth sx={{ mt: 3 }}>
            Update Order
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EditOrder;