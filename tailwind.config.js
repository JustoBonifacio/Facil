
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'facil-blue': '#2563eb',
        'facil-dark': '#0f172a',
        'facil-gray': '#64748b',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      animation: {
        'slow-zoom': 'slow-zoom 20s linear infinite alternate',
        'icon-pulse': 'iconPulse 0.5s ease-in-out',
        'icon-bounce': 'iconBounce 0.5s ease-in-out',
        'icon-spin': 'iconSpin 0.5s ease-in-out',
      },
      keyframes: {
        'slow-zoom': {
          'from': { transform: 'scale(1)' },
          'to': { transform: 'scale(1.1)' },
        },
        iconPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        iconBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        iconSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }
    },
  },
  plugins: [],
}
