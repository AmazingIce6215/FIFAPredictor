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
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        border: 'var(--border)',
        'border-bright': 'var(--border-bright)',
        gold: {
          DEFAULT: 'var(--gold)',
          bright: 'var(--gold-bright)',
          muted: 'var(--gold-muted)',
        },
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'live-red': 'var(--live-red)',
        'win-green': 'var(--win-green)',
        'draw-gray': 'var(--draw-gray)',
        'loss-blue': 'var(--loss-blue)',
        'form-win': 'var(--form-win)',
        'form-draw': 'var(--form-draw)',
        'form-loss': 'var(--form-loss)',
      },
      fontFamily: {
        display: ['var(--font-barlow)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(15,30,53,0.8) 0%, rgba(10,22,40,0.6) 100%)',
      },
    },
  },
  plugins: [],
}
export default config
