import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import WalletConnect from '../components/WalletConnect'
import SpotTrading from '../components/SpotTrading'
import PerpTrading from '../components/PerpTrading'
import BankrChat from '../components/BankrChat'

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [activeTab, setActiveTab] = useState<'spot' | 'perp' | 'ai'>('spot')
  const [walletBalance, setWalletBalance] = useState('0')

  useEffect(() => {
    // Check if wallet is already connected
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const checkConnection = async () => {
        try {
          const accounts = await (window as any).ethereum.request({
            method: 'eth_accounts',
          })
          if (accounts.length > 0) {
            setWalletConnected(true)
            setWalletAddress(accounts[0])
          }
        } catch (error) {
          console.error('Failed to check connection:', error)
        }
      }
      checkConnection()
    }
  }, [])

  const handleWalletConnect = (address: string) => {
    setWalletConnected(true)
    setWalletAddress(address)
  }

  const handleWalletDisconnect = () => {
    setWalletConnected(false)
    setWalletAddress('')
    setWalletBalance('0')
  }

  return (
    <Layout>
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="bankrdex-title text-4xl md:text-6xl mb-4">
              BANKRDEX
            </h1>
            <p className="text-gray-200 text-lg">
              The next-generation decentralized trading platform
            </p>
          </div>

          {/* Wallet Connection */}
          <div className="mb-8">
            <WalletConnect
              onConnect={handleWalletConnect}
              onDisconnect={handleWalletDisconnect}
              connected={walletConnected}
              address={walletAddress}
            />
          </div>

          {walletConnected && (
            <>
              {/* Trading Tabs */}
              <div className="mb-8 flex gap-4 flex-wrap">
                <button
                  onClick={() => setActiveTab('spot')}
                  className={`px-6 py-3 rounded-lg font-bold uppercase transition-all ${
                    activeTab === 'spot'
                      ? 'bankrdex-button'
                      : 'bankrdex-button-secondary'
                  }`}
                >
                  🔄 Spot Trading
                </button>
                <button
                  onClick={() => setActiveTab('perp')}
                  className={`px-6 py-3 rounded-lg font-bold uppercase transition-all ${
                    activeTab === 'perp'
                      ? 'bankrdex-button'
                      : 'bankrdex-button-secondary'
                  }`}
                >
                  📈 Perpetuals
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`px-6 py-3 rounded-lg font-bold uppercase transition-all ${
                    activeTab === 'ai'
                      ? 'bankrdex-button'
                      : 'bankrdex-button-secondary'
                  }`}
                >
                  🤖 AI trading
                </button>
              </div>

              {/* Trading Content */}
              <div className="bankrdex-card">
                {activeTab === 'spot' && <SpotTrading walletAddress={walletAddress} />}
                {activeTab === 'perp' && <PerpTrading walletAddress={walletAddress} />}
                {activeTab === 'ai' && <BankrChat walletAddress={walletAddress} />}
              </div>
            </>
          )}

          {!walletConnected && (
            <div className="bankrdex-card text-center py-12">
              <p className="text-xl text-gray-200 mb-4">
                Connect your wallet to start trading
              </p>
              <p className="text-gray-300">
                Supports MetaMask, WalletConnect, and other web3 wallets
              </p>
            </div>
          )}
        </div>
      </main>
    </Layout>
  )
}
