import AuthForm from "../components/AuthForm";
import backgroundImage from "../assets/img/logo.png";
import { Box } from "@mui/material";

const Login = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <AuthForm isSignup={false} />
    </Box>
  );
};

export default Login;
