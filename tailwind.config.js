// tailwind.config.js
// Configuración personalizada basada en Manual de Marca InstaScore

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Colores oficiales InstaScore
      colors: {
        // Marca principal
        'instascore': {
          // Azul oscuro oficial
          blue: {
            50: '#E8E6FF',
            100: '#C7C2FF',
            400: '#2916BD',
            500: '#1105AD', // Color oficial del manual
            600: '#0D049D',
          },
          // Naranja oficial
          orange: {
            50: '#FFF8E6',
            100: '#FFECB3',
            400: '#F7B422',
            500: '#F5A201', // Color oficial del manual
            600: '#E8920C',
          }
        },
        
        // Alias para facilidad de uso
        primary: {
          50: '#E8E6FF',
          100: '#C7C2FF',
          400: '#2916BD',
          500: '#1105AD',
          600: '#0D049D',
        },
        secondary: {
          50: '#FFF8E6',
          100: '#FFECB3',
          400: '#F7B422',
          500: '#F5A201',
          600: '#E8920C',
        },
        
        // Neutros mejorados
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        
        // Estados del sistema
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
        
        // Backgrounds específicos
        background: {
          primary: '#FFFFFF',
          secondary: '#FAFAFA',
          brand: '#E8E6FF',
        }
      },
      
      // Fuentes del Manual de Marca
      fontFamily: {
        // Montserrat para elementos de marca (INSTA)
        'brand': ['Montserrat', 'sans-serif'],
        // Nunito para texto general (SCORE)
        'body': ['Nunito', 'sans-serif'],
        // Sans como fallback
        'sans': ['Nunito', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      
      // Font weights específicos
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },
      
      // Espaciado personalizado
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '128': '32rem',   // 512px
      },
      
      // Border radius
      borderRadius: {
        'xl': '1rem',     // 16px
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem',  // 24px
      },
      

      
      // Breakpoints para responsive
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      
      // Animaciones smooth
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '350': '350ms',
      },
      
      // Z-index layers
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // Opacity específicas
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '65': '0.65',
        '85': '0.85',
      }
    },
  },
  
  
};