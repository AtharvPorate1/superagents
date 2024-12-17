import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = `${process.env.NEXT_PUBLIC_GEMINI_KEY}`;

if (!apiKey) {
  throw new Error("GOOGLE_API_KEY is not set in the environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeImageWithGemini(imageUrl: string): Promise<string> {
  try {
    console.log('Analyzing image with Gemini Pro Vision. Image URL:', imageUrl);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const image = {
      inlineData: {
        data: await fetchImageAsBase64(imageUrl),
        mimeType: "image/jpeg",
      },
    };

    const prompt = `You are a trading expert with knowledge of trading. Analyze the given image and return the following information in JSON format:
    {
      "marketOverview": {
        "trend": "bullish" or "bearish",
        "support": [list of support levels],
        "resistance": [list of resistance levels]
      },
      "patternAnalysis": [list of identified patterns],
      "tradeSetups": [list of potential trade setups]
    }`;

    console.log('Sending request to Gemini Pro Vision API');
    const result = await model.generateContent([prompt, image]);
    console.log('Received response from Gemini Pro Vision API');

    const response = await result.response;
    const text = response.text();
    console.log('Gemini Pro Vision analysis result:', text);

    return text;
  } catch (error) {
    console.error("Error analyzing image with Gemini Pro Vision:", error);
    return JSON.stringify({
      error: `Sorry, I encountered an error while analyzing the image with Gemini Pro Vision. Error details: ${error instanceof Error ? error.message : String(error)}`
    });
  }
}

async function fetchImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  return base64;
}

