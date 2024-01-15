/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', 'index.html'],
  important: '#root',
  theme: {
    screens: {
      sm: '600px',
      md: '900px',
      lg: '1200px',
      xl: '1536px',
    },
    extend: {
      colors: {
        primary: '#1976d2',
        secondary: '#4172B1',
        error: '#f44336',
        warning: '#ffa726',
        info: '#29b6f6',
        success: '#66bb6a',
      },
      spacing: {
        '1/31': '3%',
        '1/20': '5%'
      }
    },
  },
  corePlugins: {
    // Remove Tailwind CSS's preflight style so it can use the MUI's preflight instead (CssBaseline).
    preflight: false,
  },
  plugins: [],
}
