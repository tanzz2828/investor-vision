/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- Custom colour palette ---
      colors: {
        primary:  '#C4570F',   // dark orange — buttons, links
        accent:   '#8A3208',   // burnt orange — current stage highlight
        warm:     '#FDF4EC',   // soft warm background
        charcoal: '#2B2019',   // main text colour
        muted:    '#8A7C70',   // secondary text, upcoming states
        success:  '#2E7D32',   // done states, green tick
        border:   '#EFE1D6',   // light borders, dividers
      },
      // --- Inter font family ---
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

