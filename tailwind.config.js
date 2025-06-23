/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // ✅ COLORES OFICIALES INSTASCORE (mantuve tu configuración)
        instascore: {
          blue: {
            50: '#E8E6FF',
            100: '#C7C2FF',
            400: '#2916BD',
            500: '#1105AD', // Color oficial principal
            600: '#0D049D',
            DEFAULT: '#1105AD', // Para usar como instascore-blue
          },
          orange: {
            50: '#FFF8E6',
            100: '#FFECB3',
            400: '#F7B422',
            500: '#F5A201', // Color oficial principal
            600: '#E8920C',
            DEFAULT: '#F5A201', // Para usar como instascore-orange
          }
        },
        
        // ✅ ALIAS PARA FACILIDAD DE USO (mantuve tu configuración)
        'instascore-blue': '#1105AD',
        'instascore-orange': '#F5A201',
        
        // ✅ COLORES ADICIONALES DEL SISTEMA (mantuve tu configuración)
        success: {
          500: '#10B981',
          100: '#D1FAE5',
        },
        warning: {
          500: '#F59E0B',
          100: '#FEF3C7',
        },
        error: {
          500: '#EF4444',
          100: '#FEE2E2',
        },
        info: {
          500: '#3B82F6',
          100: '#DBEAFE',
        },
      },
      
      // ✅ FUENTES PERSONALIZADAS (mantuve tu configuración)
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
      },
      
      // ✅ ESPACIADOS ADICIONALES (mantuve tu configuración)
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      
      // ✅ NOTA: Removí boxShadow porque no funciona en React Native
      // En su lugar usar shadowStyles.ts:
      // import { shadowStyles } from '@/design/shadowStyles';
      // style={shadowStyles.instascore.base}
    },
  },
  plugins: [],
}

// ✅ EJEMPLO DE USO EN COMPONENTES:
/*
// Colores principales
className="bg-instascore-blue text-white"
className="bg-instascore-orange text-white"

// Colores con variantes
className="bg-instascore-blue-500 border-instascore-blue-600"
className="bg-instascore-orange-400 text-instascore-orange-600"

// Fuente personalizada
className="font-nunito"

// ✅ Para sombras usar shadowStyles (NO clases CSS):
import { shadowStyles } from '@/design/shadowStyles';

<View 
  className="bg-white rounded-lg p-4"
  style={shadowStyles.instascore.base}
>
  <Text>Contenido con sombra</Text>
</View>
*/
