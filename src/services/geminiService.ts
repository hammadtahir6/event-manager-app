import { GoogleGenAI } from "@google/genai";
import { Individual, Business } from "../types";

// Helper function to safely get the API Key
// This prevents the app from crashing on load if the key is missing
const getApiKey = () => {
  // Check Vite env var first, then process.env fallback
  const key = import.meta.env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn("Gemini API Key is missing. AI features will not work.");
    return "";
  }
  return key;
};

// Helper to initialize AI client only when needed
const getAiClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
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