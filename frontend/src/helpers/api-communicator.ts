// api-communicator.ts
import axios from "axios";

type AuthResponse = {
  name: string;
  email: string;
  token?: string;
};

type ChatResponse = {
  message: string;
};

const api = axios.create({
  baseURL: "https://mern-ai-chatbot-tau.vercel.app/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/user/login", { email, password });
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const signupUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/user/signup", { name, email, password });
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const checkAuthStatus = async (): Promise<AuthResponse | null> => {
  try {
    const res = await api.get<AuthResponse>("/user/auth-status");
    return res.data;
  } catch {
    return null;
  }
};

export const sendChatRequest = async (message: string): Promise<ChatResponse> => {
  const res = await api.post<ChatResponse>("/chat/new", { message });
  return res.data;
};

export const getUserChats = async (): Promise<ChatResponse[]> => {
  const res = await api.get<ChatResponse[]>("/chat/all-chats");
  return res.data;
};

export const deleteUserChats = async (): Promise<{ success: boolean }> => {
  const res = await api.delete<{ success: boolean }>("/chat/delete");
  return res.data;
};

export const logoutUser = async (): Promise<{ success: boolean }> => {
  localStorage.removeItem("token");
  const res = await api.get<{ success: boolean }>("/user/logout");
  return res.data;
};
