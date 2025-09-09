import { GoogleGenAI, Type } from "@google/genai";
import { ZodiacSign, Horoscope, HoroscopeTimeframe, ZodiacInfo, CompatibilityInfo, PlanetInfo, AstrologicalEvent, ChineseZodiacSign, ChineseZodiacInfo } from '../types';
import { PLANETS } from "../constants";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

export const getDailyFact = async (topic: 'western astrology' | 'chinese astrology' | 'astronomy'): Promise<{ fact: string }> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a single, fascinating, and little-known fact about ${topic}. The fact should be concise and easy for a general audience to understand.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fact: {
              type: Type.STRING,
              description: "A fascinating fact about the specified topic.",
            },
          },
          required: ["fact"],
        },
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error(`Error generating daily ${topic} fact:`, error);
    throw new Error(`Failed to generate a daily ${topic} fact.`);
  }
};

export const generateHoroscope = async (sign: ZodiacSign, timeframe: HoroscopeTimeframe): Promise<Horoscope> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a ${timeframe.toLowerCase()} horoscope for the zodiac sign ${sign}. Provide insights on love, career, and health.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            love: { type: Type.STRING, description: "Horoscope for love life." },
            career: { type: Type.STRING, description: "Horoscope for career and work." },
            health: { type: Type.STRING, description: "Horoscope for health and wellness." },
          },
          required: ["love", "career", "health"],
        },
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error("Error generating horoscope:", error);
    throw new Error("Failed to generate horoscope.");
  }
};

export const getZodiacInfo = async (sign: ZodiacSign): Promise<ZodiacInfo> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Provide detailed information about the zodiac sign ${sign}. Include key personality traits, general compatibility with other signs, its ruling planet, and element.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personality_traits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of key personality traits."
            },
            compatibility: { type: Type.STRING, description: "General compatibility with other zodiac signs." },
            ruling_planet: { type: Type.STRING, description: "The ruling planet of the sign." },
            element: { type: Type.STRING, description: "The element (e.g., Fire, Water) of the sign." },
          },
          required: ["personality_traits", "compatibility", "ruling_planet", "element"],
        },
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error("Error getting zodiac info:", error);
    throw new Error("Failed to get zodiac information.");
  }
};

export const checkCompatibility = async (sign1: ZodiacSign, sign2: ZodiacSign): Promise<CompatibilityInfo> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Analyze the compatibility between ${sign1} and ${sign2}. Provide a compatibility percentage and a detailed explanation of their relationship dynamics, covering strengths and weaknesses.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            percentage: { type: Type.INTEGER, description: "A compatibility score from 0 to 100." },
            explanation: { type: Type.STRING, description: "A detailed explanation of the compatibility." },
          },
          required: ["percentage", "explanation"],
        },
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error("Error checking compatibility:", error);
    throw new Error("Failed to check compatibility.");
  }
};

export const getPlanetInfo = async (planetName: string): Promise<PlanetInfo> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Provide key information about the planet ${planetName}. Include its mass, diameter, average distance from the sun, and a list of three fun facts.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        mass: { type: Type.STRING, description: "Mass of the planet (e.g., in kg)." },
                        diameter: { type: Type.STRING, description: "Diameter of the planet (e.g., in km)." },
                        distance_from_sun: { type: Type.STRING, description: "Average distance from the Sun (e.g., in km)." },
                        fun_facts: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of fun facts about the planet."
                        },
                    },
                    required: ["name", "mass", "diameter", "distance_from_sun", "fun_facts"],
                },
            },
        });
        const parsedResponse = JSON.parse(response.text);
        return parsedResponse;
    } catch (error) {
        console.error(`Error getting info for planet ${planetName}:`, error);
        throw new Error(`Failed to get information for ${planetName}.`);
    }
};

export const getTodaysAstrologicalEvents = async (): Promise<AstrologicalEvent[]> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: "Generate a list of 3-5 significant astrological events for today. For each event, provide an appropriate emoji, a title, and a short, user-friendly description. Examples include moon phases, planetary retrogrades, or major aspects between planets.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              emoji: { type: Type.STRING, description: "An emoji that represents the event." },
              title: { type: Type.STRING, description: "The title of the astrological event." },
              description: { type: Type.STRING, description: "A brief, user-friendly description of the event's significance." }
            },
            required: ["emoji", "title", "description"]
          }
        },
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error("Error generating astrological events:", error);
    throw new Error("Failed to generate astrological events.");
  }
};

export const getZodiacSignFromBirthData = async (birthDate: string, birthPlace: string): Promise<{ zodiacSign: ZodiacSign }> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Determine the zodiac sign for a person born on ${birthDate} in ${birthPlace}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            zodiacSign: {
              type: Type.STRING,
              description: "The calculated zodiac sign.",
              enum: Object.values(ZodiacSign),
            },
          },
          required: ["zodiacSign"],
        },
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error("Error getting zodiac sign from birth data:", error);
    throw new Error("Failed to determine zodiac sign.");
  }
};

