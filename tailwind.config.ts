/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold:         '#D4A017',
        'gold-light': '#F0C842',
        teal:         '#1A6B6B',
        'teal-dark':  '#0F4444',
        cream:        '#FFF8E7',
        'cream-dark': '#F5EDD6',
        rose:         '#C84B31',
        night:        '#1C2B4A',
        success:      '#4CAF7D',
        'soft-bg':    '#F5EDD6',
      },
      fontFamily: {
        // Arabic display — Lemonada: rounded, playful, great for kids
        arabic: ['Lemonada', 'Noto Naskh Arabic', 'sans-serif'],
        // Arabic body text — Noto Naskh: clear and familiar
        'arabic-body': ['Noto Naskh Arabic', 'sans-serif'],
        // German/Latin UI — Nunito: round and friendly
        body: ['Nunito', 'sans-serif'],
      },
      fontSize: {
        // ── Kid-friendly sizes (bigger than before) ──
        'kid-xs':  ['18px', { lineHeight: '1.4' }],
        'kid-sm':  ['22px', { lineHeight: '1.4' }],
        'kid-md':  ['28px', { lineHeight: '1.3' }],
        'kid-lg':  ['36px', { lineHeight: '1.2' }],
        'kid-xl':  ['48px', { lineHeight: '1.1' }],
        'kid-2xl': ['64px', { lineHeight: '1'   }],
        // ── Big letter display sizes ──
        'letter-xl': ['200px', { lineHeight: '1' }],
        'letter-lg': ['140px', { lineHeight: '1' }],
        'letter-md': ['96px',  { lineHeight: '1' }],
        'letter-sm': ['72px',  { lineHeight: '1' }],
        // ── Game option letters ──
        'game-letter': ['108px', { lineHeight: '1' }],
      },
      animation: {
        'float':      'float 3s ease-in-out infinite',
        'star-burst': 'starBurst 0.5s ease-out forwards',
        'bounce-in':  'bounceIn 0.4s cubic-bezier(0.68,-0.55,0.27,1.55)',
        'fade-up':    'fadeUp 0.5s ease-out forwards',
        'wiggle':     'wiggle 0.4s ease-in-out',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        starBurst: {
          '0%':   { transform: 'scale(0) rotate(0deg)',   opacity: '1' },
          '100%': { transform: 'scale(1.5) rotate(20deg)', opacity: '0' },
        },
        bounceIn: {
          '0%':   { transform: 'scale(0.3)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        fadeUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(0deg)'  },
          '25%':     { transform: 'rotate(-8deg)' },
          '75%':     { transform: 'rotate(8deg)'  },
        },
      },
      backgroundImage: {
        'islamic-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A017' fill-opacity='0.08'%3E%3Cpath d='M30 0l8.66 15H21.34L30 0zm0 60l-8.66-15h17.32L30 60zM0 30l15-8.66v17.32L0 30zm60 0L45 38.66V21.34L60 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
