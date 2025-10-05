/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 启用 class 模式的暗色主题
  theme: {
    extend: {
      colors: {
        // 使用 CSS 变量的简化主题色
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        accent: 'var(--color-accent)',
        
        // 保留原有的品牌色配置
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#6DDD25', // 主要品牌色
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        'geist': ['Geist', 'sans-serif'],
        'geist-bold': ['Geist-Bold', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'inter-bold': ['Inter-Bold', 'sans-serif'],
        'din': ['din', 'sans-serif'],
        'darker': ['darker', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
