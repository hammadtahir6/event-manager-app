
import { GoogleGenAI } from "@google/genai";
import { Individual, Business } from "../types";

// Initialize the Gemini AI client
// The API key is assumed to be available in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEmailDraft = async (individual: Individual, context: string): Promise<string> => {
  try {
    const prompt = `
      You are a professional and warm event hall manager assistant.
      Write an email to an individual named ${individual.name} (Partner: ${individual.partnerName || 'N/A'}).
      Their status is ${individual.status}.
      Event Date: ${individual.weddingDate}.
      Context/Goal of email: ${context}.
      Keep the tone elegant, celebratory, and helpful.
      Do not include placeholders like "[Your Name]", sign it as "The EventManager Team".
      Return only the email body text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate draft.";
  } catch (error) {
    console.error("Error generating email:", error);
    return "Error generating draft. Please try again.";
  }
};

export const generateBusinessEmailDraft = async (business: Business): Promise<string> => {
  try {
    const prompt = `
      You are a professional event hall manager.
      Write a business inquiry email to a vendor named "${business.name}" (Category: ${business.category}).
      Contact Person: ${business.contactName}.
      
      Goal: Inquire about their availability and rates for upcoming events at our venue. Express interest in adding them to our preferred vendor list.
      
      Keep the tone professional, concise, and partnership-oriented.
      Sign it as "The EventManager Team".
      Return only the email body text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate draft.";
  } catch (error) {
    console.error("Error generating business email:", error);
    return "Error generating draft. Please try again.";
  }
};

export const generateEventIdeas = async (individual: Individual): Promise<string> => {
  try {
    const prompt = `
      You are a creative event planner.
      An individual (${individual.name} & ${individual.partnerName || 'Partner'}) is planning an event.
      Details:
      - Date: ${individual.weddingDate}
      - Guests: ${individual.guestCount}
      - Budget: $${individual.budget || 'Unknown'}
      - Preferences: ${individual.preferences}

      Please provide 3 distinct Event Concepts. For each concept, include:
      1. **Theme Name**: A creative title.
      2. **Decor**: Specific decor ideas that fit the season of the event date.
      3. **Menu Concept**: A cohesive menu (Appetizer, Main, Dessert) that matches the theme perfectly.

      Format the output as clear Markdown with bold headings for each Concept.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate ideas.";
  } catch (error) {
    console.error("Error generating ideas:", error);
    return "Error generating ideas. Please try again.";
  }
};

export const generateUpgradesAndServices = async (individual: Individual): Promise<string> => {
  try {
    const prompt = `
      You are an expert event planner and revenue optimization specialist for an event hall.
      Your goal is to suggest high-value upgrades and complementary services to a client.
      
      Client Details:
      - Event Type: ${individual.eventType}
      - Event Name: ${individual.eventName || 'N/A'}
      - Expected Guest Count: ${individual.guestCount}
      - Current Preferences/Vibe: ${individual.preferences || 'General Luxury'}
      - Internal Notes: ${individual.notes || 'None'}

      Based on these details, suggest 4 specific, creative, and lucrative "Elite Upgrades" or "Add-on Services". 
      For each suggestion:
      1. **Upgrade Title**: A catchy name.
      2. **Why it fits**: Explain why this specifically matches their event type/vibe.
      3. **Value Proposition**: How it improves the guest experience.
      4. **Estimated Upsell Tier**: (e.g., Premium, Ultra-Luxury).

      Format the output as clear Markdown with bold headings.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate suggestions.";
  } catch (error) {
    console.error("Error generating upgrades:", error);
    return "Error generating suggestions. Please try again.";
  }
};

// Fix: Implement missing generateEventTimeline export
export const generateEventTimeline = async (individual: Individual): Promise<string> => {
  try {
    const prompt = `
      You are an expert event coordinator.
      Create a detailed day-of timeline for the following event:
      - Event Type: ${individual.eventType}
      - Event Name: ${individual.eventName || 'N/A'}
      - Date: ${individual.weddingDate}
      - Time Slot: ${individual.eventTime || 'Full Day'}
      - Guest Count: ${individual.guestCount}
      - Preferences: ${individual.preferences || 'None'}

      Provide a chronological schedule from setup to teardown. Include key milestones like arrival, ceremony/start, meals, and closing.
      Format the output as clear Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate timeline.";
  } catch (error) {
    console.error("Error generating timeline:", error);
    return "Error generating timeline. Please try again.";
  }
};

// Fix: Implement missing generateEntertainmentSuggestions export
export const generateEntertainmentSuggestions = async (individual: Individual): Promise<string> => {
  try {
    const prompt = `
      You are an entertainment booking agent for high-end events.
      Suggest 4 creative and engaging entertainment options for this event:
      - Event Type: ${individual.eventType}
      - Event Name: ${individual.eventName || 'N/A'}
      - Preferences: ${individual.preferences || 'Elegant & Fun'}
      - Guest Count: ${individual.guestCount}

      For each suggestion, include:
      1. **Entertainment Name**
      2. **Description**: What the performance/activity involves.
      3. **Vibe**: (e.g., High Energy, Atmospheric, Interactive).
      4. **Why it fits**: Specific reason based on the event details.

      Format the output as clear Markdown with bold headings.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate entertainment suggestions.";
  } catch (error) {
    console.error("Error generating entertainment:", error);
    return "Error generating suggestions. Please try again.";
  }
};

