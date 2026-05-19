import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";

const PrintPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userDetails, selectedProducts } = location.state || { userDetails: null, selectedProducts: [] };

  if (!userDetails || selectedProducts.length === 0) {
    return <Typography variant="h6" align="center" sx={{ mt: 5 }}>No bill data available!</Typography>;
  }

  // Calculate grand total
  const grandTotal = selectedProducts.reduce((sum, product) => sum + Number(product.totalAmount), 0);

  // Print only the bill section
  const handlePrint = () => {
    const printContent = document.getElementById("print-area").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore the page
  };

  return (
    <Paper sx={{ p: 4, m: 3, borderRadius: 3 }}>
      {/* Print Section Wrapper */}
      <div id="print-area">
        <Typography variant="h4" align="center" sx={{ mb: 2 }}>🛒 YourShop Billing </Typography>

        {/* User Details */}
        <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
          <Typography variant="h6">Customer Details:</Typography>
          <Typography><strong>Sr No:</strong> {userDetails.srNo}</Typography>
          <Typography><strong>Name:</strong> {userDetails.name}</Typography>
          <Typography><strong>Mobile:</strong> {userDetails.mobile}</Typography>
        </Paper>

        {/* Product Table */}
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2", color: "white" }}>
                <TableCell sx={{ color: "white" }}>Sr No</TableCell>
                <TableCell sx={{ color: "white" }}>Product Name</TableCell>
                <TableCell sx={{ color: "white" }}>Price (₹)</TableCell>
                <TableCell sx={{ color: "white" }}>Quantity</TableCell>
                <TableCell sx={{ color: "white" }}>Total (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>₹{product.productPrice}</TableCell>
                  <TableCell>{product.productQuantity}</TableCell>
                  <TableCell>₹{product.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Grand Total */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
              <Typography variant="h5" align="left" sx={{ mr: 2, mb: 2 }}>
          <strong>Thanks your for  visiting </strong>
        </Typography>
        <Typography variant="h5" align="right" sx={{ mr: 2, mb: 2 }}>
          <strong>Grand Total: ₹{grandTotal}</strong>
        </Typography>
        </div>
         
      </div>

      {/* Print & Back Buttons (Hidden when printing) */}
      <div className="no-print">
        <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mr: 2 }}>🖨️ Print Bill</Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate("/Bill")}>🔙 Back</Button>
      </div>
    </Paper>
  );
};

export default PrintPage;
