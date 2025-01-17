
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
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
    },
    extend: {
      colors: {
        'cool-gray': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        }
      },
      minWidth: {
        'side-nav': '11.25rem',
      },
      height: {
        'top-nav': '4.5rem',
      },
      minHeight: {
        'top-nav': '4.5rem',
      },
      gridTemplateColumns: {
        'search-results': 'repeat(auto-fill, minmax(272px, 1fr))'
      }
    }
  },
  variants: {
    extend: {
    },
  },
  plugins: [],
};