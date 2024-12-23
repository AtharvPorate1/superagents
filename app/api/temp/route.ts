import { openai } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { crossmint } from "@goat-sdk/crossmint";
import { Connection } from "@solana/web3.js";
import { sendSOL } from "@goat-sdk/wallet-solana";
import { jupiter } from "@goat-sdk/plugin-jupiter";
import { splToken } from "@goat-sdk/plugin-spl-token";

export const maxDuration = 300; // 5 minutes

export async function POST(req: Request) {
  const { email, messages } = await req.json();

  const apiKey = process.env.CROSSMINT_STAGING_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing Crossmint API key" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const tools = await getOnChainTools({
      wallet: await crossmint(apiKey).custodial({
        chain: "solana",
        email: email,
        connection: new Connection("https://api.devnet.solana.com", "confirmed"),
      }),
      plugins: [sendSOL(), jupiter(), splToken()],
    });

    const result = streamText({
      model: openai("gpt-4-turbo"),
      tools: tools,
      maxSteps: 5,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

