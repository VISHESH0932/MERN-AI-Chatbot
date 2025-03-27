import axios from 'axios';
import dotenv from 'dotenv';
// Ensure environment variables are loaded
dotenv.config();
const hfApiKey = process.env.HUGGING_FACE_API_KEY;
const hfModel = process.env.HUGGING_FACE_MODEL || 'gpt2'; // Fallback to a widely available model
if (!hfApiKey) {
    console.error('Hugging Face API key is not defined in environment variables.');
    // Uncomment below line if you want the app to fail immediately when API key is missing
    // throw new Error('Hugging Face API key is not defined in environment variables.');
}
if (!hfModel) {
    console.error('Hugging Face model is not defined in environment variables.');
    // Uncomment below line if you want the app to fail immediately when model is missing
    // throw new Error('Hugging Face model is not defined in environment variables.');
}
console.log("Using Hugging Face model:", hfModel);
const hf = axios.create({
    baseURL: `https://api-inference.huggingface.co/models/${hfModel}`,
    headers: { Authorization: `Bearer ${hfApiKey || ''}` },
    timeout: 60000, // Set a longer timeout (60 seconds)
});
console.log('Authorization Header:', hf.defaults.headers['Authorization']);
// Add response interceptor for better error logging
hf.interceptors.response.use((response) => response, (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("HF API Error Response:", {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers
        });
    }
    else if (error.request) {
        // The request was made but no response was received
        console.error("HF API No Response:", error.request);
    }
    else {
        // Something happened in setting up the request that triggered an Error
        console.error("HF API Request Error:", error.message);
    }
    return Promise.reject(error);
});
export default hf;
