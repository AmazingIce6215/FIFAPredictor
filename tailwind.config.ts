import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        border: 'var(--border)',
        'border-hi': 'var(--border-hi)',
        chalk: 'var(--chalk)',
        ash: 'var(--ash)',
        smoke: 'var(--smoke)',
        volt: 'var(--volt)',
        gold: 'var(--gold)',
        red: 'var(--red)',
        blue: 'var(--blue)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'live-pulse': 'livePulse 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
