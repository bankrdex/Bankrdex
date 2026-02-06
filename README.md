# BANKRDEX - Decentralized Trading Platform

A comprehensive Next.js 14 trading platform powered by Bankr AI, Uniswap V3, and GMX Protocol.

## 🚀 Features

### 1. **Bankr AI Trading Assistant** 🤖
- Natural language trading through `/api/bankr` (server-side only)
- Execute trades with plain English commands
- x402 micropayment integration ($0.10 per request)
- Secure server-side processing with Base chain payments

### 2. **Spot Trading (Uniswap V3)** 🔄
- Token swaps with multiple pairs (ETH, USDC, USDT, DAI, WBTC)
- Real-time price quotes using Smart Order Router
- Low slippage, instant execution
- Multi-chain support (Ethereum, Arbitrum, Base)

### 3. **Perpetual Trading (GMX)** 📈
- Long/Short positions with 1-50x leverage
- Configurable take profit and stop loss orders
- Position management dashboard
- Liquidation price calculations
- Supported on Arbitrum chain

### 4. **Web3 Integration** 💰
- MetaMask wallet connection
- Multi-chain support
- Balance tracking
- Transaction status monitoring

### 5. **BANKRDEX UI** 🎨
- Purple/Orange retro pixel art theme
- Responsive design (mobile & desktop)
- Real-time updates
- Interactive components

## 📋 Project Structure

```
/bankrdex
├── pages/
│   ├── index.tsx                  # Main trading interface
│   ├── _app.tsx                   # Next.js app wrapper
│   └── api/
│       └── bankr.ts               # Bankr AI API route (server-side)
├── components/
│   ├── Layout.tsx                 # Header/Footer with branding
│   ├── WalletConnect.tsx           # Wallet connection UI
│   ├── SpotTrading.tsx             # Uniswap spot trading
│   ├── PerpTrading.tsx             # GMX perpetuals
│   └── BankrChat.tsx               # AI trading assistant
├── lib/
│   ├── bankr.ts                   # Bankr SDK utilities (server-side)
│   ├── uniswap.ts                 # Uniswap integration
│   └── gmx.ts                     # GMX Protocol integration
├── styles/
│   └── globals.css                # BANKRDEX theme & styling
├── public/
│   └── logo.svg                   # BANKRDEX logo
├── .env.local                     # Environment variables
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- MetaMask or compatible Web3 wallet
- Ethereum/Arbitrum mainnet or testnet

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your values:
BANKR_PRIVATE_KEY=0x...           # For Bankr payments (keep secret!)
NEXT_PUBLIC_INFURA_KEY=...        # Infura API key
NEXT_PUBLIC_WALLET_CONNECT_ID=... # WalletConnect ID
NEXT_PUBLIC_ETHEREUM_RPC=...      # Ethereum RPC endpoint
NEXT_PUBLIC_ARBITRUM_RPC=...      # Arbitrum RPC endpoint
NEXT_PUBLIC_BASE_RPC=...          # Base chain RPC endpoint
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open in browser:**
```
http://localhost:3000
```

## 🔐 Security & Best Practices

### Bankr SDK
- **Server-side only**: The Bankr SDK is initialized only in `/api/bankr`, never exposed to the client
- **x402 Payments**: Uses HTTP 402 micropayments protocol
- **Base Chain**: Bankr payments are processed on Base chain ($0.10 per request)
- **Private Key Protection**: `BANKR_PRIVATE_KEY` should only be in `.env.local` (never committed)

### Web3 Security
- Never expose private keys in frontend code
- Use ethers.js v5 for safe contract interactions
- Validate all user input before sending transactions
- Implement transaction confirmation modals
- Check gas prices before execution

### Smart Contracts
- Uniswap V3 swaps are safe (well-audited protocol)
- GMX perpetuals are subject to funding rates
- Always use stop loss orders for leverage trading
- Monitor liquidation prices closely

## 📡 API Routes

### POST `/api/bankr`
Execute natural language trading prompts through Bankr AI.

**Request:**
```json
{
  "prompt": "swap 100 USDC for ETH",
  "walletAddress": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "response": "✅ Swap executed!",
  "transactionExecuted": true,
  "transactionHash": "0x...",
  "newBalance": "900.00"
}
```

**Errors:**
- 402: Insufficient balance (need $0.10 USDC)
- 400: Invalid request
- 500: Server error

## 🔗 Blockchain Networks

### Supported Chains

| Chain | Use Case | RPC |
|-------|----------|-----|
| **Ethereum** | Uniswap V3, general tokens | Mainnet |
| **Arbitrum** | GMX perpetuals | Arbitrum One |
| **Base** | Bankr x402 payments | Base mainnet |

## 💰 Pricing & Costs

- **Bankr Requests**: $0.10 per trade (x402 payment)
- **Uniswap Swaps**: Standard gas fees (varies by network)
- **GMX Perpetuals**: Entry/exit fees + funding rates
- **No platform fees**: BANKRDEX is fee-free decentralized app

## 📊 Example Trading Flows

### Spot Trading
```
1. Connect wallet (MetaMask)
2. Select from/to tokens
3. Enter amount
4. View quote via Smart Order Router
5. Execute swap via Uniswap V3
6. Transaction confirmed on chain
```

### Perpetual Trading
```
1. Connect wallet
2. Select asset & position type (long/short)
3. Set collateral & leverage (1-50x)
4. (Optional) Set take profit & stop loss
5. Open position via GMX
6. Monitor unrealized P&L
7. Close position to realize gains/losses
```

### AI Trading
```
1. Connect wallet
2. Type natural language command
3. Bankr AI parses intent
4. Route to appropriate protocol (Uniswap/GMX)
5. Execute trade server-side
6. Return transaction hash & status
7. Cost: $0.10 USDC per request
```

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize:
- `--bankrdex-purple`: #7B3FF2
- `--bankrdex-orange`: #FF6B35
- `--bankrdex-yellow`: #FFD700

### Tokens & Assets
- **Uniswap tokens**: Edit `lib/uniswap.ts` TOKENS constant
- **GMX assets**: Edit `lib/gmx.ts` GMX_ASSETS constant

### UI Components
- CTA buttons: `.bankrdex-button`
- Cards: `.bankrdex-card`
- Input fields: `.bankrdex-input`
- See `styles/globals.css` for all styles

## 📚 Documentation

- [Bankr SDK Docs](https://docs.bankr.ai)
- [Uniswap V3 Docs](https://docs.uniswap.org/contracts/v3)
- [GMX Docs](https://docs.gmx.io)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🚨 Disclaimer

**This is a demo/educational platform.** 

- Not audited for security
- Real keys should use separate environment
- Test on testnet before mainnet use
- Trading and leverage carry significant risks
- Perpetual positions can result in liquidation
- Always use stop losses for leverage trading
- BANKRDEX is not responsible for losses

## 📝 Development Roadmap

- [ ] Real Bankr SDK integration
- [ ] Actual smart contract interactions
- [ ] Order book integration
- [ ] Advanced charting
- [ ] Portfolio analytics
- [ ] Historical trade data
- [ ] Alerts & notifications
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with clear description

## 📄 License

MIT License - See LICENSE file for details

## 🎯 Feedback & Support

- Issues: GitHub Issues
- Email: support@bankrdex.dev
- Twitter: [@BANKRDEX](https://twitter.com/bankrdex)
- Discord: [BANKRDEX Community](https://discord.gg/bankrdex)

---

**Built with ❤️ by BANKRDEX Team**

*Bringing AI-powered decentralized trading to everyone.*
