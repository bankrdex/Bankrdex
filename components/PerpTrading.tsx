import React, { useState } from 'react'

interface PerpTradingProps {
  walletAddress: string
}

const ASSETS = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟠', price: 2500 },
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿', price: 42000 },
  { symbol: 'SOL', name: 'Solana', icon: '◎', price: 85 },
  { symbol: 'ARB', name: 'Arbitrum', icon: '🔷', price: 1.5 },
]

export default function PerpTrading({ walletAddress }: PerpTradingProps) {
  const [selectedAsset, setSelectedAsset] = useState('ETH')
  const [positionType, setPositionType] = useState<'long' | 'short'>('long')
  const [leverage, setLeverage] = useState(1)
  const [collateral, setCollateral] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [loading, setLoading] = useState(false)
  const [txStatus, setTxStatus] = useState<string | null>(null)
  const [openPositions, setOpenPositions] = useState<any[]>([])

  const asset = ASSETS.find((a) => a.symbol === selectedAsset)
  const positionSize = collateral ? (parseFloat(collateral) * leverage).toFixed(2) : '0'
  const liquidationPrice =
    collateral && parseFloat(collateral) > 0
      ? (asset!.price * (positionType === 'long' ? 1 - 1 / leverage : 1 + 1 / leverage)).toFixed(2)
      : '0'

  const openPosition = async () => {
    if (!collateral || parseFloat(collateral) <= 0) {
      alert('Please enter a valid collateral amount')
      return
    }

    setLoading(true)
    setTxStatus('Opening position...')

    try {
      // Simulate position opening
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newPosition = {
        id: Math.random().toString(36),
        asset: selectedAsset,
        type: positionType,
        collateral: parseFloat(collateral),
        leverage,
        entryPrice: asset!.price,
        size: parseFloat(positionSize),
        takeProfitPrice: takeProfit ? parseFloat(takeProfit) : null,
        stopLossPrice: stopLoss ? parseFloat(stopLoss) : null,
      }

      setOpenPositions([...openPositions, newPosition])
      setTxStatus(`✅ ${positionType.toUpperCase()} position opened on ${selectedAsset}!`)

      // Reset form
      setCollateral('')
      setTakeProfit('')
      setStopLoss('')

      setTimeout(() => setTxStatus(null), 3000)
    } catch (error) {
      setTxStatus('❌ Failed to open position')
      console.error('Position error:', error)
    } finally {
      setLoading(false)
    }
  }

  const closePosition = (id: string) => {
    setOpenPositions(openPositions.filter((p) => p.id !== id))
    setTxStatus('✅ Position closed successfully!')
    setTimeout(() => setTxStatus(null), 3000)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Perpetuals Trading - GMX</h2>
        <a
          href="https://app.gmx.io/#/trade/?ref=BANKRDEX"
          target="_blank"
          rel="noopener noreferrer"
          className="bankrdex-button px-6 py-2 text-sm font-bold"
        >
          🔗 Trade on GMX
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Position Details */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-bankrdex-purple-dark bg-opacity-50 rounded-lg p-4 border border-bankrdex-orange border-opacity-30">
            <label className="block text-sm font-bold mb-3 text-bankrdex-yellow">
              Asset
            </label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="bankrdex-input w-full"
            >
              {ASSETS.map((a) => (
                <option key={a.symbol} value={a.symbol}>
                  {a.icon} {a.symbol} - ${a.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-bankrdex-purple-dark bg-opacity-50 rounded-lg p-4 border border-bankrdex-orange border-opacity-30">
            <label className="block text-sm font-bold mb-3 text-bankrdex-yellow">
              Position Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setPositionType('long')}
                className={`flex-1 py-2 rounded font-bold ${
                  positionType === 'long'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-200'
                }`}
              >
                📈 LONG
              </button>
              <button
                onClick={() => setPositionType('short')}
                className={`flex-1 py-2 rounded font-bold ${
                  positionType === 'short'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-600 text-gray-200'
                }`}
              >
                📉 SHORT
              </button>
            </div>
          </div>

          <div className="bg-bankrdex-purple-dark bg-opacity-50 rounded-lg p-4 border border-bankrdex-orange border-opacity-30">
            <label className="block text-sm font-bold mb-3 text-bankrdex-yellow">
              Leverage: {leverage}x
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-2">
              Max supported: 50x
            </p>
          </div>
        </div>

        {/* Trade Input */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bankrdex-purple-dark bg-opacity-50 rounded-lg p-4 border border-bankrdex-orange border-opacity-30">
              <label className="block text-sm font-bold mb-2 text-bankrdex-yellow">
                Collateral (USDC)
              </label>
              <input
                type="number"
                step="10"
                value={collateral}
                onChange={(e) => setCollateral(e.target.value)}
                placeholder="Enter collateral amount"
                className="bankrdex-input w-full"
              />
            </div>

            <div className="bg-bankrdex-purple-dark bg-opacity-50 rounded-lg p-4 border border-bankrdex-orange border-opacity-30">
              <label className="block text-sm font-bold mb-2 text-bankrdex-yellow">
                Position Size
              </label>
              <input
                type="text"
                value={positionSize}
                disabled
                className="bankrdex-input w-full opacity-70"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bankrdex-purple-dark bg-opacity-50 rounded-lg p-4 border border-green-500 border-opacity-30">
              <label className="block text-sm font-bold mb-2 text-green-400">
                Take Profit Price
              </label>
              <input
                type="number"
                step="100"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="Optional"
                className="bankrdex-input w-full"
              />
            </div>

            <div className="bg-bankrdex-purple-dark bg-opacity-50 rounded-lg p-4 border border-red-500 border-opacity-30">
              <label className="block text-sm font-bold mb-2 text-red-400">
                Stop Loss Price
              </label>
              <input
                type="number"
                step="100"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="Optional"
                className="bankrdex-input w-full"
              />
            </div>
          </div>

          {/* Risk Info */}
          <div className="bg-yellow-900 bg-opacity-30 rounded-lg p-4 border border-yellow-600 border-opacity-30">
            <p className="text-sm text-yellow-200 mb-2">
              <strong>Liquidation Price:</strong> ${liquidationPrice}
            </p>
            <p className="text-xs text-yellow-300">
              ⚠️ Your position will be liquidated if price reaches this level
            </p>
          </div>

          {/* Open Position Button */}
          <button
            onClick={openPosition}
            disabled={loading || !collateral}
            className={`w-full py-4 rounded-lg font-bold text-lg uppercase transition-all ${
              positionType === 'long'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            } disabled:opacity-50`}
          >
            {loading ? (
              <span>
                <span className="bankrdex-loading inline-block mr-2"></span>
                Opening Position...
              </span>
            ) : (
              `🚀 Open ${positionType.toUpperCase()} Position`
            )}
          </button>
        </div>
      </div>

      {/* Status Message */}
      {txStatus && (
        <div className="mt-6 p-4 bg-black bg-opacity-40 rounded-lg border border-bankrdex-orange text-center">
          <p className="text-lg font-bold text-bankrdex-yellow">{txStatus}</p>
        </div>
      )}

      {/* Open Positions */}
      {openPositions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-bankrdex-yellow">
            Open Positions ({openPositions.length})
          </h3>
          <div className="space-y-3">
            {openPositions.map((position) => (
              <div
                key={position.id}
                className="bg-bankrdex-purple-dark bg-opacity-50 rounded-lg p-4 border border-bankrdex-orange border-opacity-30 flex justify-between items-center flex-wrap gap-4"
              >
                <div>
                  <p className="font-bold text-lg">
                    {position.type.toUpperCase()} {position.asset}
                  </p>
                  <p className="text-sm text-gray-300">
                    Size: {position.size.toFixed(2)} | Entry: ${position.entryPrice} | Leverage: {position.leverage}x
                  </p>
                </div>
                <button
                  onClick={() => closePosition(position.id)}
                  className="bankrdex-button-secondary px-6 py-2"
                >
                  Close
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
