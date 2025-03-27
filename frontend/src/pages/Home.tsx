import { Box, Typography, Button, Grid, Paper, useMediaQuery, useTheme } from "@mui/material";
// import React from "react";
import { motion } from "framer-motion";
import TypingAnim from "../components/typer/TypingAnim";
import Footer from "../components/footer/Footer";
import { Link } from "react-router-dom";
import { FaRobot, FaBrain, FaComments, FaArrowRight } from "react-icons/fa";

const Home = () => {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));

  console.log("Is screen below medium size:", isBelowMd);
  
  return (
    <Box 
      sx={{ 
        width: "100%",
        minHeight: "100vh",
        background: "radial-gradient(circle at center, var(--primary-dark) 0%, var(--background-dark) 100%)"
      }}
    >
      {/* Hero Section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 8, md: 12 },
          pb: 6,
          px: { xs: 2, sm: 4, md: 8 },
        }}
      >
        <Box sx={{ mb: 4 }}>
          <TypingAnim />
        </Box>

        <Box 
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 4, md: 10 },
            mt: 6,
            mb: 8,
            width: "100%",
            maxWidth: "1200px"
          }}
        >
          <Box 
            component={motion.div}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            sx={{ 
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography 
              variant="h2" 
              fontWeight={700} 
              sx={{ 
                color: "white",
                textShadow: "0 0 20px rgba(0, 255, 252, 0.3)",
                mb: 3,
                maxWidth: "600px",
                lineHeight: 1.2
              }}
            >
              Experience AI Conversation
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: "var(--text-muted)",
                mb: 4,
                maxWidth: "550px"
              }}
            >
              Engage with our advanced AI assistant for help with questions, ideas, and more - fast, accurate, and always available.
            </Typography>
            
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", sm: "row" },
                gap: 2
              }}
            >
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                endIcon={<FaArrowRight />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: "12px",
                  bgcolor: "var(--primary-color)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                  ":hover": {
                    bgcolor: "var(--accent-color)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                Get Started
              </Button>
              
              <Button
                component={Link}
                to="/signup"
                variant="outlined"
                size="large"
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: "12px",
                  borderColor: "var(--accent-color)",
                  color: "var(--accent-color)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  ":hover": {
                    borderColor: "var(--accent-color)",
                    bgcolor: "rgba(0, 255, 252, 0.1)",
                  },
                }}
              >
                Create Account
              </Button>
            </Box>
          </Box>
          
          <Box 
            component={motion.div}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            sx={{ 
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              component={motion.div}
              animate={{ 
                rotate: [0, 5, -5, 0],
                y: [0, -10, 10, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              sx={{
                width: { xs: "200px", sm: "300px", md: "350px" },
                height: { xs: "200px", sm: "300px", md: "350px" },
                borderRadius: "50%",
                background: "radial-gradient(circle at center, rgba(0, 255, 252, 0.7) 0%, rgba(0, 255, 252, 0) 70%)",
                filter: "blur(30px)",
                position: "absolute",
                zIndex: 0,
                marginTop:-15
              }}
            />
            <Box 
              sx={{ 
                position: "relative",
                zIndex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FaRobot size={120} color="var(--accent-color)" />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: 10,
          px: { xs: 2, sm: 4, md: 8 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          align="center"
          sx={{ 
            mb: 2,
            color: "var(--accent-color)",
          }}
        >
          Features
        </Typography>
        
        <Typography
          variant="h6"
          align="center"
          sx={{ 
            mb: 6, 
            color: "var(--text-muted)",
            maxWidth: "800px" 
          }}
        >
          Explore the powerful capabilities of our AI assistant
        </Typography>

        <Grid container spacing={4} sx={{ maxWidth: "1200px", mx: "auto" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              component={motion.div}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                borderRadius: "16px",
                bgcolor: "rgba(30, 30, 40, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Box
                sx={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "var(--primary-dark)",
                  mb: 2,
                  color: "var(--accent-color)",
                }}
              >
                <FaBrain size={32} />
              </Box>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: "var(--accent-color)" }}>
                Smart Responses
              </Typography>
              <Typography variant="body2" sx={{ color: "var(--text-muted)" }}>
                Get intelligent and contextually relevant answers to your questions
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              component={motion.div}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                borderRadius: "16px",
                bgcolor: "rgba(30, 30, 40, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Box
                sx={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "var(--primary-dark)",
                  mb: 2,
                  color: "var(--accent-color)",
                }}
              >
                <FaComments size={32} />
              </Box>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: "var(--accent-color)" }}>
                Natural Conversations
              </Typography>
              <Typography variant="body2" sx={{ color: "var(--text-muted)" }}>
                Enjoy fluid conversations with an AI that understands context
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              component={motion.div}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                borderRadius: "16px",
                bgcolor: "rgba(30, 30, 40, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Box
                sx={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "var(--primary-dark)",
                  mb: 2,
                  color: "var(--accent-color)",
                }}
              >
                <FaRobot size={32} />
              </Box>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: "var(--accent-color)" }}>
                24/7 Availability
              </Typography>
              <Typography variant="body2" sx={{ color: "var(--text-muted)" }}>
                Access your AI assistant anytime, anywhere for immediate help
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              component={motion.div}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                borderRadius: "16px",
                bgcolor: "rgba(30, 30, 40, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Box
                sx={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "var(--primary-dark)",
                  mb: 2,
                  color: "var(--accent-color)",
                }}
              >
                <FaRobot size={32} />
              </Box>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: "var(--accent-color)" }}>
                Smart Integration
              </Typography>
              <Typography variant="body2" sx={{ color: "var(--text-muted)" }}>
                Seamlessly integrates with your existing workflow and tools
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Demo Section */}
      <Box
        sx={{
          py: 10,
          px: { xs: 2, sm: 4, md: 8 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box 
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          sx={{ 
            width: "100%",
            maxWidth: "1000px",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 20px 80px rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <img
            src="chat1.png"
            alt="chatbot"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </Box>

        <Box 
          sx={{ 
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{ 
              mb: 2,
              color: "var(--accent-color)" 
            }}
          >
            Ready to start chatting?
          </Typography>
          
          <Typography
            variant="body1"
            sx={{ 
              mb: 4,
              color: "var(--text-muted)",
              maxWidth: "600px" 
            }}
          >
            Join thousands of users already engaging with our AI assistant
          </Typography>
          
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            size="large"
            sx={{
              py: 2,
              px: 5,
              borderRadius: "12px",
              bgcolor: "var(--primary-color)",
              color: "white",
              fontWeight: 600,
              fontSize: "1.1rem",
              transition: "all 0.3s ease",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
              ":hover": {
                bgcolor: "var(--accent-color)",
                transform: "translateY(-3px)",
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            Get Started For Free
          </Button>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;
