import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const firebaseBaseURL = "https://yourshop-93ef4-default-rtdb.firebaseio.com/Products";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${firebaseBaseURL}.json`);
      const data = response.data;
      if (data) {
        const productArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setProducts(productArray);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      await axios.delete(`${firebaseBaseURL}/${id}.json`);
      Swal.fire("Deleted!", "Product has been deleted.", "success");
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((product) =>
    product.productName?.toLowerCase().includes(search.toLowerCase()) ||
    product.id?.toLowerCase().includes(search.toLowerCase()) ||
    product.price?.toString().includes(search)
  );

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      {/* Search Bar */}
      <TextField
        label="Search by Name, ID, or Price"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr. No</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => navigate("/add-product", { state: { product } })}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(product.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Product;