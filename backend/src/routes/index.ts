import { Router } from 'express';
import userRoutes from "./user-routes.js";
import chatRoutes from './chat-routes.js';
import hf from '../config/hf-config.js';

const appRouter = Router();
appRouter.use("/user",userRoutes);
appRouter.use("/chat",chatRoutes);

// Simpler test route for Hugging Face API
appRouter.get("/test-hf", async (req, res) => {
  try {
    console.log("Testing Hugging Face API with basic prompt...");
    
    // Most basic prompt possible
    const response = await hf.post('/', { 
      inputs: "Hello world"
    });
    
    console.log("HF API Test Response:", response.data);
    
    return res.status(200).json({ 
      success: true, 
      response: response.data 
    });
  } catch (error: any) {
    console.error("HF API Test Error:", error.message);
    
    // Get more detailed error info
    let errorDetails: any = "No additional details";
    if (error.response) {
      errorDetails = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      };
    }
    
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      details: errorDetails
    });
  }
});

export default appRouter;
  
