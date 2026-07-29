import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {'50':'#eef2fb','100':'#d5e0f3','200':'#adc1e7','300':'#7a9cd6','400':'#4d79c4','500':'#2a5aad','600':'#1e4690','700':'#1B3A6B','800':'#152d53','900':'#0d1f3c','950':'#070f1e'},
        forest: {'50':'#edf7ee','100':'#d0ecd1','200':'#a1d9a3','300':'#6cc16e','400':'#42a844','500':'#2E7D32','600':'#256428','700':'#1c4d1f','800':'#133616','900':'#0a1f0b'},
        gold: {'400':'#e8b824','500':'#C8960C','600':'#a87a09'},
      },
      fontFamily: { display:['var(--font-playfair)','Georgia','serif'], body:['var(--font-inter)','system-ui','sans-serif'] },
      animation: {
        'fade-up':'fadeUp 0.6s ease-out forwards',
        'fade-in':'fadeIn 0.5s ease-out forwards',
        'ticker':'ticker 40s linear infinite',
        'pulse-slow':'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:{'0%':{opacity:'0',transform:'translateY(24px)'},'100%':{opacity:'1',transform:'translateY(0)'}},
        fadeIn:{'0%':{opacity:'0'},'100%':{opacity:'1'}},
        ticker:{'0%':{transform:'translateX(0)'},'100%':{transform:'translateX(-50%)'}},
        float:{'0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-8px)'}},
      },
      boxShadow: {
        'card':'0 4px 24px rgba(27,58,107,0.08)',
        'card-hover':'0 16px 48px rgba(27,58,107,0.16)',
        'navy':'0 8px 32px rgba(27,58,107,0.25)',
        'green':'0 8px 32px rgba(46,125,50,0.25)',
      },
      backgroundImage: {
        'gradient-navy':'linear-gradient(135deg,#0d1f3c 0%,#1B3A6B 50%,#243F72 100%)',
        'gradient-hero':'linear-gradient(135deg,#0d1f3c 0%,#1B3A6B 60%,#1c4d1f 100%)',
      },
    },
  },
  plugins: [],
}
export default config
