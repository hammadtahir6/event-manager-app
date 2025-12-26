import { GoogleGenAI } from "@google/genai";
import { Individual, Business } from "../types";

// --- API KEY CONFIGURATION ---
// Ideally, use environment variables. For this demo, we use the provided key.
const API_KEY = "AIzaSyD9deHSHjXg_zFqspoRz7yo__cOzIuRQv4";

// Helper to initialize AI client only when needed
const getAiClient = () => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

// --- AI FUNCTIONS ---

export const generateEmailDraft = async (individual: Individual, context: string): Promise<string> => {
  try {
    const prompt = `
      You are a professional and warm event hall manager assistant.
      Write an email to an individual named ${individual.name} (Partner: ${individual.partnerName || 'N/A'}).
      Their status is ${individual.status}.
      Event Date: ${individual.weddingDate}.
      Context/Goal of email: ${context}.
      Sign it as "The EventManager Team".
      Return only the email body text.
    `;

    // Initialize AI client here (lazily)
    const ai = getAiClient();
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: { role: 'user', parts: [{ text: prompt }] }, 
    } as any);

    return (response as any).text?.() || (response as any).candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate draft.";
  } catch (error) {
    console.error("Error generating email:", error);
    return `Error: ${error instanceof Error ? error.message : "AI generation failed."}`;
  }
};

export const generateBusinessEmailDraft = async (business: Business): Promise<string> => {
  try {
    const prompt = `
      Write a business inquiry email to vendor "${business.name}" (${business.category}).
      Goal: Partner for upcoming weddings.
      Sign as "The EventManager Team".
    `;

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: { role: 'user', parts: [{ text: prompt }] },
    } as any);

    return (response as any).text?.() || "Unable to generate draft.";
  } catch (error) {
    console.error("Error generating business email:", error);
    return `Error: ${error instanceof Error ? error.message : "AI generation failed."}`;
  }
};

export const generateBusinessGrowthPlan = async (business: Business): Promise<string> => {
  try {
    const prompt = `
      Analyze business "${business.name}" (${business.category}).
      Generate a 3-point growth strategy.
      Format as Markdown.
    `;

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: { role: 'user', parts: [{ text: prompt }] },
    } as any);

    return (response as any).text?.() || "Unable to generate plan.";
  } catch (error) {
    console.error("Error generating plan:", error);
    return `Error: ${error instanceof Error ? error.message : "AI generation failed."}`;
  }
};

export const generateEventIdeas = async (individual: Individual): Promise<string> => {
  try {
    const prompt = `
      Suggest 3 creative themes for a ${individual.eventType}.
      Client: ${individual.name}.
      Format as Markdown.
    `;

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: { role: 'user', parts: [{ text: prompt }] },
    } as any);

    return (response as any).text?.() || "Unable to generate ideas.";
  } catch (error) {
    console.error("Error generating ideas:", error);
    return `Error: ${error instanceof Error ? error.message : "AI generation failed."}`;
  }
};

export const findVendorsWithAI = async (category: string, city: string, budget: string): Promise<string> => {
  try {
    const prompt = `
      Recommend 3 ${category} vendors in ${city} for budget ${budget}.
      Format as Markdown.
    `;

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: { role: 'user', parts: [{ text: prompt }] },
    } as any);

    return (response as any).text?.() || "Unable to find vendors.";
  } catch (error) {
    console.error("Error finding vendors:", error);
    return `Error: ${error instanceof Error ? error.message : "AI generation failed."}`;
  }
};

export const generateUpgradesAndServices = async (individual: Individual): Promise<string> => {
    try {
        const prompt = `Suggest 3 upsells for ${individual.eventType} (${individual.guestCount} guests). Markdown.`;
        const ai = getAiClient();
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: { role: 'user', parts: [{ text: prompt }] },
        } as any);
        return (response as any).text?.() || "Unable to generate upgrades.";
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : "AI generation failed."}`;
      }
};

export const generateEventTimeline = async (individual: Individual): Promise<string> => {
    try {
        const prompt = `Create timeline for ${individual.eventType} at ${individual.eventTime}.`;
        const ai = getAiClient();
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: { role: 'user', parts: [{ text: prompt }] },
        } as any);
        return (response as any).text?.() || "Unable to generate timeline.";
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : "AI generation failed."}`;
      }
};

export const generateEntertainmentSuggestions = async (individual: Individual): Promise<string> => {
    try {
        const prompt = `Suggest 3 entertainment options for ${individual.eventType}.`;
        const ai = getAiClient();
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: { role: 'user', parts: [{ text: prompt }] },
        } as any);
        return (response as any).text?.() || "Unable to generate entertainment.";
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : "AI generation failed."}`;
      }
};

export const generateGiftsAndFavors = async (individual: Individual): Promise<string> => {
    try {
        const prompt = `Suggest 3 gift ideas for ${individual.eventType}.`;
        const ai = getAiClient();
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: { role: 'user', parts: [{ text: prompt }] },
        } as any);
        return (response as any).text?.() || "Unable to generate gift ideas.";
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : "AI generation failed."}`;
      }
};

export const generateLeadTargetingStrategy = async (name: string, category: string, city: string, leadSummary: string): Promise<string> => {
  try {
    const prompt = `Generate targeting strategy for ${name} (${category}) in ${city}. Leads: ${leadSummary}.`;
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: { role: 'user', parts: [{ text: prompt }] },
    } as any);
    return (response as any).text?.() || "Unable to generate strategy.";
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : "AI generation failed."}`;
  }
};