
import { GoogleGenAI, Type } from "@google/genai";
import { SuggestionResponse } from "../types";
import { CATEGORIES } from "../constants";

export const analyzeItemImage = async (imageBase64: string): Promise<SuggestionResponse | null> => {
  if (!process.env.API_KEY) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64.split(',')[1] || imageBase64
            }
          },
          {
            text: `Analyse cet article pour un site de revente d'occasion (type Vinted). Fournis un titre accrocheur, une description séduisante en français, un prix suggéré en Euros, et choisis la catégorie la plus pertinente parmi cette liste exacte : [${CATEGORIES.join(', ')}]. Retourne UNIQUEMENT du JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedTitle: { type: Type.STRING },
            suggestedDescription: { type: Type.STRING },
            suggestedPrice: { type: Type.NUMBER },
            suggestedCategory: { type: Type.STRING }
          },
          required: ["suggestedTitle", "suggestedDescription", "suggestedPrice", "suggestedCategory"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as SuggestionResponse;
    }
    return null;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};

export const refineDescription = async (title: string, category: string): Promise<string | null> => {
  if (!process.env.API_KEY) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Génère une description courte, honnête et attractive en français pour un article d'occasion intitulé "${title}" dans la catégorie "${category}". Utilise des mots-clés pertinents pour la revente.`,
    });

    return response.text || null;
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return null;
  }
};
