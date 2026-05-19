// src/pages/AddUser.jsx
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Grid, Paper, Typography } from "@mui/material";
import Lottie from "lottie-react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import animationData from "../assets/animation/animation2.json";

const firebaseBaseURL = "https://yourshop-93ef4-default-rtdb.firebaseio.com/User";

const AddUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingUser = location.state?.user || null;

  const [formData, setFormData] = useState({
    srNo: "",
    name: "",
    mobile: "",
    address: "",
    email: "",
    city: "",
    state: "",
    zip: "",
  });

  const [loading, setLoading] = useState(false);
  const [mobileError, setMobileError] = useState(""); // ✅ Error state for mobile validation

  useEffect(() => {
    if (existingUser) {
      setFormData(existingUser);
    } else {
      fetchLatestSrNo();
    }
  }, [existingUser]);

  const fetchLatestSrNo = async () => {
    try {
      const response = await axios.get(`${firebaseBaseURL}.json`);
      const data = response.data;
      if (data) {
        const usersArray = Object.values(data);
        const lastSrNo = usersArray.length > 0 ? Math.max(...usersArray.map(user => Number(user.srNo) || 0)) : 0;
        setFormData(prev => ({ ...prev, srNo: lastSrNo + 1 }));
      } else {
        setFormData(prev => ({ ...prev, srNo: 1 }));
      }
    } catch (error) {
      console.error("Error fetching serial number:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "zip" && !/^\d{0,6}$/.test(value)) {
      return;
    }

    if (name === "mobile") {
      if (!/^[6-9]\d{0,9}$/.test(value)) {
        setMobileError("Mobile number must start with 6-9 and have 10 digits");
      } else {
        setMobileError("");
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "zip" && value.length === 6) {
      fetchCityState(value);
    }
  };

  const fetchCityState = async (pincode) => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = response.data;
      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setFormData(prev => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State,
        }));
      } else {
        setFormData(prev => ({ ...prev, city: "", state: "" }));
        Swal.fire("Invalid PIN Code", "Please enter a valid one.", "error");
      }
    } catch (error) {
      console.error("Error fetching city and state:", error);
      Swal.fire("Error", "Failed to fetch city & state. Try again.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mobileError || !/^[6-9]\d{9}$/.test(formData.mobile)) {
      Swal.fire("Invalid Mobile", "Please enter a valid mobile number.", "error");
      return;
    }

    setLoading(true);

    try {
      if (existingUser) {
        await axios.put(`${firebaseBaseURL}/${existingUser.id}.json`, formData);
        Swal.fire("Success", "User updated successfully!", "success");
      } else {
        await axios.post(`${firebaseBaseURL}.json`, formData);
        Swal.fire("Success", "User added successfully!", "success");
      }

      handleClear();
      navigate("/customer");
    } catch (error) {
      console.error("Error saving data:", error);
      Swal.fire("Error", "Failed to save data. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (existingUser) {
      navigate("/customer");
    } else {
      fetchLatestSrNo();
      setFormData({
        srNo: "",
        name: "",
        mobile: "",
        address: "",
        email: "",
        city: "",
        state: "",
        zip: "",
      });
    }
  };

  return (
    <Grid container spacing={2} sx={{ height: "100vh", alignItems: "center", justifyContent: "center" }}>
      <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
        <Lottie animationData={animationData} loop={true} style={{ width: "80%", maxWidth: 400 }} />
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
            {existingUser ? "Edit User" : "Add New User"}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Sr. No" name="srNo" fullWidth variant="outlined" value={formData.srNo} disabled />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Name" name="name" fullWidth variant="outlined" value={formData.name} onChange={handleChange} required />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Mobile No"
                  name="mobile"
                  fullWidth
                  variant="outlined"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  error={!!mobileError}
                  helperText={mobileError}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Email" name="email" type="email" fullWidth variant="outlined" value={formData.email} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Address" name="address" fullWidth variant="outlined" value={formData.address} onChange={handleChange} required />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Zip" name="zip" fullWidth variant="outlined" value={formData.zip} onChange={handleChange} required inputProps={{ maxLength: 6 }} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="City" name="city" fullWidth variant="outlined" value={formData.city} disabled required />
              </Grid>
              <Grid item xs={4}>
                <TextField label="State" name="state" fullWidth variant="outlined" value={formData.state} disabled required />
              </Grid>
            </Grid>

            <Box mt={3} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button type="submit" variant="contained" color="primary" sx={{ px: 4, py: 1 }} disabled={loading}>
                {loading ? "Saving..." : existingUser ? "Update" : "Submit"}
              </Button>
              <Button onClick={handleClear} variant="outlined" color="secondary" sx={{ px: 4, py: 1 }} disabled={loading}>
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AddUser;
