import { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";

// API URLs
const API_ORDERS = "https://yourshop-93ef4-default-rtdb.firebaseio.com/Orders.json";
const API_PRODUCTS = "https://yourshop-93ef4-default-rtdb.firebaseio.com/Products.json";
const API_USERS = "https://yourshop-93ef4-default-rtdb.firebaseio.com/User.json";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          fetch(API_ORDERS),
          fetch(API_PRODUCTS),
          fetch(API_USERS),
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        const usersData = await usersRes.json();

        setOrders(ordersData ? Object.values(ordersData) : []);
        setProducts(productsData ? Object.values(productsData) : []);
        setUsers(usersData ? Object.values(usersData) : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare Data for Charts
  const totalCustomers = users.length;
  const totalProducts = products.length;
  const totalOrders = orders.length;

  const barData = [
    { category: "Customers", count: totalCustomers },
    { category: "Products", count: totalProducts },
    { category: "Orders", count: totalOrders },
  ];

  const pieData = [
    { name: "Customers", value: totalCustomers },
    { name: "Products", value: totalProducts },
    { name: "Orders", value: totalOrders },
  ];

  const COLORS = ["#EF4444", "#2563EB", "#10B981"];

  const lineData = [
    { name: "Jan", orders: totalOrders - 5, products: totalProducts - 2, customers: totalCustomers - 3 },
    { name: "Feb", orders: totalOrders - 3, products: totalProducts - 1, customers: totalCustomers - 1 },
    { name: "Mar", orders: totalOrders, products: totalProducts, customers: totalCustomers },
  ];

  // Loading State
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3} color="#333">
        📊 Business Analytics Dashboard
      </Typography>

      {/* KPI Summary Cards */}
      <Grid container spacing={3} justifyContent="center" mb={3}>
        {[{ label: "Customers", value: totalCustomers, color: "#FF5733" },
          { label: "Products", value: totalProducts, color: "#1976D2" },
          { label: "Orders", value: totalOrders, color: "#28B463" }].map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ textAlign: "center", p: 2, boxShadow: 3, borderRadius: 2, backgroundColor: item.color, color: "white",  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                '&:hover': { transform: "scale(1.12)", boxShadow: 6 } }}>
              <Typography variant="h6">{item.label}</Typography>
              <Typography variant="h4" fontWeight="bold">{item.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} justifyContent="center">
        {/* Bar Chart: Customers, Products, Orders */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" textAlign="center" color="#333">📊 Customer, Product & Order Counts</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1976D2" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Pie Chart: Customers, Products, Orders */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" textAlign="center" color="#333">🥧 Distribution of Data</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Line Chart: Growth Over Time */}
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" textAlign="center" color="#333">📈 Growth Trend (Last 3 Months)</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#FF5733" strokeWidth={2} />
                <Line type="monotone" dataKey="products" stroke="#1976D2" strokeWidth={2} />
                <Line type="monotone" dataKey="customers" stroke="#28B463" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
