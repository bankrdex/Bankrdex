import type { NextApiRequest, NextApiResponse } from 'next'
import { executeBankrPrompt } from '../../lib/bankr'

interface BankrRequest {
  prompt: string
  walletAddress: string
}

interface BankrResponse {
  success: boolean
  response: string
  transactionExecuted?: boolean
  transactionHash?: string
  newBalance?: string
  error?: string
}

// NOTE: In production you should persist user balances in a database.
// For x402 micropayment tracking, integrate with your USDC payments flow.
const userBalances: { [key: string]: number } = {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BankrResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, response: 'Method not allowed', error: 'Only POST supported' })
  }

  try {
    const { prompt, walletAddress } = req.body as BankrRequest
    if (!prompt || !walletAddress) {
      return res.status(400).json({ success: false, response: 'Invalid request', error: 'prompt and walletAddress are required' })
    }

    if (!userBalances[walletAddress]) userBalances[walletAddress] = 1000

    const BANKR_REQUEST_COST = 0.1
    if (userBalances[walletAddress] < BANKR_REQUEST_COST) {
      return res.status(402).json({ success: false, response: 'Insufficient balance', error: 'Need $0.10 USDC' })
    }

    // Deduct cost locally (for demo). In production, do an on-chain x402 payment or verify payment happened.
    userBalances[walletAddress] -= BANKR_REQUEST_COST

    // Execute Bankr prompt via real SDK (server-side only). This will throw if BANKR_PRIVATE_KEY is not set.
    const result = await executeBankrPrompt(prompt, { chainId: process.env.BANKR_BASE_CHAIN_ID || '8453' })

    return res.status(200).json({
      success: result.success,
      response: result.message,
      transactionExecuted: !!result.transactionHash,
      transactionHash: result.transactionHash,
      newBalance: userBalances[walletAddress].toFixed(2),
    })
  } catch (error: any) {
    console.error('Bankr API error:', error?.message || error)
    return res.status(500).json({ success: false, response: 'Internal server error', error: error?.message || String(error) })
  }
}
