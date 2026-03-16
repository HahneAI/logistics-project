/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary':    '#0a0e1a',
        'bg-secondary':  '#0d1526',
        'bg-panel':      '#111c33',
        'accent-blue':   '#1a6aff',
        'accent-cyan':   '#00d4ff',
        'text-primary':  '#c8deff',
        'text-dim':      '#4a6a99',
        'text-muted':    '#2a3f66',
        'status-green':  '#00ff9d',
        'status-yellow': '#ffcc00',
        'status-red':    '#ff3d3d',
        'border-panel':  '#1e3a6e',
      },
      fontFamily: {
        terminal: ['"Share Tech Mono"', 'monospace'],
        display:  ['"VT323"', 'monospace'],
      },
    },
  },
  plugins: [],
}
