const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  mode: 'jit',
  purge: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'theme-main': colors.green[500],
        body: '#f7f7fa',
      },
      fontFamily: {
        Inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  variants: {},
  plugins: [],
};
