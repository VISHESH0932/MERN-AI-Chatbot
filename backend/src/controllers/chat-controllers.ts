import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import hf from '../config/hf-config.js'; // Assuming this is a pre-configured Axios instance for the HF API

/**
 * Generates a chat completion response using Hugging Face API with fallback logic.
 */
export const generationChatCompletion = async (req: Request, res: Response, next: NextFunction) => {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim() === "") {
        return res.status(400).json({ message: 'Message is required and must be a non-empty string.' });
    }

    try {
        // 1. Verify User
        if (!res.locals.jwtData || !res.locals.jwtData.id) {
            console.warn("JWT data missing in res.locals during chat generation.");
            return res.status(401).json({ message: 'Authentication data missing' });
        }
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            console.warn(`User not found for ID: ${res.locals.jwtData.id} during chat generation.`);
            return res.status(401).json({ message: 'User not found associated with this token' });
        }

        // 2. Store User Message & Prepare History for API
        // Mongoose initializes user.chats as an empty DocumentArray if needed.
        // No need for: if (!Array.isArray(user.chats)) { user.chats = []; } << REMOVED
        user.chats.push({ role: 'user', content: message }); // This works directly

        // Format conversation history for the model input string
        let conversationString = "";
        const relevantHistory = user.chats;

        for (const chat of relevantHistory) {
            if (chat.content && typeof chat.content === 'string') {
                 if (chat.role === 'user') {
                     conversationString += `User: ${chat.content.trim()}\n`;
                 } else if (chat.role === 'assistant') {
                     conversationString += `Assistant: ${chat.content.trim()}\n`;
                 }
            }
        }
        if (!conversationString.endsWith('Assistant:')) {
             if (conversationString.endsWith('\n')) {
                conversationString += 'Assistant:';
             } else {
                conversationString += '\nAssistant:';
             }
        }

        let assistantMessage = '';

        // 3. Attempt Hugging Face API Call
        try {
            console.log(`Attempting HF API call for user ${user.id}. Input length: ${conversationString.length}`);
            const chatResponse = await hf.post('/', {
                inputs: conversationString,
                parameters: { /* Add model-specific parameters if needed */ }
            });

            console.log(`HF API response status: ${chatResponse.status} for user ${user.id}`);

            // --- Parse API Response ---
            if (Array.isArray(chatResponse.data) && chatResponse.data.length > 0 && chatResponse.data[0].generated_text) {
                const generatedText = chatResponse.data[0].generated_text;
                if (typeof generatedText === 'string' && generatedText.startsWith(conversationString)) {
                     assistantMessage = generatedText.substring(conversationString.length).trim();
                } else if (typeof generatedText === 'string') {
                    const parts = generatedText.split('Assistant:');
                    assistantMessage = parts.pop()?.trim() || '';
                    console.warn("HF response did not start with input string, used fallback parsing.");
                }
            } else {
                console.warn("Unexpected HF API response structure:", chatResponse.data);
            }

            if (!assistantMessage) {
                console.warn(`HF API call successful but failed to parse assistant message for user ${user.id}.`);
                assistantMessage = generateFallbackResponse(message);
            }

        } catch (apiError: any) {
            console.error(`HF API Error for user ${user.id}:`, apiError.response?.data || apiError.message || apiError);
            assistantMessage = generateFallbackResponse(message);
        }

        // 4. Final Fallback & Store Assistant Message
        if (!assistantMessage || assistantMessage.trim() === '') {
            console.log(`Using default 'cannot respond' message for user ${user.id}.`);
            assistantMessage = "I'm sorry, I couldn't generate a response for that. Please try asking differently.";
        }

        user.chats.push({ role: 'assistant', content: assistantMessage });
        await user.save();

        // 5. Return Updated Chats
        return res.status(200).json({ chats: user.chats });

    } catch (error: any) {
        console.error("Unexpected Error in generationChatCompletion:", error);
        return res.status(500).json({ message: 'An internal server error occurred.', error: error.message });
    }
};


/**
 * Fallback response generator when API fails or parsing fails.
 */
function generateFallbackResponse(message: string): string {
    // ... (keep your existing fallback logic here) ...
    const lowerMessage = message.toLowerCase().trim();

    // --- Keep your existing fallback logic here ---
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
        return "Hello there! How can I help you today? (Fallback mode)";
      } else if (lowerMessage.includes('how are you')) {
        return "I'm operating in fallback mode, but ready to help with basic info! (Fallback mode)";
      } else if (lowerMessage.includes('help')) {
        return "I can try to help with basic info like capitals or simple math. What do you need? (Fallback mode)";
      } else if (lowerMessage.includes('thank')) {
        return "You're welcome! (Fallback mode)";
      } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
        return "Goodbye! (Fallback mode)";
      } else if (lowerMessage.includes('weather')) {
        return "Sorry, I can't check the weather in fallback mode.";
      } else if (lowerMessage.includes('name')) {
        return "I'm an AI assistant, currently in fallback mode.";
      } else if (lowerMessage.includes('joke')) {
        const jokes = [
          "Why don't scientists trust atoms? Because they make up everything! (Fallback joke)",
          "What do you call a fake noodle? An impasta! (Fallback joke)",
          "Why did the scarecrow win an award? Because he was outstanding in his field! (Fallback joke)",
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
      }
      // --- End of existing fallback logic ---

    return "I'm currently running in a limited mode due to an issue connecting to the main AI. I can only provide very basic information. Please try again later for a full response.";
}

/**
 * Sends the user's current chat history.
 */
export const sendChatsToUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Verify User
        if (!res.locals.jwtData || !res.locals.jwtData.id) {
             console.warn("JWT data missing in res.locals when sending chats.");
             return res.status(401).json({ message: 'Authentication data missing' });
        }
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            console.warn(`User not found for ID: ${res.locals.jwtData.id} when sending chats.`);
            return res.status(401).json({ message: "User not found associated with this token" });
        }

        // 2. Send Chats
        console.log(`Sending chat history for user ${user.id}. Count: ${user.chats?.length || 0}`);
        return res.status(200).json({ message: "OK", chats: user.chats || [] });

    } catch (error: any) {
        console.error("Error in sendChatsToUser:", error);
        return res.status(500).json({ message: "An internal server error occurred.", cause: error.message });
    }
};

/**
 * Deletes all chats for the authenticated user.
 */
export const deleteChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Verify User
         if (!res.locals.jwtData || !res.locals.jwtData.id) {
             console.warn("JWT data missing in res.locals during chat deletion.");
             return res.status(401).json({ message: 'Authentication data missing' });
         }
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            console.warn(`User not found for ID: ${res.locals.jwtData.id} during chat deletion.`);
            return res.status(401).json({ message: "User not found associated with this token" });
        }

        // 2. Delete Chats
        const chatCount = user.chats?.length || 0;
        // Correct way to clear a Mongoose DocumentArray in place:
        user.chats.splice(0, user.chats.length); // <<< CORRECTED LINE
        await user.save();
        console.log(`Deleted ${chatCount} chats for user ${user.id}.`);

        return res.status(200).json({ message: "OK" });

    } catch (error: any) {
        console.error("Error in deleteChats:", error);
        return res.status(500).json({ message: "An internal server error occurred.", cause: error.message });
    }
};