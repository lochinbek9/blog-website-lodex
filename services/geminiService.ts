
import { GoogleGenAI, Type } from "@google/genai";

// Guideline bo'yicha apiKey'ni process.env.API_KEY orqali olish
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBlogAISummary = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this blog content into 2 engaging sentences: ${content}`,
    });
    return response.text || "Summary unavailable.";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "AI was unable to generate summary.";
  }
};

export const parseTelegramCommand = async (message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Parse: "${message}". Format: JSON with action, data (title, content, category), response_text.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING },
            response_text: { type: Type.STRING },
            data: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                category: { type: Type.STRING }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { action: 'unknown' };
  }
};

export const generateBlogImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Professional editorial blog cover for: ${prompt}. Minimalist, dark background, 4k.` }],
      },
      config: {
        imageConfig: { aspectRatio: "16:9" },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};
