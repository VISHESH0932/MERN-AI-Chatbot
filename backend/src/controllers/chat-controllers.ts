import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import hf from '../config/hf-config.js';


export const generationChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: 'User not registered OR Token malfunctioned' });
    }

    // Add the new message to user's chat history
    user.chats.push({ role: 'user', content: message });

    let assistantMessage = '';
    
    try {
      // Format the conversation history for the model input
      let conversationString = "";
      
      // Add previous conversations if they exist
      if (user.chats.length > 0) {
        for (const chat of user.chats) {
          if (chat.role === 'user') {
            conversationString += `User: ${chat.content}\n`;
          } else if (chat.role === 'assistant') {
            conversationString += `Assistant: ${chat.content}\n`;
          }
        }
      }
      
      // Add the new message
      conversationString += `User: ${message}\nAssistant:`;
      
      console.log("Attempting to send to HF API:", { inputs: conversationString });
      
      // Send request to Hugging Face API with proper format
      const chatResponse = await hf.post('/', { 
        inputs: conversationString
      });
      
      console.log("HF API Response:", chatResponse.data);
      
      // Extract the generated text from the response
      if (chatResponse.data && chatResponse.data.generated_text) {
        // Extract only the assistant's response (after "Assistant:")
        assistantMessage = chatResponse.data.generated_text.split("Assistant:").pop().trim();
      }
    } catch (apiError: any) {
      console.error("HF API Error:", apiError.message);
      console.log("Using fallback response mechanism");
      
      // Fallback response when the API fails
      assistantMessage = generateFallbackResponse(message);
    }

    // If we still don't have a response, use a default message
    if (!assistantMessage) {
      assistantMessage = "I'm sorry, I'm having trouble generating a response right now. Please try again later.";
    }

    // Add the assistant's response to user's chat history
    user.chats.push({ role: 'assistant', content: assistantMessage });
    await user.save();

    return res.status(200).json({ chats: user.chats });
  } catch (error: any) {
    console.error("Chat Controller Error:", error);
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Fallback response generator when API fails
function generateFallbackResponse(message: string): string {
  // Simple keyword-based response system
  const lowerMessage = message.toLowerCase();
  
  // Basic math operations
  if (lowerMessage.match(/what\s+is\s+(\d+)\s*\+\s*(\d+)/i)) {
    const match = lowerMessage.match(/what\s+is\s+(\d+)\s*\+\s*(\d+)/i);
    if (match && match[1] && match[2]) {
      const num1 = parseInt(match[1]);
      const num2 = parseInt(match[2]);
      return `The sum of ${num1} and ${num2} is ${num1 + num2}.`;
    }
  }
  
  if (lowerMessage.match(/what\s+is\s+(\d+)\s*\-\s*(\d+)/i)) {
    const match = lowerMessage.match(/what\s+is\s+(\d+)\s*\-\s*(\d+)/i);
    if (match && match[1] && match[2]) {
      const num1 = parseInt(match[1]);
      const num2 = parseInt(match[2]);
      return `${num1} minus ${num2} equals ${num1 - num2}.`;
    }
  }
  
  if (lowerMessage.match(/what\s+is\s+(\d+)\s*\*\s*(\d+)/i) || lowerMessage.match(/what\s+is\s+(\d+)\s*x\s*(\d+)/i) || lowerMessage.match(/what\s+is\s+(\d+)\s*times\s*(\d+)/i)) {
    const match = lowerMessage.match(/what\s+is\s+(\d+)\s*\*\s*(\d+)/i) || lowerMessage.match(/what\s+is\s+(\d+)\s*x\s*(\d+)/i) || lowerMessage.match(/what\s+is\s+(\d+)\s*times\s*(\d+)/i);
    if (match && match[1] && match[2]) {
      const num1 = parseInt(match[1]);
      const num2 = parseInt(match[2]);
      return `${num1} multiplied by ${num2} equals ${num1 * num2}.`;
    }
  }
  
  if (lowerMessage.match(/what\s+is\s+(\d+)\s*\/\s*(\d+)/i) || lowerMessage.match(/what\s+is\s+(\d+)\s*divided\s+by\s*(\d+)/i)) {
    const match = lowerMessage.match(/what\s+is\s+(\d+)\s*\/\s*(\d+)/i) || lowerMessage.match(/what\s+is\s+(\d+)\s*divided\s+by\s*(\d+)/i);
    if (match && match[1] && match[2]) {
      const num1 = parseInt(match[1]);
      const num2 = parseInt(match[2]);
      if (num2 === 0) {
        return "I cannot divide by zero. Division by zero is undefined.";
      }
      return `${num1} divided by ${num2} equals ${(num1 / num2).toFixed(2)}.`;
    }
  }
  
  // Capital cities
  if (lowerMessage.includes('capital') && lowerMessage.includes('india')) {
    return "The capital of India is New Delhi.";
  }
  if (lowerMessage.includes('capital') && lowerMessage.includes('usa') || lowerMessage.includes('capital') && lowerMessage.includes('united states')) {
    return "The capital of the United States is Washington, D.C.";
  }
  if (lowerMessage.includes('capital') && lowerMessage.includes('uk') || lowerMessage.includes('capital') && lowerMessage.includes('united kingdom')) {
    return "The capital of the United Kingdom is London.";
  }
  if (lowerMessage.includes('capital') && lowerMessage.includes('france')) {
    return "The capital of France is Paris.";
  }
  if (lowerMessage.includes('capital') && lowerMessage.includes('japan')) {
    return "The capital of Japan is Tokyo.";
  }
  if (lowerMessage.includes('capital') && lowerMessage.includes('china')) {
    return "The capital of China is Beijing.";
  }
  if (lowerMessage.includes('capital') && lowerMessage.includes('australia')) {
    return "The capital of Australia is Canberra.";
  }
  if (lowerMessage.includes('capital') && lowerMessage.includes('brazil')) {
    return "The capital of Brazil is Brasília.";
  }
  if (lowerMessage.includes('capital') && lowerMessage.includes('canada')) {
    return "The capital of Canada is Ottawa.";
  }
  if (lowerMessage.includes('capital') && lowerMessage.includes('russia')) {
    return "The capital of Russia is Moscow.";
  }
  
  // Common knowledge questions
  if (lowerMessage.includes('what is ai') || lowerMessage.includes('what is artificial intelligence')) {
    return "Artificial Intelligence (AI) refers to systems or machines that mimic human intelligence to perform tasks and can iteratively improve themselves based on the information they collect. AI encompasses various technologies including machine learning, natural language processing, computer vision, and more.";
  }
  
  if (lowerMessage.includes('what is machine learning')) {
    return "Machine Learning is a subset of artificial intelligence that focuses on building systems that learn from data. Instead of explicitly programming rules, these systems identify patterns in data and make decisions with minimal human intervention.";
  }
  
  if (lowerMessage.includes('what is chatgpt')) {
    return "ChatGPT is an AI language model developed by OpenAI. It's designed to understand and generate human-like text based on the input it receives, making it useful for conversations, answering questions, creating content, and more.";
  }
  
  if (lowerMessage.includes('what is python')) {
    return "Python is a high-level, interpreted programming language known for its readability and simplicity. It's widely used in areas like web development, data analysis, artificial intelligence, scientific computing, and automation.";
  }
  
  if (lowerMessage.includes('what is javascript')) {
    return "JavaScript is a programming language primarily used for creating interactive elements on websites. It's a core technology of the World Wide Web alongside HTML and CSS, and can also be used for server-side programming with Node.js.";
  }
  
  // Basic greetings and questions
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello there! How can I help you today?";
  } else if (lowerMessage.includes('how are you')) {
    return "I'm doing well, thank you for asking! How can I assist you?";
  } else if (lowerMessage.includes('help')) {
    return "I'd be happy to help. Please let me know what you need assistance with.";
  } else if (lowerMessage.includes('thank')) {
    return "You're welcome! Is there anything else I can help with?";
  } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
    return "Goodbye! Have a great day!";
  } else if (lowerMessage.includes('weather')) {
    return "I'm sorry, I don't have access to real-time weather data. You might want to check a weather service or app for that information.";
  } else if (lowerMessage.includes('name')) {
    return "I'm an AI assistant here to help you with your questions.";
  } else if (lowerMessage.includes('joke')) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "What do you call a bear with no teeth? A gummy bear!"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  } else {
    return "I understand you're asking a question. I'm currently running in a limited mode without full access to AI capabilities. I can answer basic questions about capitals, do simple math, or provide general information about common topics. Could you try asking about one of these areas?";
  }
}

export const sendChatsToUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered or token malfunctioned" });
        }

        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).json({ message: "Permissions didn't match" });
        }

        return res.status(200).json({ message: "OK", chats: user.chats });
    } catch (error:any) {
        console.error(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};

export const deleteChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered or token malfunctioned" });
        }

        user.chats.length = 0;
        await user.save();

        return res.status(200).json({ message: "OK" });
    } catch (error:any) {
        console.error(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
