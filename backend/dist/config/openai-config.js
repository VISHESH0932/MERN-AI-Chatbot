import { HfInference } from '@huggingface/inference';
const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
export default hf;
// import { Configuration } from "openai";
// export const configureOpenAI = () => {
//     return new Configuration({
//         apiKey: process.env.OPEN_AI_SECRET,
//         organization: process.env.OPENAI_ORGANIZATION_ID,
//     });
// }
