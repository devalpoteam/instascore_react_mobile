/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales de InstaScore
        'instascore-blue': {
          DEFAULT: '#1105ad',
          light: '#2a20c9', 
          lighter: '#D7E4FF',
          dark: '#0d048a',
        },
        'instascore-orange': {
          DEFAULT: '#f5a201',
          light: '#ffb52e',
          lighter: '#fad996',
          dark: '#d48a00',
        },
        // Colores de UI
        'ui': {
          'background': '#ffffff',
          'card': '#ffffff',
          'header': '#f5a201',
          'sidebar': '#F5EED5',
          'border': '#e5e7eb',
          'hover': '#f3f4f6',
        },
        // Colores de acciones
        'action': {
          'success': '#10B981',
          'error': '#EF4444',
          'warning': '#F59E0B',
          'info': '#3B82F6',
        },
        // Colores dorados
        'golden': {
          'base': '#FFD176',
          'light': '#FFF6E0',
        },
        // Mantener compatibilidad con colores anteriores
        primary: '#1105ad', // instascore-blue
        secondary: '#f5a201', // instascore-orange
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#F5EED5', // ui-sidebar color
      },
    },
  },
  plugins: [],
}