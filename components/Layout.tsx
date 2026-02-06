import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-bankrdex-gradient">
      {/* Header */}
      <header className="bg-black bg-opacity-40 backdrop-blur-sm border-b-4 border-bankrdex-orange py-4 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-4xl">😊</div>
            <h1 className="bankrdex-title text-2xl">BANKRDEX</h1>
          </div>
          <nav className="flex gap-6 text-sm md:text-base">
            <a href="#" className="hover:text-bankrdex-yellow transition-colors">
              Docs
            </a>
            <a href="#" className="hover:text-bankrdex-yellow transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-bankrdex-yellow transition-colors">
              Twitter
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="bg-black bg-opacity-40 backdrop-blur-sm border-t-4 border-bankrdex-orange mt-12 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-300">
          <p className="mb-2">
            BANKRDEX © 2026 - Decentralized Trading Platform
          </p>
          <p className="text-sm text-gray-400">
            Powered by Bankr AI, Uniswap V3, and GMX Protocol
          </p>
          <p className="text-xs text-gray-500 mt-4">
            ⚠️ This is a demo platform. Trade at your own risk.
          </p>
        </div>
      </footer>
    </div>
  )
}
