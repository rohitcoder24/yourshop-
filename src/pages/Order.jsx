import React, { useEffect, useState } from "react";
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
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://yourshop-93ef4-default-rtdb.firebaseio.com/Orders.json");
        if (response.data) {
          const ordersArray = Object.keys(response.data).map((key) => ({
            id: key,
            ...response.data[key],
          }));
          setOrders(ordersArray);
          setFilteredOrders(ordersArray);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle date filtering
  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.timestamp).toISOString().split("T")[0];
      return (
        (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate)
      );
    });
    setFilteredOrders(filtered);
  }, [startDate, endDate, orders]);

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(
          `https://yourshop-93ef4-default-rtdb.firebaseio.com/Orders/${orderId}.json`
        );
        setOrders(orders.filter((order) => order.id !== orderId));
        alert("Order deleted successfully!");
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete the order.");
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
        🛒 Order Management
      </Typography>

      {/* Date Filters */}
      <Grid container spacing={2} justifyContent="center" mb={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Orders Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><b>Name of User</b></TableCell>
              <TableCell><b>Date of Purchasing</b></TableCell>
              <TableCell><b>Time of Purchasing</b></TableCell>
              <TableCell><b>Total Amount</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.user?.name || "Unknown"}</TableCell>
                  <TableCell>{new Date(order.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(order.timestamp).toLocaleTimeString()}</TableCell>
                  <TableCell>₹{order.totalAmount}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => navigate(`/view-order/${order.id}`)}>
                      <Visibility />
                    </IconButton>
                    <IconButton color="warning" onClick={() => navigate(`/edit-order/${order.id}`, { state: { order } })}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(order.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No orders found for the selected date range.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Order;