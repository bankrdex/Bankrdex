import React, { useState } from 'react'

interface SpotTradingProps {
  walletAddress: string
}

const TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟠' },
  { symbol: 'USDC', name: 'USD Coin', icon: '$' },
  { symbol: 'USDT', name: 'Tether', icon: '$' },
  { symbol: 'DAI', name: 'DAI Stablecoin', icon: '◆' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '₿' },
]

export default function SpotTrading({ walletAddress }: SpotTradingProps) {
  const [fromToken, setFromToken] = useState('USDC')
  const [toToken, setToToken] = useState('ETH')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [txStatus, setTxStatus] = useState<string | null>(null)

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setLoading(true)
    setTxStatus('Processing swap...')

    try {
      // Simulate swap process
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setTxStatus(
        `✅ Swap successful! Received ~${toAmount} ${toToken}`
      )
      setFromAmount('')
      setToAmount('')

      // Clear status after 3 seconds
      setTimeout(() => setTxStatus(null), 3000)
    } catch (error) {
      setTxStatus('❌ Swap failed')
      console.error('Swap error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value
    setFromAmount(amount)
    // Simulate price calculation (1 USDC = ~0.0005 ETH for demo)
    if (amount && !isNaN(parseFloat(amount))) {
      const estimated = (parseFloat(amount) * 0.0005).toFixed(6)
      setToAmount(estimated)
    }
  }

  const swapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Spot Trading - Uniswap V3</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From Token */}
        <div className="bg-bankrdex-purple-dark bg-opacity-50 rounded-lg p-6 border border-bankrdex-orange border-opacity-30">
          <label className="block text-sm font-bold mb-3 text-bankrdex-yellow">
            From Token
          </label>
          <select
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            className="bankrdex-input w-full mb-4"
          >
            {TOKENS.map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.icon} {token.symbol} - {token.name}
              </option>
            ))}
          </select>

          <label className="block text-sm font-bold mb-2 text-bankrdex-yellow">
            Amount
          </label>
          <input
            type="number"
            step="0.1"
            value={fromAmount}
            onChange={handleFromAmountChange}
            placeholder="Enter amount"
            className="bankrdex-input w-full"
          />
          <p className="text-xs text-gray-400 mt-2">
            Balance: 1000.00 {fromToken}
          </p>
        </div>

        {/* To Token */}
        <div className="bg-bankrdex-purple-dark bg-opacity-50 rounded-lg p-6 border border-bankrdex-orange border-opacity-30">
          <label className="block text-sm font-bold mb-3 text-bankrdex-yellow">
            To Token
          </label>
          <select
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            className="bankrdex-input w-full mb-4"
          >
            {TOKENS.map((token) => (
              <option key={token.symbol} value={token.symbol}>
                {token.icon} {token.symbol} - {token.name}
              </option>
            ))}
          </select>

          <label className="block text-sm font-bold mb-2 text-bankrdex-yellow">
            You Receive
          </label>
          <input
            type="text"
            value={toAmount}
            disabled
            className="bankrdex-input w-full opacity-70"
            placeholder="Amount to receive"
          />
          <p className="text-xs text-gray-400 mt-2">
            Balance: 0.25 {toToken}
          </p>
        </div>
      </div>

      {/* Swap Button */}
      <div className="mt-6 flex gap-4 justify-center flex-wrap">
        <button
          onClick={swapTokens}
          className="bankrdex-button-secondary px-6 py-2"
          disabled={loading}
        >
          ⇄ Swap Tokens
        </button>
        <button
          onClick={handleSwap}
          disabled={loading || !fromAmount}
          className="bankrdex-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-block">
              <span className="bankrdex-loading inline-block mr-2"></span>
              Swapping...
            </span>
          ) : (
            '🔄 Execute Swap'
          )}
        </button>
      </div>

      {/* Status Message */}
      {txStatus && (
        <div className="mt-6 p-4 bg-black bg-opacity-40 rounded-lg border border-bankrdex-orange text-center">
          <p className="text-lg font-bold text-bankrdex-yellow">{txStatus}</p>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-500 border-opacity-30">
        <p className="text-sm text-gray-300">
          💡 <strong>Tip:</strong> Spot trading provides instant swaps with minimal
          slippage. Perfect for trading spot markets.
        </p>
      </div>
    </div>
  )
}
