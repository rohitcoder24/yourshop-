// src/pages/Bill.jsx
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Paper,
  Typography,
  MenuItem,
  Select,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Bill = () => {
  const [searchType, setSearchType] = useState("id");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://yourshop-93ef4-default-rtdb.firebaseio.com/User.json"
        );
        if (response.data) {
          const usersArray = Object.keys(response.data).map((key) => ({
            id: key,
            ...response.data[key],
          }));
          setUsers(usersArray);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://yourshop-93ef4-default-rtdb.firebaseio.com/Products.json"
        );
        if (response.data) {
          const productsArray = Object.keys(response.data).map((key) => ({
            id: key,
            ...response.data[key],
          }));
          setProducts(productsArray);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    setSelectedUser("");
    setUserDetails(null);
  };

  const handleUserSelection = (value) => {
    setSelectedUser(value);
    const foundUser = users.find((user) => {
      if (searchType === "id") return user.srNo === value;
      if (searchType === "mobile") return user.mobile === value;
      if (searchType === "name") return user.name === value;
      return false;
    });
    setUserDetails(foundUser || null);
  };

  const handleProductSelection = (index, field, value) => {
    const updatedProducts = [...selectedProducts];

    if (field === "productQuantity") {
      const quantity = Math.max(1, parseInt(value, 10) || 1);
      updatedProducts[index].productQuantity = quantity;
      updatedProducts[index].totalAmount =
        updatedProducts[index].productPrice * quantity;
    } else if (field === "productId") {
      const selectedProduct = products.find((product) => product.id === value);
      if (selectedProduct) {
        updatedProducts[index] = {
          srNo: index + 1,
          productId: selectedProduct.id,
          productName: selectedProduct.productName || "Unnamed Product",
          productPrice: selectedProduct.price || 0,
          productQuantity: 1,
          totalAmount: selectedProduct.price ? selectedProduct.price * 1 : 0,
        };
      }
    }

    setSelectedProducts(updatedProducts);
  };

  const addProductRow = () => {
    setSelectedProducts([
      ...selectedProducts,
      {
        srNo: selectedProducts.length + 1,
        productId: "",
        productName: "",
        productPrice: "",
        productQuantity: "",
        totalAmount: "",
      },
    ]);
  };

  const handleGenerateBill = async () => {
    if (!userDetails || selectedProducts.length === 0) {
      alert("Please select a user and at least one product.");
      return;
    }

    const orderData = {
      user: {
        srNo: userDetails.srNo,
        name: userDetails.name,
        mobile: userDetails.mobile,
      },
      products: selectedProducts,
      totalAmount: selectedProducts.reduce(
        (sum, product) => sum + product.totalAmount,
        0
      ),
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        "https://yourshop-93ef4-default-rtdb.firebaseio.com/Orders.json",
        orderData
      );

      if (response.status === 200) {
        alert("Order saved successfully!");
        navigate("/Print", { state: { userDetails, selectedProducts } });
      } else {
        alert("Failed to save the order. Please try again.");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert("An error occurred while saving the order.");
    }
  };

  return (
    <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Search User By</FormLabel>
            <RadioGroup row value={searchType} onChange={handleSearchTypeChange}>
              <FormControlLabel value="id" control={<Radio />} label="User ID (Sr No)" />
              <FormControlLabel value="mobile" control={<Radio />} label="Mobile No" />
              <FormControlLabel value="name" control={<Radio />} label="Name" />
            </RadioGroup>
          </FormControl>

          {/* User Autocomplete Dropdown */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Autocomplete
              freeSolo
              options={users.map((user) =>
                searchType === "id"
                  ? user.srNo
                  : searchType === "mobile"
                  ? user.mobile
                  : user.name
              )}
              value={selectedUser}
              onChange={(event, newValue) => handleUserSelection(newValue || "")}
              onInputChange={(event, newInputValue) => setSelectedUser(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={`Enter or select ${
                    searchType === "id"
                      ? "User ID (Sr No)"
                      : searchType === "mobile"
                      ? "Mobile No"
                      : "Name"
                  }`}
                />
              )}
            />
          </FormControl>

          {userDetails && (
            <Paper sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: "#f5f5f5" }}>
              <Typography variant="h6">User Details</Typography>
              <TextField label="Sr No" fullWidth value={userDetails.srNo} disabled sx={{ mt: 2 }} />
              <TextField label="Name" fullWidth value={userDetails.name} disabled sx={{ mt: 2 }} />
              <TextField label="Mobile No" fullWidth value={userDetails.mobile} disabled sx={{ mt: 2 }} />
            </Paper>
          )}

          {/* Product Selection */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Add Products
          </Typography>

          {selectedProducts.map((product, index) => (
            <Grid container spacing={2} key={index} sx={{ mt: 2 }}>
              <Grid item xs={1}>
                <TextField label="Sr No" fullWidth value={index + 1} disabled />
              </Grid>

              <Grid item xs={3}>
                <FormControl fullWidth>
                  <Select
                    value={product.productId}
                    onChange={(e) =>
                      handleProductSelection(index, "productId", e.target.value)
                    }
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select Product</MenuItem>
                    {products.map((prod) => (
                      <MenuItem key={prod.id} value={prod.id}>
                        {prod.productName || "Unnamed Product"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={2}>
                <TextField label="Price" fullWidth value={product.productPrice} disabled />
              </Grid>

              <Grid item xs={2}>
                <TextField
                  label="Quantity"
                  fullWidth
                  type="number"
                  value={product.productQuantity}
                  onChange={(e) =>
                    handleProductSelection(index, "productQuantity", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={2}>
                <TextField label="Total" fullWidth value={product.totalAmount} disabled />
              </Grid>
            </Grid>
          ))}

          <IconButton color="primary" sx={{ mt: 2 }} onClick={addProductRow}>
            <AddCircle fontSize="large" />
          </IconButton>

          <Button variant="contained" sx={{ mt: 3 }} fullWidth onClick={handleGenerateBill}>
            Generate Bill
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Bill;
