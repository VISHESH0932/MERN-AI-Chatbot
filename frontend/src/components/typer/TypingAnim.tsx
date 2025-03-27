import { Box } from "@mui/material";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";

const TypingAnim = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      sx={{
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "40%",
          height: "4px",
          background: "linear-gradient(90deg, rgba(0,255,252,0) 0%, rgba(0,255,252,0.8) 50%, rgba(0,255,252,0) 100%)",
          borderRadius: "2px",
        }
      }}
    >
      <TypeAnimation
        sequence={[
          "Chat With Your Own AI",
          1000,
          "Built With Advanced AI Technology",
          2000,
          "Your Personal AI Assistant",
          1500,
        ]}
        speed={50}
        style={{
          fontSize: "42px",
          color: "white",
          display: "inline-block",
          textShadow: "0 0 20px rgba(0, 255, 252, 0.5)",
          fontWeight: 700,
        }}
        repeat={Infinity}
      />
    </Box>
  );
};

export default TypingAnim;
