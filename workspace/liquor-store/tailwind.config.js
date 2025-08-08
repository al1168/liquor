/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '2rem',
        '2xl': '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        ivory: '#F8F6F2',
        wood: '#2B1D13',
        woodLight: '#3B2A1E',
        gold: '#C9A227',
        goldSoft: '#E0C56E',
        slate: {
          950: '#0b0f14',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 2px 10px rgba(0,0,0,0.06)',
        card: '0 8px 24px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
}