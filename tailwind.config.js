/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdfaf0',
          100: '#faf0c8',
          200: '#f5e090',
          300: '#edc84a',
          400: '#d4a017',
          500: '#b8860b',
          600: '#9a6e08',
          700: '#7a5406',
          800: '#5c3e05',
          900: '#3d2903',
        },
        brand: {
          50:  '#fdfaf0',
          100: '#f9f3dc',
          900: '#1a0a00',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Lato', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-in-out',
        'slide-up':   'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
