/**
 * GMX Protocol Integration
 * 
 * Provides utilities for perpetual trading on Arbitrum
 * Supports long/short positions with leverage
 */

export interface GMXPosition {
  id: string
  asset: string
  type: 'LONG' | 'SHORT'
  collateral: number
  leverage: number
  entryPrice: number
  size: number
  unrealizedPnL: number
  takeProfitPrice?: number
  stopLossPrice?: number
  createdAt: Date
}

export interface GMXAsset {
  symbol: string
  name: string
  price: number
  maxLeverage: number
  minCollateral: number
}

// Supported assets on GMX
export const GMX_ASSETS: { [key: string]: GMXAsset } = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2500,
    maxLeverage: 50,
    minCollateral: 10,
  },
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 42000,
    maxLeverage: 50,
    minCollateral: 10,
  },
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    price: 85,
    maxLeverage: 20,
    minCollateral: 10,
  },
  ARB: {
    symbol: 'ARB',
    name: 'Arbitrum',
    price: 1.5,
    maxLeverage: 10,
    minCollateral: 10,
  },
}

/**
 * Get GMX asset by symbol
 */
export function getGMXAsset(symbol: string): GMXAsset | undefined {
  return GMX_ASSETS[symbol]
}

/**
 * Calculate liquidation price
 * 
 * @param entryPrice - Position entry price
 * @param leverage - Position leverage
 * @param isLong - Whether position is long or short
 */
export function calculateLiquidationPrice(
  entryPrice: number,
  leverage: number,
  isLong: boolean
): number {
  if (isLong) {
    // Long positions liquidate below entry price
    return entryPrice * (1 - 1 / leverage)
  } else {
    // Short positions liquidate above entry price
    return entryPrice * (1 + 1 / leverage)
  }
}

/**
 * Calculate position PnL
 */
export function calculatePnL(
  entryPrice: number,
  currentPrice: number,
  size: number,
  isLong: boolean
): number {
  const priceDifference = currentPrice - entryPrice
  const pnlPercentage = isLong
    ? priceDifference / entryPrice
    : -priceDifference / entryPrice

  return size * pnlPercentage
}

/**
 * Open a perpetual position on GMX
 * 
 * @param asset - Asset symbol (ETH, BTC, etc.)
 * @param type - Position type (LONG or SHORT)
 * @param collateral - Collateral amount in USDC
 * @param leverage - Leverage multiplier (1-50x)
 * @param walletAddress - User's wallet address
 * @param takeProfitPrice - Optional take profit price
 * @param stopLossPrice - Optional stop loss price
 */
