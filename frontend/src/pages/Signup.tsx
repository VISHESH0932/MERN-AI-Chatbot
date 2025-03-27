import React, { useEffect, useState } from "react";
import { IoIosLogIn } from "react-icons/io";
import { Box, Typography, Button, CircularProgress, Paper, Divider, Link } from "@mui/material";
import { motion } from "framer-motion";
import CustomizedInput from "../shared/CustomizedInput";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { FaRocket } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const { name, email, password } = formData;
    try {
      toast.loading("Signing Up", { id: "signup" });
      await auth?.signup(name, email, password);
      toast.success("Signed Up Successfully", { id: "signup" });
      navigate("/chat");
    } catch (error) {
      toast.error("Signing Up Failed", { id: "signup" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      navigate("/chat");
    }
  }, [auth, navigate]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flex: 1,
        background: "radial-gradient(circle at center, var(--primary-dark) 0%, var(--background-dark) 100%)",
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        padding={8}
        mt={8}
        display={{ md: "flex", sm: "none", xs: "none" }}
        flexDirection="column"
        alignItems="center"
        maxWidth="500px"
      >
        <FaRocket size={100} color="var(--accent-color)" style={{ marginBottom: "2rem" }} />
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            color: "var(--accent-color)",
            textShadow: "0 0 15px rgba(0, 255, 252, 0.5)",
            mb: 3,
          }}
        >
          Get Started
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "var(--text-muted)",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          Join our community and start chatting with the most advanced AI assistant
        </Typography>
      </Box>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        display="flex"
        flex={{ xs: 1, md: 0.5 }}
        justifyContent="center"
        alignItems="center"
        padding={2}
        ml="auto"
        mt={{ xs: 8, md: 16 }}
      >
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: "450px",
            p: 4,
            borderRadius: "16px",
            background: "rgba(30, 30, 40, 0.7)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              fontWeight={700}
              sx={{
                color: "var(--accent-color)",
                mb: 3,
              }}
            >
              Sign Up
            </Typography>

            <CustomizedInput
              type="text"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            <CustomizedInput
              type="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <CustomizedInput
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              disabled={isLoading}
              variant="contained"
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: "10px",
                bgcolor: "var(--primary-color)",
                color: "white",
                fontWeight: 600,
                transition: "all 0.3s ease",
                mt: 3,
                ":hover": {
                  bgcolor: "var(--accent-color)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
                },
              }}
              endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <IoIosLogIn />}
            >
              {isLoading ? "Creating..." : "Sign Up"}
            </Button>

            <Divider sx={{ width: "100%", my: 3, color: "var(--text-muted)" }}>
              <Typography variant="body2">OR</Typography>
            </Divider>

            <Typography sx={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: "var(--accent-color)",
                  textDecoration: "none",
                  fontWeight: 600,
                  ":hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Signup;