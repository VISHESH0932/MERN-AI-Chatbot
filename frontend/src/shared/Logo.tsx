import React from 'react';
import { Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            src="chatgpt.png"
            alt="AI Chat"
            width={"32px"}
            height={"32px"}
            className="image-inverted"
            style={{ 
              filter: "drop-shadow(0 0 8px rgba(0, 255, 226, 0.5))", 
              marginRight: "10px" 
            }}
          />
        </motion.div>
        <Box 
          sx={{ 
            display: { xs: "none", sm: "flex" }, 
            flexDirection: "column",
            alignItems: "flex-start"
          }}
        >
          <Typography 
            variant="h6" 
            sx={{
              fontWeight: 800,
              background: "linear-gradient(90deg, #00fffc, #6c63ff)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "1px",
              lineHeight: 1.2,
              m: 0,
            }}
          >
            AI CHAT
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontWeight: 500
            }}
          >
            Powered by HF
          </Typography>
        </Box>
      </Link>
    </Box>
  );
};

export default Logo;
