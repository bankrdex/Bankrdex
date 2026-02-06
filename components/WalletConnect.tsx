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
  const [showModal, setShowModal] = useState(false)
  const [walletMethod, setWalletMethod] = useState<'metamask' | 'walletconnect' | null>(null)

  const connectMetaMask = async () => {
    setConnecting(true)
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        })
        onConnect(accounts[0])
        setShowModal(false)
      } else {
        alert('MetaMask not detected. Please install it from https://metamask.io')
      }
    } catch (error) {
      console.error('Failed to connect MetaMask:', error)
      alert('Failed to connect MetaMask')
    } finally {
      setConnecting(false)
    }
  }

  const connectWalletConnect = async () => {
    setConnecting(true)
    try {
      const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
      
      if (!projectId) {
        alert('WalletConnect Project ID not configured. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in environment variables.')
        setConnecting(false)
        return
      }

      // Dynamic import to avoid SSR issues
      const { WalletConnectConnector } = await import('@web3-react/walletconnect-connector')
      const connector = new WalletConnectConnector({
        rpc: {
          1: process.env.NEXT_PUBLIC_ETHEREUM_RPC || 'https://eth-mainnet.g.alchemy.com/v2/demo',
          42161: process.env.NEXT_PUBLIC_ARBITRUM_RPC || 'https://arb-mainnet.g.alchemy.com/v2/demo',
          8453: process.env.NEXT_PUBLIC_BASE_RPC || 'https://mainnet.base.org',
        },
        qrcode: true,
      })

      const accounts = await connector.activate() as string[]
      if (accounts && accounts.length > 0) {
        onConnect(accounts[0])
        setShowModal(false)
      }
    } catch (error) {
      console.error('Failed to connect WalletConnect:', error)
      alert('Failed to connect WalletConnect. Please try again.')
    } finally {
      setConnecting(false)
    }
  }

  const handleWalletSelect = (method: 'metamask' | 'walletconnect') => {
    setWalletMethod(method)
    if (method === 'metamask') {
      connectMetaMask()
    } else if (method === 'walletconnect') {
      connectWalletConnect()
    }
  }

  const disconnectWallet = () => {
    onDisconnect()
  }

  return (
    <>
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
                Connect your wallet to start trading
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
              onClick={() => setShowModal(true)}
              disabled={connecting}
              className="bankrdex-button disabled:opacity-50"
            >
              {connecting ? (
                <span>
                  <span className="bankrdex-loading inline-block mr-2"></span>
                  Connecting...
                </span>
              ) : (
                '🔗 Connect Wallet'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Wallet Selection Modal */}
      {showModal && !connected && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-bankrdex-purple-dark rounded-lg border-2 border-bankrdex-orange p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-bankrdex-yellow mb-6 text-center">
              Connect Wallet
            </h3>
            
            <p className="text-gray-300 text-center mb-6 text-sm">
              Choose how you want to connect to BANKRDEX
            </p>

            <div className="space-y-4">
              {/* MetaMask Option */}
              <button
                onClick={() => handleWalletSelect('metamask')}
                disabled={connecting && walletMethod === 'metamask'}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-all"
              >
                <span className="text-2xl">🦊</span>
                <div className="text-left">
                  <div className="font-bold">MetaMask</div>
                  <div className="text-xs text-orange-100">Browser Extension</div>
                </div>
              </button>

              {/* WalletConnect Option */}
              <button
                onClick={() => handleWalletSelect('walletconnect')}
                disabled={connecting && walletMethod === 'walletconnect'}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-all"
              >
                <span className="text-2xl">📱</span>
                <div className="text-left">
                  <div className="font-bold">WalletConnect</div>
                  <div className="text-xs text-blue-100">Mobile & Hardware Wallets</div>
                </div>
              </button>
            </div>

            <button
              onClick={() => {
                setShowModal(false)
                setWalletMethod(null)
              }}
              className="w-full mt-6 text-gray-400 hover:text-gray-200 font-semibold py-2 transition-colors"
            >
              Cancel
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              💡 WalletConnect allows you to scan a QR code with mobile wallets
            </p>
          </div>
        </div>
      )}
    </>
  )
}
