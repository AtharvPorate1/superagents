const CROSSMINT_API_KEY = process.env.CROSSMINT_API_KEY;
const CROSSMINT_API_URL = 'https://staging.crossmint.com/api/v1-alpha2';

if (!CROSSMINT_API_KEY) {
  console.error('Missing CROSSMINT_API_KEY environment variable');
  throw new Error('Missing CROSSMINT_API_KEY environment variable');
}

async function crossmintApiCall(endpoint: string, method: string, body?: any) {
  try {
    const response = await fetch(`${CROSSMINT_API_URL}${endpoint}`, {
      method,
      headers: {
        'X-API-KEY': CROSSMINT_API_KEY,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Crossmint API request failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Crossmint API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in crossmintApiCall:', error);
    throw error;
  }
}

export async function createWallet(linkedUser: string) {
  console.log('Creating wallet for user:', linkedUser);
  try {
    const result = await crossmintApiCall('/wallets', 'POST', {
      type: 'solana-mpc-wallet',
      linkedUser,
    });
    console.log('Wallet created:', result);
    return result;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
}

export async function fundWallet(walletLocator: string, amount: number, currency: string) {
  console.log(`Funding wallet ${walletLocator} with ${amount} ${currency}`);
  try {
    const result = await crossmintApiCall(`/wallets/${walletLocator}/balances`, 'POST', {
      amount,
      currency,
    });
    console.log('Wallet funded:', result);
    return result;
  } catch (error) {
    console.error('Error funding wallet:', error);
    throw error;
  }
}

export async function getWalletBalance(walletLocator: string, currency: string) {
  console.log(`Getting balance for wallet ${walletLocator} in ${currency}`);
  try {
    const result = await crossmintApiCall(`/wallets/${walletLocator}/balances?currency=${currency}`, 'GET');
    console.log('Wallet balance:', result);
    return result;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
}

export async function createTransaction(walletLocator: string, transaction: string) {
  console.log(`Creating transaction for wallet ${walletLocator}`);
  try {
    const result = await crossmintApiCall(`/wallets/${walletLocator}/transactions`, 'POST', {
      params: {
        transaction,
      },
    });
    console.log('Transaction created:', result);
    return result;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

export async function getTransaction(walletLocator: string, transactionId: string) {
  console.log(`Getting transaction ${transactionId} for wallet ${walletLocator}`);
  try {
    const result = await crossmintApiCall(`/wallets/${walletLocator}/transactions/${transactionId}`, 'GET');
    console.log('Transaction details:', result);
    return result;
  } catch (error) {
    console.error('Error getting transaction:', error);
    throw error;
  }
}

