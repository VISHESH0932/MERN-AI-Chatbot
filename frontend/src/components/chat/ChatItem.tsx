import React from "react";
import { Box, Avatar, Typography} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { format } from "date-fns";
import { MdSmartToy } from "react-icons/md";

function extractCodeFromString(message: string) {
  if (message.includes("```")) {
    const blocks = message.split("```");
    return blocks;
  }
}

function isCodeBlock(str: string) {
  if (
    str.includes("=") ||
    str.includes(";") ||
    str.includes("[") ||
    str.includes("]") ||
    str.includes("{") ||
    str.includes("}") ||
    str.includes("#") ||
    str.includes("//")
  ) {
    return true;
  }
  return false;
}

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = useAuth();
  const currentTime = format(new Date(), "h:mm a");

  return (
    <Box
      className="message-container animate-fade-in"
      sx={{
        display: "flex",
        p: 2,
        backgroundColor: role === "assistant" 
          ? "var(--background-lightest)" 
          : "var(--primary-dark)",
        gap: 2,
        borderRadius: "var(--border-radius)",
        my: 1,
        maxWidth: { xs: "95%", sm: "85%" },
        width: "fit-content",
        alignSelf: role === "assistant" ? "flex-start" : "flex-end",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        position: "relative",
        wordBreak: "break-word",
        "&::after": role === "assistant" 
          ? {
              content: '""',
              position: "absolute",
              left: "-10px",
              top: "15px",
              borderWidth: "10px 10px 0 0",
              borderStyle: "solid",
              borderColor: `var(--background-lightest) transparent transparent transparent`,
              transform: "rotate(225deg)",
            }
          : {
              content: '""',
              position: "absolute",
              right: "-10px",
              top: "15px",
              borderWidth: "10px 10px 0 0",
              borderStyle: "solid",
              borderColor: `var(--primary-dark) transparent transparent transparent`,
              transform: "rotate(315deg)",
            },
      }}
    >
      <Avatar 
        sx={{ 
          ml: "0", 
          bgcolor: role === "assistant" ? "var(--secondary-color)" : "var(--accent-color)",
          color: "black",
          fontWeight: 700,
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          flexShrink: 0,
          alignSelf: "flex-start"
        }}
      >
        {role === "assistant" ? (
          <MdSmartToy size={20} color="#fff" />
        ) : (
          auth?.user?.name ? auth.user.name[0].toUpperCase() : "U"
        )}
      </Avatar>
      <Box sx={{ width: "100%", maxWidth: "calc(100% - 50px)" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography 
            sx={{ 
              fontWeight: 600, 
              color: role === "assistant" ? "var(--accent-color)" : "white"
            }}
          >
            {role === "assistant" ? "AI Assistant" : auth?.user?.name || "You"}
          </Typography>
          <Typography variant="caption" sx={{ color: "var(--text-muted)" }}>
            {currentTime}
          </Typography>
        </Box>
        
        {!messageBlocks && (
          <Typography 
            sx={{ 
              fontSize: "16px",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word"
            }}
          >
            {content}
          </Typography>
        )}
        
        {messageBlocks && messageBlocks.length > 0 && (
          <Box sx={{ width: "100%" }}>
            {messageBlocks.map((block, index) =>
              isCodeBlock(block) ? (
                <Box key={index} sx={{ my: 2, borderRadius: "8px", overflow: "hidden", maxWidth: "100%" }}>
                  <Box 
                    sx={{ 
                      bgcolor: "#1e1e1e", 
                      px: 2, 
                      py: 1, 
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Typography sx={{ color: "#e6e6e6", fontSize: "14px" }}>
                      Code Snippet
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: "12px", 
                        color: "#4d97ff",
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" }
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(block);
                        // You could add a toast notification here
                      }}
                    >
                      Copy Code
                    </Typography>
                  </Box>
                  <SyntaxHighlighter 
                    style={coldarkDark} 
                    language="javascript"
                    customStyle={{ margin: 0, borderRadius: "0 0 8px 8px", maxWidth: "100%", overflowX: "auto" }}
                  >
                    {block}
                  </SyntaxHighlighter>
                </Box>
              ) : (
                <Typography 
                  key={index}
                  sx={{ 
                    fontSize: "16px", 
                    my: 1,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word"
                  }}
                >
                  {block}
                </Typography>
              )
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatItem;
// import React from 'react';
// import { Avatar, Box, Typography } from '@mui/material';
// import { useAuth } from '../../context/AuthContext';

// const ChatItem = ({
//   content,
//   role,
// }: {
//   content: string;
//   role: "user" | "assistant";
// }) => {
//   const auth = useAuth();

//   return (
//     <Box sx={{
//       display: 'flex',
//       flexDirection: 'row',
//       p: 2,
//       bgcolor: role === "assistant" ? "#004d56": "#black",
//       gap: 2,
//       borderRadius: 2,
//       mb: 1,
//       alignItems: 'flex-start'
//     }}>
//       <Avatar sx={{ ml: "0" }}>
//         {role === "assistant" ? (
//           <img src='chatgpt.png' alt="openai" width={"30px"} />
//         ) : (
//           auth?.user?.name[0] || 'U'
//         )}
//       </Avatar>
//       <Box>
//         <Typography fontSize={"20px"}>{content}</Typography>
//       </Box>
//     </Box>
//   );
// };

// export default ChatItem;
