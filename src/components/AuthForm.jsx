// src/components/AuthForm.jsx
import { useState } from "react";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper, Box, Alert } from "@mui/material";

const AuthForm = ({ isSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container 
      maxWidth="xs" 
      sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "100vh",
      }}
    >
      <Paper 
        elevation={6} 
        sx={{ 
          padding: 4, 
          textAlign: "center", 
          borderRadius: 3, 
          backdropFilter: "blur(15px)", // Improved blur effect
          backgroundColor: "rgba(255, 255, 255, 0.3)", 
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {isSignup ? "Create an Account" : "Welcome Back"}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            label="Email" 
            variant="outlined" 
            margin="normal" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          
          <TextField 
            fullWidth 
            label="Password" 
            type="password" 
            variant="outlined" 
            margin="normal" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          <Box mt={2}>
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              sx={{ backgroundColor: "#1976D2", color: "white", padding: "10px 0", fontWeight: "bold" }}
            >
              {isSignup ? "Sign Up" : "Log In"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AuthForm;
