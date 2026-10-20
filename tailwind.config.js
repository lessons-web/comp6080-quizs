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
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf5f2',
          100: '#d7e8e2',
          500: '#3d7469',
          600: '#2f6258',
          700: '#244d45',
        },
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
  ],
}
