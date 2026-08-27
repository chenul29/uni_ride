/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#2563EB',
          'dark-blue': '#1E3A8A',
        },
        accent: {
          orange: '#F59E0B',
        },
        neutral: {
          background: '#F8FAFC',
          'main-text': '#1E293B',
          'secondary-text': '#64748B',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'subtle-float': 'subtle-float 3s ease-in-out infinite',
      },
      keyframes: {
        'subtle-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