export const generateGiftsAndFavors = async (individual: Individual): Promise<string> => {
  try {
    const prompt = `
      You are a luxury event gift and favor consultant.
      The client is planning a ${individual.eventType} (${individual.eventName || 'Unnamed Event'}).
      Event Details:
      - Date: ${individual.weddingDate}
      - Guest Count: ${individual.guestCount}
      - Theme/Preferences: ${individual.preferences || 'Elegant & Sophisticated'}
      - Budget Context: ${individual.currency || 'USD'} ${individual.budget || 'Flexible'}

      Suggest 3 unique, thoughtful party favor or gift registry ideas that perfectly complement this specific event. 
      For each idea, explain why it's a great fit and provide an estimated "Vibe Check" (e.g., Luxury, Eco-Friendly, Fun & Casual).

      Format the output as clear Markdown with bold headings.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate gift suggestions.";
  } catch (error) {
    console.error("Error generating gifts:", error);
    return "Error generating gift ideas. Please try again.";
  }
};

export const findVendorsWithAI = async (city: string, category: string, eventType?: string, preferences?: string): Promise<{ text: string, links: { title: string, uri: string }[] }> => {
  try {
    const prompt = `
      You are a local event matchmaking expert. I am planning a ${eventType || 'event'} in ${city}.
      Specific Preferences for the event: "${preferences || 'No specific preferences'}".
      
      Please find 5 highly rated and popular vendors in the category "${category}" in ${city} that would be a perfect match for this specific event type and aesthetic.
      
      For each vendor, include:
      1. **Name and Rating**
      2. **Signature Style**: Brief description of what they are known for.
      3. **Why they match**: A specific sentence explaining why they are recommended for THIS specific "${eventType}" and these preferences.
      
      Provide your response in professional Markdown.
    `;

    // Fix: Maps grounding is only supported in Gemini 2.5 series models.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const text = response.text || "No results found.";
    const links: { title: string, uri: string }[] = [];

    // Extract grounding chunks for Maps
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.maps?.uri) {
           links.push({ title: chunk.maps.title || 'View on Google Maps', uri: chunk.maps.uri });
        }
      });
    }

    return { text, links };
  } catch (error) {
    console.error("Error finding vendors:", error);
    return { text: "Unable to search for vendors at this time.", links: [] };
  }
};

export const generateBusinessGrowthPlan = async (name: string, category: string, city: string): Promise<string> => {
  try {
    const prompt = `
      You are a Business Growth Consultant specializing in the Event Industry.
      A new vendor named "${name}" has just registered on our platform but hasn't received any inquiries yet.
      
      Details:
      - Business Category: ${category}
      - Location: ${city}

      Please provide a "Jumpstart Strategy" with 3 concrete, actionable steps to get their first customer inquiry THIS WEEK.
      
      Include:
      1. **Social Media Hook**: A specific idea for an Instagram/Facebook post (including a caption draft) tailored to ${category} in ${city}.
      2. **Local Outreach**: A specific type of local partner (e.g., "Wedding Planners in ${city}") to contact, with a 1-sentence opening line.
      3. **Promotional Offer**: A creative limited-time offer idea that is low cost but high value to attract new leads.

      Format the output as clear Markdown with bold headings. Tone should be motivating and practical.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate growth plan.";
  } catch (error) {
    console.error("Error generating growth plan:", error);
    return "Error generating strategy. Please try again.";
  }
};

export const generateLeadTargetingStrategy = async (
  name: string, 
  category: string, 
  city: string, 
  leadSummary: string
): Promise<string> => {
  try {
    const prompt = `
      You are a smart business development assistant for a vendor named "${name}" (${category}) in ${city}.
      We have detected the following potential leads (people actively planning events) in the local area:
      "${leadSummary}"

      Please generate a targeted outreach strategy to attract these specific potential clients.
      
      Provide:
      1. **Direct Outreach Template**: A generic but personalized-sounding message that could be sent to these users (if the platform allows) or used in direct mail/email marketing. Focus on their likely needs based on the summary.
      2. **Social Media "Bait"**: A social media post specifically designed to catch the attention of this demographic (e.g., "Planning a wedding in ${city}?").
      3. **Unique Selling Point**: Why they should choose ${name} over competitors for these specific event types.

      Format as clear Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate targeting strategy.";
  } catch (error) {
    console.error("Error generating targeting strategy:", error);
    return "Error generating strategy. Please try again.";
  }
};