export const getChineseZodiacSignFromBirthData = async (birthDate: string): Promise<{ chineseZodiacSign: ChineseZodiacSign }> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Determine the Chinese zodiac sign for a person born on ${birthDate}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chineseZodiacSign: {
              type: Type.STRING,
              description: "The calculated Chinese zodiac sign.",
              enum: Object.values(ChineseZodiacSign),
            },
          },
          required: ["chineseZodiacSign"],
        },
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error("Error getting Chinese zodiac sign from birth data:", error);
    throw new Error("Failed to determine Chinese zodiac sign.");
  }
};

export const getClosestPlanetToEarth = async (): Promise<{ planetName: string }> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Based on current astronomical data, which of the following planets is closest to Earth right now? The options are: ${PLANETS.filter(p => p !== 'Earth').join(', ')}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planetName: {
              type: Type.STRING,
              description: "The name of the planet currently closest to Earth.",
              enum: PLANETS.filter(p => p !== "Earth"),
            },
          },
          required: ["planetName"],
        },
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error("Error getting closest planet:", error);
    throw new Error("Failed to determine the closest planet.");
  }
};

export const getAstroStory = async (topic: string): Promise<{ story: string }> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a fascinating and concise story, myth, or historical account about "${topic}" in astronomy. Keep it engaging for a general audience, formatted with paragraphs.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            story: {
              type: Type.STRING,
              description: "A compelling story or myth about the astronomical topic.",
            },
          },
          required: ["story"],
        },
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error(`Error generating story for ${topic}:`, error);
    throw new Error(`Failed to generate a story for ${topic}.`);
  }
};

export const getCosmicContent = async (category: string, topic: string): Promise<{ content: string }> => {
  try {
    const prompt = `Generate a fascinating and detailed explanation about "${topic}" within the category of "${category}". The explanation should be engaging for a general audience, well-structured with paragraphs, and easy to understand.`;
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: {
              type: Type.STRING,
              description: "A detailed and engaging explanation of the cosmic topic.",
            },
          },
          required: ["content"],
        },
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error(`Error generating content for ${topic}:`, error);
    throw new Error(`Failed to generate content for ${topic}.`);
  }
};

export const generateChineseHoroscope = async (sign: ChineseZodiacSign, timeframe: HoroscopeTimeframe): Promise<Horoscope> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a ${timeframe.toLowerCase()} Chinese horoscope for the zodiac sign ${sign}. Provide insights on love, career, and health.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            love: { type: Type.STRING, description: "Horoscope for love life." },
            career: { type: Type.STRING, description: "Horoscope for career and work." },
            health: { type: Type.STRING, description: "Horoscope for health and wellness." },
          },
          required: ["love", "career", "health"],
        },
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error("Error generating Chinese horoscope:", error);
    throw new Error("Failed to generate Chinese horoscope.");
  }
};

export const getChineseZodiacInfo = async (sign: ChineseZodiacSign): Promise<ChineseZodiacInfo> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Provide detailed information about the Chinese zodiac sign ${sign}. Include key personality traits, general compatibility with other signs, its fixed element, and Yin/Yang nature.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personality_traits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of key personality traits."
            },
            compatibility: { type: Type.STRING, description: "General compatibility with other Chinese zodiac signs." },
            element: { type: Type.STRING, description: "The fixed element of the sign (e.g., Wood, Fire)." },
            yin_yang: { type: Type.STRING, description: "The Yin or Yang nature of the sign.", enum: ["Yin", "Yang"]},
          },
          required: ["personality_traits", "compatibility", "element", "yin_yang"],
        },
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error("Error getting Chinese zodiac info:", error);
    throw new Error("Failed to get Chinese zodiac information.");
  }
};

export const checkChineseCompatibility = async (sign1: ChineseZodiacSign, sign2: ChineseZodiacSign): Promise<CompatibilityInfo> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Analyze the compatibility between the Chinese zodiac signs ${sign1} and ${sign2}. Provide a compatibility percentage and a detailed explanation of their relationship dynamics, covering strengths and weaknesses.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            percentage: { type: Type.INTEGER, description: "A compatibility score from 0 to 100." },
            explanation: { type: Type.STRING, description: "A detailed explanation of the compatibility." },
          },
          required: ["percentage", "explanation"],
        },
      },
    });
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error("Error checking Chinese compatibility:", error);
    throw new Error("Failed to check Chinese compatibility.");
  }
};

export const generateImageForTopic = async (topic: string): Promise<{ imageUrl: string }> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A breathtaking, cinematic, and artistic digital painting of "${topic}". High detail, fantasy, cosmic, vibrant colors, epic composition.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
    return { imageUrl };
  } catch (error) {
    console.error(`Error generating image for ${topic}:`, error);
    throw new Error(`Failed to generate an image for ${topic}.`);
  }
};