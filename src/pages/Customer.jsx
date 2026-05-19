import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Customer = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://yourshop-93ef4-default-rtdb.firebaseio.com/User.json"
        );
        if (response.data) {
          const userList = Object.keys(response.data).map((key) => ({
            id: key,
            ...response.data[key],
          }));
          setUsers(userList);
          setFilteredUsers(userList);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users.filter((user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.id?.toLowerCase().includes(search.toLowerCase()) ||
      user.mobile?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(
        `https://yourshop-93ef4-default-rtdb.firebaseio.com/User/${userId}.json`
      );
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  const handleEdit = (user) => {
    navigate("/add-user", { state: { user } });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
        Customer List
      </Typography>

      {/* Search Filter */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Search by Name, ID, or Mobile"
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
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Sr. No</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Mobile</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Address</b></TableCell>
                <TableCell><b>City</b></TableCell>
                <TableCell><b>State</b></TableCell>
                <TableCell><b>Zip</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>{user.city}</TableCell>
                    <TableCell>{user.state}</TableCell>
                    <TableCell>{user.zip}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(user)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(user.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Customer;
