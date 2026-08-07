/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light theme surfaces
        canvas: '#F8FAFC',
        secondary: '#FFFFFF',
        section: '#F1F5F9',
        card: '#FFFFFF',
        cardBorder: '#E2E8F0',
        // Accents
        mint: '#22C55E',
        emerald: '#16A34A',
        teal: '#3B82F6',
        amber: '#F59E0B',
        danger: '#EF4444',
        hoverTint: '#ECFDF5',
        // Text
        ink: {
          100: '#0F172A',
          300: '#475569',
          500: '#64748B',
          700: '#CBD5E1',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-glow':
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,197,94,0.10), transparent)',
        'mint-emerald': 'linear-gradient(135deg, #22C55E 0%, #16A34A 60%, #15803D 100%)',
        'card-sheen': 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)',
      },
      boxShadow: {
        glow: '0 0 50px -12px rgba(34,197,94,0.35)',
        'glow-sm': '0 0 24px -8px rgba(34,197,94,0.35)',
        card: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)',
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 2px 8px rgba(15,23,42,0.04)',
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
