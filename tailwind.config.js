module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
       '25': 'repeat(25, minmax(0, 1fr))',
       '40': 'repeat(40, minmax(0, 1fr))',
       '50': 'repeat(50, minmax(0, 1fr))',
       '75': 'repeat(25, minmax(0, 1fr))',
       '100': 'repeat(100, minmax(0, 1fr))',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
