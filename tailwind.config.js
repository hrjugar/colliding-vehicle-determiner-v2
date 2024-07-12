
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['"Asap"', 'sans-serif']
    },
    fontSize: {
      'xs': ['0.6875rem', {
        fontWeight: '500'
      }],
      'sm': '0.8125rem',
      'base': '1rem',
      'lg': ['1.1875rem', {
        fontWeight: '500',
        lineHeight: '1'
      }],
      'xl': ['1.4375rem', {
        fontWeight: '500',
        lineHeight: '1'
      }],
      '2xl': ['1.75rem', {
        fontWeight: '500',
        lineHeight: '1'
      }],
      '3xl': ['2.0625rem', {
        fontWeight: '500',
        lineHeight: '1'
      }]
    }
  },
  variants: {
    extend: {
    },
  },
  plugins: [],
};