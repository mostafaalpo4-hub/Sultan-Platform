
import { GoogleGenAI, Type } from "@google/genai";

// Initialize with process.env.API_KEY directly as per naming and parameter guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Scans a message for profanity or harmful content
   */
  async profanityFilter(text: string): Promise<{ isSafe: boolean; reason?: string }> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this Arabic/English text for profanity, insults, or harmful content. Respond in JSON. Text: "${text}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isSafe: { type: Type.BOOLEAN },
              reason: { type: Type.STRING }
            },
            required: ["isSafe"]
          }
        }
      });
      // response.text is a property, not a method, returning the extracted string output
      return JSON.parse(response.text || '{"isSafe": true}');
    } catch (e) {
      console.error("Gemini Filter Error", e);
      return { isSafe: true };
    }
  },

  /**
   * Scans a URL for malicious intent
   */
  async scanUrl(url: string): Promise<{ isSafe: boolean; rating: string }> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze if this URL looks like a phishing or malicious link. URL: ${url}. Respond in JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isSafe: { type: Type.BOOLEAN },
              rating: { type: Type.STRING, description: "Safe, Risky, or Dangerous" }
            },
            required: ["isSafe", "rating"]
          }
        }
      });
      // response.text is accessed as a property
      return JSON.parse(response.text || '{"isSafe": true, "rating": "Unknown"}');
    } catch (e) {
      return { isSafe: true, rating: "Safe (Local)" };
    }
  }
};
