import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ViewOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [userMobile, setUserMobile] = useState("N/A");
  const [userSrNo, setUserSrNo] = useState("N/A");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        console.log("Fetching order details...");

        // Fetch order details
        const { data: orderData } = await axios.get(
          `https://yourshop-93ef4-default-rtdb.firebaseio.com/Orders/${id}.json`
        );
        console.log("Order Data:", orderData);

        if (orderData) {
          setOrder(orderData);

          // Extract products (if available)
          setProducts(orderData.products ? Object.values(orderData.products) : []);

          // Directly extract user details from order object
          if (orderData.user) {
            setUserMobile(orderData.user.mobile || "N/A");
            setUserSrNo(orderData.user.srNo || "N/A");
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
        Loading order details...
      </Typography>
    );
  }

  if (!order) {
    return (
      <Typography variant="h6" sx={{ mt: 3, textAlign: "center" }}>
        Order not found!
      </Typography>
    );
  }

  return (
    <Paper sx={{ mt: 3, p: 3, maxWidth: 700, margin: "auto", borderRadius: 2 }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        🛒 Billing Invoice
      </Typography>

      {/* Customer Details Section */}
      <Paper sx={{ p: 2, backgroundColor: "#f8f9fa", mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Customer Details:</Typography>
        <Typography><b>Sr No:</b> {userSrNo}</Typography>
        <Typography><b>Name:</b> {order.user?.name || "Unknown"}</Typography>
        <Typography><b>Mobile:</b> {userMobile}</Typography>
      </Paper>

      {/* Order Items Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#007bff", color: "#fff" }}>
              <TableCell sx={{ color: "#fff" }}><b>Sr No</b></TableCell>
              <TableCell sx={{ color: "#fff" }}><b>Product Name</b></TableCell>
              <TableCell sx={{ color: "#fff" }}><b>Price (₹)</b></TableCell>
              <TableCell sx={{ color: "#fff" }}><b>Quantity</b></TableCell>
              <TableCell sx={{ color: "#fff" }}><b>Total (₹)</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>₹{product.productPrice}</TableCell>
                  <TableCell>{product.productQuantity}</TableCell>
                  <TableCell>₹{(product.productPrice || 0) * (product.productQuantity || 0)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">No products found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Grand Total */}
      <Typography variant="h5" align="right" sx={{ mb: 3 }}>
        <b>Grand Total:</b> ₹{order.totalAmount || 0}
      </Typography>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" color="primary" startIcon={<PrintIcon />} onClick={handlePrint}>
          Print Bill
        </Button>
        <Button variant="outlined" color="secondary" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </Paper>
  );
};

export default ViewOrder;
