/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        'logo-grad-start': 'var(--color-logo-grad-start)',
        'logo-grad-mid': 'var(--color-logo-grad-mid)',
        'logo-grad-end': 'var(--color-logo-grad-end)',
        'subtitle-grad-start': 'var(--color-subtitle-grad-start)',
        'subtitle-grad-mid': 'var(--color-subtitle-grad-mid)',
        'subtitle-grad-end': 'var(--color-subtitle-grad-end)',
      },
      boxShadow: {
        'logo-glow': '0 0 40px var(--color-logo-glow)',
      }
    },
  },
  plugins: [],
}