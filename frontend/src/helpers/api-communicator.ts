import axios from "axios";

// Ensure axios is configured with the correct backend URL
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true; // Allow credentials (cookies, sessions)

// Login User
export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/user/login", { email, password }, { withCredentials: true });
  if (res.status !== 200) throw new Error("Unable to login");
  return res.data;
};

// Signup User
export const signupUser = async (name: string, email: string, password: string) => {
  const res = await axios.post("/user/signup", { name, email, password }, { withCredentials: true });
  if (res.status !== 201) throw new Error("Unable to Signup");
  return res.data;
};

// Check Authentication Status
export const checkAuthStatus = async () => {
  const res = await axios.get("/user/auth-status", { withCredentials: true });
  if (res.status !== 200) throw new Error("Unable to authenticate");
  return res.data;
};

// Send Chat Request
export const sendChatRequest = async (message: string) => {
  const res = await axios.post("/chat/new", { message }, { withCredentials: true });
  return res.data;
};

// Get User Chats
export const getUserChats = async () => {
  const res = await axios.get("/chat/all-chats", { withCredentials: true });
  if (res.status !== 200) throw new Error("Unable to fetch chats");
  return res.data;
};

// Delete User Chats
export const deleteUserChats = async () => {
  const res = await axios.delete("/chat/delete", { withCredentials: true });
  if (res.status !== 200) throw new Error("Unable to delete chats");
  return res.data;
};

// Logout User
export const logoutUser = async () => {
  const res = await axios.get("/user/logout", { withCredentials: true });
  if (res.status !== 200) throw new Error("Unable to logout");
  return res.data;
};
