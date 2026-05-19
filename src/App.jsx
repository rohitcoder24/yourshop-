import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AddUser from "./pages/AddUser";
import AddProduct from "./pages/AddProduct";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Customer from "./pages/Customer";
import Product from "./pages/Product";
import Bill from "./pages/Bill";
import Print from "./pages/PrintPage";
import Order from "./pages/Order";
import ViewOrder from "./pages/ViewOrder";
import EditOrder from "./pages/EditOrder";
import './App.css';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="customer" element={<Customer />} />
          <Route path="product" element={<Product />} />
          <Route path="bill" element={<Bill />} />
          <Route path="print" element={<Print />} />
          <Route path="order" element={<Order />} />
          <Route path="view-order/:id" element={<ViewOrder />} />
          <Route path="edit-order/:id" element={<EditOrder />} /> 
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