export async function openGMXPosition(
  asset: string,
  type: 'LONG' | 'SHORT',
  collateral: number,
  leverage: number,
  walletAddress: string,
  takeProfitPrice?: number,
  stopLossPrice?: number
): Promise<GMXPosition> {
  try {
    // Validate asset
    const gmxAsset = getGMXAsset(asset)
    if (!gmxAsset) {
      throw new Error(`Asset ${asset} not supported on GMX`)
    }

    // Validate collateral
    if (collateral < gmxAsset.minCollateral) {
      throw new Error(
        `Minimum collateral for ${asset} is ${gmxAsset.minCollateral} USDC`
      )
    }

    // Validate leverage
    if (leverage < 1 || leverage > gmxAsset.maxLeverage) {
      throw new Error(
        `Leverage must be between 1x and ${gmxAsset.maxLeverage}x for ${asset}`
      )
    }

    // Try to integrate with @gmx-io/sdk if available
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { ethers } = require('ethers')
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { GMX } = require('@gmx-io/sdk')

      const rpc = process.env.NEXT_PUBLIC_ARBITRUM_RPC || ''
      const provider = new ethers.providers.JsonRpcProvider(rpc)

      // NOTE: GMX SDK usage varies; this is a generic pattern demonstrating intent.
      const gmxClient = new GMX({ provider })

      // Build position params according to SDK
      const params = {
        account: walletAddress,
        market: asset,
        size: collateral * leverage,
        collateral,
        isLong: type === 'LONG',
        takeProfitPrice,
        stopLossPrice,
      }

      // In many setups the user must sign from their wallet; here we attempt to call an SDK method
      // that may return a transaction payload for client-side signing.
      const openResult = await gmxClient.openPosition(params)

      const position: GMXPosition = {
        id: openResult?.positionId || '0x' + Math.random().toString(16).slice(2, 20),
        asset,
        type,
        collateral,
        leverage,
        entryPrice: openResult?.entryPrice || gmxAsset.price,
        size: openResult?.size || collateral * leverage,
        unrealizedPnL: openResult?.unrealizedPnL || 0,
        takeProfitPrice,
        stopLossPrice,
        createdAt: new Date(),
      }

      return position
    } catch (sdkErr) {
      // Fallback to simulated position when SDK not installed or error occurs
      const position: GMXPosition = {
        id: '0x' + Math.random().toString(16).slice(2, 20),
        asset,
        type,
        collateral,
        leverage,
        entryPrice: gmxAsset.price,
        size: collateral * leverage,
        unrealizedPnL: 0,
        takeProfitPrice,
        stopLossPrice,
        createdAt: new Date(),
      }

      return position
    }
  } catch (error) {
    throw new Error(
      `Failed to open GMX position: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

/**
 * Close a perpetual position
 */
export async function closeGMXPosition(
  positionId: string,
  walletAddress: string
): Promise<{ transactionHash: string; pnlUSDC: number }> {
  try {
    // TODO: Send actual GMX close transaction
    // const result = await gmxClient.closePosition(positionId)

    return {
      transactionHash: '0x' + Math.random().toString(16).slice(2, 66),
      pnlUSDC: Math.random() * 100 - 50, // Random P&L for demo
    }
  } catch (error) {
    throw new Error(
      `Failed to close GMX position: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

/**
 * Update position take profit and stop loss
 */
export async function updateGMXPositionOrders(
  positionId: string,
  takeProfitPrice?: number,
  stopLossPrice?: number
): Promise<{ transactionHash: string }> {
  try {
    // TODO: Send actual transaction
    // const result = await gmxClient.updatePosition(...)

    return {
      transactionHash: '0x' + Math.random().toString(16).slice(2, 66),
    }
  } catch (error) {
    throw new Error(
      `Failed to update GMX position orders: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

/**
 * Get user's open positions
 */
export async function getGMXPositions(
  walletAddress: string
): Promise<GMXPosition[]> {
  try {
    // TODO: Fetch actual positions from GMX
    // const positions = await gmxClient.getUserPositions(walletAddress)

    return []
  } catch (error) {
    throw new Error(
      `Failed to fetch GMX positions: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

/**
 * Get GMX asset funding rate (cost to hold position)
 */
export function getGMXFundingRate(asset: string): number {
  // Simulated funding rates
  const fundingRates: { [key: string]: number } = {
    ETH: 0.0001,
    BTC: 0.00008,
    SOL: 0.00012,
    ARB: 0.0005,
  }

  return fundingRates[asset] || 0.0001
}

/**
 * Validate position parameters
 */
export function validateGMXPosition(
  asset: string,
  collateral: number,
  leverage: number
): { valid: boolean; error?: string } {
  const gmxAsset = getGMXAsset(asset)

  if (!gmxAsset) {
    return { valid: false, error: `Asset ${asset} not supported` }
  }

  if (collateral < gmxAsset.minCollateral) {
    return {
      valid: false,
      error: `Minimum collateral is ${gmxAsset.minCollateral} USDC`,
    }
  }

  if (leverage < 1 || leverage > gmxAsset.maxLeverage) {
    return {
      valid: false,
      error: `Invalid leverage. Max for ${asset} is ${gmxAsset.maxLeverage}x`,
    }
  }

  return { valid: true }
}
