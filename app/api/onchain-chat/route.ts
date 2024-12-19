import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const CROSSMINT_API_KEY = process.env.CROSSMINT_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

if (!CROSSMINT_API_KEY) {
  throw new Error('Missing CROSSMINT_API_KEY environment variable');
}

// Example function to get weather data
async function getWeather(location: string): Promise<string> {
  return `The weather in ${location} is sunny with a temperature of 25°C.`;
}

// Function to create a wallet
async function createWallet(email: string) {
    const response = await fetch("https://staging.crossmint.com/api/v1-alpha2/wallets", {
        method: "POST",
        headers: {
            "X-API-KEY": CROSSMINT_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type: "solana-mpc-wallet",
            linkedUser: `email:${email}`,
        }),
    });
    const data = await response.json();
    return data;
}

const tools = [
    {
        name: 'get_weather',
        description: 'Get the weather for a given location',
        parameters: {
            type: 'object',
            properties: {
                location: {
                    type: 'string',
                    description: 'The city and state, e.g., San Francisco, CA'
                }
            },
            required: ['location']
        }
    },
    {
        name: 'create_wallet',
        description: 'Create a Solana MPC wallet for a user',
        parameters: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    description: 'The email address of the user'
                }
            },
            required: ['email']
        }
    }
];

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const message = body.messages[body.messages.length - 1].content;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }],
                temperature: 0.7,
                functions: tools,
                function_call: 'auto'
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.choices[0].finish_reason === 'function_call') {
            const functionCall = data.choices[0].message.function_call;
            
            if (functionCall.name === 'get_weather') {
                const location = functionCall.arguments ? JSON.parse(functionCall.arguments).location : null;
                if (location) {
                    const weather = await getWeather(location);
                    return NextResponse.json({ content: weather, agent: 'onchain' });
                }
            }
            
            if (functionCall.name === 'create_wallet') {
                const args = JSON.parse(functionCall.arguments);
                const email = args.email;
                if (email) {
                    const walletData = await createWallet(email);
                    const responseMessage = `Wallet created successfully!\nAddress: ${walletData.address}\nType: ${walletData.type}\nLinked to: ${walletData.linkedUser}`;
                    return NextResponse.json({ content: responseMessage, agent: 'onchain' });
                }
            }

            throw new Error('Unsupported function call or missing parameters.');
        }

        const aiResponse = data.choices[0].message.content;

        return NextResponse.json({
            content: aiResponse,
            agent: 'onchain'
        });
    } catch (error) {
        console.error('Error in onchain-chat route:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing your request.' },
            { status: 500 }
        );
    }
}