import React from 'react'

interface BankrChatProps {
  walletAddress: string
}

export default function BankrChat({ walletAddress }: BankrChatProps) {
  return (
    <div className="flex flex-col h-full items-center justify-center" style={{ height: '600px' }}>
      <div
        className="relative w-full h-full flex flex-col items-center justify-center rounded-lg border border-bankrdex-orange border-opacity-30 bg-bankrdex-purple-dark bg-opacity-30 backdrop-blur-sm"
        style={{
          backdropFilter: 'blur(10px)',
        }}
      >
        <h2 className="text-4xl font-bold mb-4 text-center" style={{ filter: 'blur(0.5px)' }}>
          Bankr AI Trading Assistant
        </h2>
        <p
          className="text-6xl mb-6"
          style={{
            filter: 'blur(1px)',
            textShadow: '0 0 30px rgba(123, 63, 242, 0.5)',
          }}
        >
          Coming Soon 👀
        </p>
        <p className="text-xl text-bankrdex-yellow text-center max-w-md" style={{ filter: 'blur(0.3px)' }}>
          AI-powered trading assistant integration
        </p>
      </div>
    </div>
  )
}
