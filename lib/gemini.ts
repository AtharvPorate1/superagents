import { GoogleGenerativeAI } from "@google/generative-ai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY is not set in the environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);


const TradingAnalysisSchema = z.object({
  marketOverview: z.object({
    trend: z.enum(["bullish", "bearish"]),
    support: z.array(z.number()).describe("List of support levels"),
    resistance: z.array(z.number()).describe("List of resistance levels"),
  }),
  patternAnalysis: z.array(z.string()).describe("Identified patterns in the image"),
  tradeSetups: z.array(z.string()).describe("Potential trade setups based on the image and please show prices at which to what"),
});


const parser = StructuredOutputParser.fromZodSchema(TradingAnalysisSchema);
const formatInstructions = parser.getFormatInstructions();


async function fetchImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
}


export async function analyzeImageWithGemini(imageUrl: string): Promise<string> {
  try {
    console.log("Analyzing image with Gemini Pro Vision. Image URL:", imageUrl);

 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

   
    const base64Image = await fetchImageAsBase64(imageUrl);
    const image = {
      inlineData: { data: base64Image, mimeType: "image/jpeg" },
    };

 
    const prompt = `
      You are a trading expert with extensive knowledge of technical analysis. 
      Analyze the given image and return the following information strictly in the specified JSON format:
      ${formatInstructions}
    `;

    console.log("Sending request to Gemini Pro Vision API");

    
    const result = await model.generateContent([prompt, image]);
    const response = await result.response;

  
    const text = response.text();
    const parsedOutput = await parser.parse(text);

    console.log("Received structured response from Gemini Pro Vision API:", parsedOutput);

    return JSON.stringify(parsedOutput, null, 2); // Pretty JSON output
  } catch (error) {
    console.error("Error analyzing image with Gemini Pro Vision:", error);
    return JSON.stringify({
      error: `An error occurred: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}
