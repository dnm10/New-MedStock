module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Base Clinical Blue
          600: '#2563eb', // Hover Blue
          700: '#1d4ed8',
          800: '#1e40af', // Deep blue
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Base Teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        success: {
          DEFAULT: '#10b981', // Emerald 500
          hover: '#059669',   // Emerald 600
          bg: '#d1fae5',      // Emerald 100
          text: '#047857',    // Emerald 700
        },
        warning: {
          DEFAULT: '#f59e0b', // Amber 500
          hover: '#d97706',   // Amber 600
          bg: '#fef3c7',      // Amber 100
          text: '#b45309',    // Amber 700
        },
        danger: {
          DEFAULT: '#ef4444', // Red 500
          hover: '#dc2626',   // Red 600
          bg: '#fee2e2',      // Red 100
          text: '#b91c1c',    // Red 700
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};
