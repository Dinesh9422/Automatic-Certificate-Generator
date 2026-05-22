/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F0B90B',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        dark: {
          900: '#080808',
          800: '#0f0f0f',
          700: '#161616',
          600: '#1e1e1e',
          500: '#252525',
          400: '#2d2d2d',
          300: '#3a3a3a',
          200: '#4a4a4a',
          100: '#666666',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F0B90B 0%, #FFD700 50%, #FFA500 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
        'card-gradient': 'linear-gradient(135deg, #1e1e1e 0%, #252525 100%)',
        'mesh': "radial-gradient(at 40% 20%, hsla(42,100%,56%,0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(35,100%,50%,0.05) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(42,100%,40%,0.05) 0px, transparent 50%)",
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
      },
      keyframes: {
        glow: {
          'from': { boxShadow: '0 0 5px #F0B90B, 0 0 10px #F0B90B' },
          'to': { boxShadow: '0 0 20px #F0B90B, 0 0 40px #F0B90B' },
        },
        slideIn: {
          'from': { transform: 'translateX(-20px)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      },
      boxShadow: {
        'gold': '0 0 20px rgba(240, 185, 11, 0.3)',
        'gold-lg': '0 0 40px rgba(240, 185, 11, 0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.5)',
        'inner-gold': 'inset 0 1px 0 rgba(240,185,11,0.1)',
      }
    },
  },
  plugins: [],
}
