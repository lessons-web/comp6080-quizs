/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  safelist: [
    'bg-gradient-to-br',
    'from-orange-500',
    'from-sky-500',
    'from-yellow-400',
    'from-cyan-400',
    'from-emerald-500',
    'to-red-500',
    'to-blue-600',
    'to-amber-500',
    'to-sky-500',
    'to-green-600',
    'text-white',
    'shadow-sm',
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
  ],
}
