/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#07090D',
        secondary: '#0E1117',
        card: '#121721',
        cardBorder: 'rgba(255,255,255,0.06)',
        mint: '#34D399',
        emerald: '#10B981',
        teal: '#2DD4BF',
        ink: {
          100: '#F5F7FA',
          300: '#B7C0CC',
          500: '#7C8798',
          700: '#4B5563',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-glow': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(52,211,153,0.15), transparent)',
        'mint-emerald': 'linear-gradient(135deg, #34D399 0%, #10B981 50%, #2DD4BF 100%)',
        'card-sheen': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
      },
      boxShadow: {
        glow: '0 0 60px -15px rgba(52,211,153,0.35)',
        'glow-sm': '0 0 30px -10px rgba(52,211,153,0.4)',
        card: '0 8px 30px rgba(0,0,0,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'wave': {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        wave: 'wave 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
