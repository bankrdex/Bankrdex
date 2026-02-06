import React, { useState } from 'react'

interface WalletConnectProps {
  onConnect: (address: string) => void
  onDisconnect: () => void
  connected: boolean
  address: string
}

export default function WalletConnect({
  onConnect,
  onDisconnect,
  connected,
  address,
}: WalletConnectProps) {
  const [connecting, setConnecting] = useState(false)

  const connectWallet = async () => {
    setConnecting(true)
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        })
        onConnect(accounts[0])
      } else {
        alert('MetaMask not detected. Please install it.')
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      alert('Failed to connect wallet')
    } finally {
      setConnecting(false)
    }
  }

  const disconnectWallet = () => {
    onDisconnect()
  }

  return (
    <div className="bankrdex-card flex justify-between items-center flex-wrap gap-4">
      <div>
        {connected ? (
          <div>
            <p className="text-sm text-gray-300 mb-2">Connected Wallet:</p>
            <p className="font-mono text-lg text-bankrdex-yellow break-all">
              {address}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-300">Not connected</p>
            <p className="text-xs text-gray-400">
              Connect your MetaMask wallet to start trading
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4 flex-wrap">
        {connected ? (
          <button
            onClick={disconnectWallet}
            className="bankrdex-button-secondary px-6 py-2"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={connectWallet}
            disabled={connecting}
            className="bankrdex-button disabled:opacity-50"
          >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </div>
  )
}
