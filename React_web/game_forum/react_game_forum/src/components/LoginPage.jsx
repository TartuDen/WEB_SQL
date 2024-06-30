import React from "react";
import { Button, Container, Box, Typography } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";

const LoginPage = () => {
  const handleLogin = () => {
    // Logic for Google OAuth login
    window.location.href = "http://localhost:8081/auth/google";
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "200px" }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        border={1}
        borderRadius={3}
        borderColor="grey.300"
        p={3}
        boxShadow={3}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to the Game Forum
        </Typography>
        <Typography variant="h6" gutterBottom>
          Please Login
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GoogleIcon />}
          onClick={handleLogin}
          style={{
            marginTop: "20px",
            backgroundColor: "#4285F4",
            color: "#fff",
          }}
        >
          Login with Google
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
