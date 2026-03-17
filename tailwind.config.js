/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary':    '#0000AA',
        'bg-secondary':  '#000088',
        'bg-panel':      '#000099',
        'accent-blue':   '#FFFFFF',
        'accent-cyan':   '#55FFFF',
        'text-primary':  '#FFFF55',
        'text-dim':      '#AAAAAA',
        'text-muted':    '#5555FF',
        'status-green':  '#55FF55',
        'status-yellow': '#FFFF55',
        'status-red':    '#FF5555',
        'border-panel':  '#5555FF',
      },
      fontFamily: {
        terminal: ['"Share Tech Mono"', 'monospace'],
        display:  ['"VT323"', 'monospace'],
      },
    },
  },
  plugins: [],
}
