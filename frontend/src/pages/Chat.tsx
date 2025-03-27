import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton, Paper, Divider, Tooltip, CircularProgress } from "@mui/material";
// import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { MdDelete, MdSettings, MdHelp, MdSmartToy } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (!content?.trim()) return;

    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }

    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    setIsSending(true);
    scrollToBottom();

    try {
      const chatData = await sendChatRequest(content);
      setChatMessages([...chatData.chats]);
      scrollToBottom();
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting conversation...", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Conversation cleared", { id: "deletechats" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear conversation", { id: "deletechats" });
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      setIsLoading(true);
      toast.loading("Loading conversation...", { id: "loadchats" });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Conversation loaded", { id: "loadchats" });
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load conversation", { id: "loadchats" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  useEffect(() => {
    // Auto-scroll to the bottom when new messages arrive
    scrollToBottom();
  }, [chatMessages]);

  return (
    <Box 
      sx={{ 
        height: "calc(100vh - 80px)", 
        display: "flex", 
        pt: 3,
        pb: 3, 
        px: { xs: 1, sm: 3 }, 
        overflow: "hidden" 
      }}
    >
      {/* Sidebar */}
      <Box
        component={Paper}
        elevation={3}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          width: "280px",
          minWidth: "280px", // Add min-width to prevent shrinking
          mr: 3,
          bgcolor: "var(--background-lightest)",
          borderRadius: "var(--border-radius)",
          overflow: "hidden",
          height: "100%", // Ensure full height
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: "var(--background-light)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: "var(--accent-color)", 
              color: "black",
              fontWeight: 700,
              mr: 2
            }}
          >
            {auth?.user?.name ? auth.user.name[0].toUpperCase() : "U"}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {auth?.user?.name || "User"}
            </Typography>
            <Typography variant="caption" color="var(--text-muted)">
              {auth?.user?.email}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 2, flexGrow: 1, overflow: "auto" }}>
          <Typography 
            variant="subtitle2" 
            fontWeight={600} 
            color="var(--accent-color)" 
            gutterBottom
          >
            ABOUT THIS CHATBOT
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "var(--text-muted)" }}>
            This AI assistant can help answer questions on various topics including knowledge, business, education, and more.
          </Typography>
          <Typography variant="body2" color="var(--text-muted)">
            For the best experience:
          </Typography>
          <ul style={{ color: "var(--text-muted)", paddingLeft: "20px" }}>
            <li><Typography variant="body2">Be specific in your questions</Typography></li>
            <li><Typography variant="body2">Avoid sharing personal information</Typography></li>
            <li><Typography variant="body2">Ask one question at a time</Typography></li>
          </ul>
        </Box>

        <Box sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <Button
            onClick={handleDeleteChats}
            variant="contained"
            fullWidth
            startIcon={<MdDelete />}
            sx={{
              bgcolor: "var(--primary-color)",
              color: "white",
              py: 1,
              fontWeight: 600,
              "&:hover": {
                bgcolor: "var(--primary-dark)",
              },
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>

      {/* Main Chat Area */}
      <Box
        component={Paper}
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          bgcolor: "var(--background-lightest)",
          borderRadius: "var(--border-radius)",
          overflow: "hidden",
          height: "100%", // Ensure full height
          maxHeight: "100%", // Prevent overflow
        }}
      >
        {/* Chat Header */}
        <Box
          sx={{
            p: 2,
            bgcolor: "var(--background-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            flexShrink: 0, // Prevent shrinking
          }}
        >
          <Typography variant="h6" fontWeight={600} color="var(--accent-color)">
            AI Assistant
          </Typography>
          <Box>
            <Tooltip title="Chat Settings">
              <IconButton size="small" sx={{ color: "var(--text-muted)", mr: 1 }}>
                <MdSettings />
              </IconButton>
            </Tooltip>
            <Tooltip title="Help">
              <IconButton size="small" sx={{ color: "var(--text-muted)" }}>
                <MdHelp />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Messages Container */}
        <Box
          ref={chatContainerRef}
          sx={{
            flexGrow: 1,
            p: 2,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            bgcolor: "var(--background-dark)",
            maxHeight: "calc(100% - 120px)", // Adjust based on header + input heights
          }}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <CircularProgress size={40} sx={{ color: "var(--accent-color)" }} />
            </Box>
          ) : chatMessages.length === 0 ? (
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "100%",
                opacity: 0.7,
              }}
            >
              <Box 
                sx={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "var(--secondary-color)",
                  marginBottom: "20px",
                  opacity: 0.6,
                }}
              >
                <MdHelp size={42} color="#fff" />
              </Box>
              <Typography variant="h6" color="var(--text-muted)" gutterBottom>
                Start a conversation
              </Typography>
              <Typography variant="body2" color="var(--text-muted)" align="center" sx={{ maxWidth: "400px" }}>
                Ask a question or type a message to begin chatting with the AI assistant
              </Typography>
            </Box>
          ) : (
            <>
              {chatMessages.map((chat, index) => (
                <ChatItem key={index} content={chat.content} role={chat.role} />
              ))}
            </>
          )}
          
          {isSending && (
            <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
              <Avatar
                sx={{
                  bgcolor: "var(--secondary-color)",
                  width: 32,
                  height: 32,
                  mr: 1,
                }}
              >
                <MdSmartToy size={16} color="#fff" />
              </Avatar>
              <div className="typing-indicator">
                <div className="typing-indicator-dot"></div>
                <div className="typing-indicator-dot"></div>
                <div className="typing-indicator-dot"></div>
              </div>
            </Box>
          )}
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 2,
            bgcolor: "var(--background-light)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            flexShrink: 0, // Prevent shrinking
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "var(--background-dark)",
              borderRadius: "var(--border-radius)",
              p: "4px",
              position: "relative",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message..."
              onKeyDown={handleKeyPress}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                padding: "12px 16px",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "16px",
                borderRadius: "var(--border-radius)",
              }}
            />
            <IconButton
              onClick={handleSubmit}
              disabled={isSending}
              sx={{
                bgcolor: "var(--primary-color)",
                color: "white",
                "&:hover": {
                  bgcolor: "var(--primary-dark)",
                },
                ml: 1,
                width: "40px",
                height: "40px",
              }}
            >
              <IoMdSend />
            </IconButton>
          </Box>
          <Typography variant="caption" color="var(--text-muted)" sx={{ mt: 1, display: "block", textAlign: "center" }}>
            Messages are processed by an AI model and may not always be accurate
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
