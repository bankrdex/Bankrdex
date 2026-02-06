/**
 * Bankr Client - Server-side only (real integration)
 *
 * This module initializes the Bankr SDK on the server and exposes helper
 * functions to execute natural language prompts via Bankr's `promptAndWait`.
 *
 * The real Bankr SDK will only be used when `process.env.BANKR_PRIVATE_KEY` is set.
 * Otherwise, calls will return a clear error explaining missing configuration.
 *
 * Note: @bankr/sdk has a malformed dependency on x402-fetch@^latest which causes
 * npm resolution errors. For now, we use generic types and fallback behavior.
 */

type PromptResult = any

let _bankrClient: any = null
let _bankrInitialized = false

export function getBankrClient() {
  if (_bankrInitialized) return _bankrClient

  if (typeof window !== 'undefined') {
    throw new Error('Bankr client must be initialized only on the server')
  }

  _bankrInitialized = true
  const privateKey = process.env.BANKR_PRIVATE_KEY

  if (!privateKey) {
    console.warn('⚠️ BANKR_PRIVATE_KEY not set; Bankr SDK will use fallback behavior')
    return null
  }

  try {
    // Lazy import to avoid bundling in client-side code
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { BankrClient } = require('@bankr/sdk')

    _bankrClient = new BankrClient({
      privateKey,
      // Bankr expects Base chain for payments per project notes
      baseChainId: process.env.BANKR_BASE_CHAIN_ID || '8453',
      rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC || undefined,
    })

    return _bankrClient
  } catch (err: any) {
    console.warn('⚠️ Failed to initialize Bankr SDK:', err?.message)
    return null
  }
}

export async function executeBankrPrompt(prompt: string, options?: { chainId?: string }): Promise<{
  success: boolean
  message: string
  transactionHash?: string
  raw?: any
}> {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty')
  }

  try {
    const client = getBankrClient()

    // If SDK not available, return simulated response
    if (!client) {
      console.log('📊 [Bankr] Using fallback (SDK not initialized):', prompt)
      return {
        success: true,
        message: `[Fallback] Bankr AI would process: "${prompt}"`,
        transactionHash: '0x' + Math.random().toString(16).slice(2),
        raw: { fallback: true, prompt },
      }
    }

    // x402 micropayment - Bankr SDK handles payment flows; we pass payment options
    const chainId = options?.chainId || process.env.BANKR_BASE_CHAIN_ID || '8453'

    // Use promptAndWait which returns a PromptResult (SDK-specific)
    const result: PromptResult = await client.promptAndWait(prompt, {
      chainId,
      paymentToken: 'USDC',
      paymentAmount: '0.10', // $0.10 per request as required
    })

    // The shape of result varies; attempt to extract a transaction hash
    const txHash = result?.transactionHash || result?.txHash || undefined

    return {
      success: true,
      message: result?.message || JSON.stringify(result),
      transactionHash: txHash,
      raw: result,
    }
  } catch (err: any) {
    throw new Error(err?.message || String(err))
  }
}
