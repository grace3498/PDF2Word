import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

export const extractContent = async (file: File): Promise<string> => {
  const model = 'gemini-3-flash-preview';

  const prompt = 'Extract all text content from this file. Preserve the original formatting as much as possible, including paragraphs, headings, and lists.';
  
  const imagePart = await fileToGenerativePart(file);
  
  const response = await ai.models.generateContent({
    model: model,
    contents: [{ parts: [{ text: prompt }, imagePart] }],
  });

  if (!response.text) {
    throw new Error('Failed to extract content from the file.');
  }

  return response.text;
};
