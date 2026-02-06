/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bankrdex-purple': '#7B3FF2',
        'bankrdex-purple-dark': '#5B2FB2',
        'bankrdex-orange': '#FF6B35',
        'bankrdex-yellow': '#FFD700',
      },
      backgroundImage: {
        'bankrdex-gradient': 'linear-gradient(135deg, #7B3FF2 0%, #5B2FB2 100%)',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
      },
    },
  },
  plugins: [],
}
