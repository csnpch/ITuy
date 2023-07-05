/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  important: true,
  theme: {
    extend: {
      fontSize: {
      //   'xs': '12px',
      //   'sm': '14px',
        'orginal': '1rem',
      //   'lg': '18px',
      //   'xl': '20px',
      //   '2xl': '24px',
      //   '3xl': '30px',
      //   '4xl': '36px',
      //   '5xl': '48px',
      //   '6xl': '64px',
      },
      colors: {
        "base": "var(--color-base)",
        "base-green": "var(--color-base-green)",
        "primary": "var(--color-primary)",
        "soft-primary": "var(--color-soft-primary)",
        "secondary-text": "var(--color-text-secondary)"
      },
      transform: {
        'rotate-90': 'rotate(90deg)',
        'rotate-180': 'rotate(180deg)',
      }
    },
  },
  plugins: [],
}
