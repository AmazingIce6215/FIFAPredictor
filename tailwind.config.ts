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
        'surface-hover': 'var(--surface-hover)',
        border: 'var(--border)',
        'border-bright': 'var(--border-bright)',
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
          light: 'var(--primary-light)',
          glow: 'var(--primary-glow)',
        },
        gold: {
          DEFAULT: 'var(--gold)',
          bright: 'var(--gold-bright)',
          muted: 'var(--gold-muted)',
          glow: 'var(--gold-glow)',
        },
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        win: {
          DEFAULT: 'var(--win)',
          dark: 'var(--win-dark)',
        },
        draw: {
          DEFAULT: 'var(--draw)',
          dark: 'var(--draw-dark)',
        },
        loss: {
          DEFAULT: 'var(--loss)',
          dark: 'var(--loss-dark)',
        },
        'live-red': 'var(--live-red)',
        'form-win': 'var(--form-win)',
        'form-draw': 'var(--form-draw)',
        'form-loss': 'var(--form-loss)',
      },
      fontFamily: {
        display: ['var(--font-barlow)', 'sans-serif'],
        body: ['var(--font-barlow-body)', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(30,30,46,0.7) 0%, rgba(20,20,31,0.5) 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        breathe: 'breathe 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
