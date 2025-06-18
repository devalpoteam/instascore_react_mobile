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
      
      // ❌ COMENTAMOS LAS SOMBRAS PROBLEMÁTICAS PARA REACT NATIVE
      /*
      boxShadow: {
        'instascore-sm': '0 1px 2px 0 rgba(17, 5, 173, 0.05)',
        'instascore': '0 2px 4px 0 rgba(17, 5, 173, 0.1)',
        'instascore-md': '0 4px 6px 0 rgba(17, 5, 173, 0.12)',
        'instascore-lg': '0 8px 12px 0 rgba(17, 5, 173, 0.15)',
        'instascore-xl': '0 12px 16px 0 rgba(17, 5, 173, 0.18)',
        
        // Sombras con naranja para elementos especiales
        'orange': '0 2px 4px 0 rgba(245, 162, 1, 0.2)',
        'orange-lg': '0 8px 12px 0 rgba(245, 162, 1, 0.25)',
      },
      */
      
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
  
  // ❌ COMENTAMOS LOS PLUGINS PROBLEMÁTICOS PARA REACT NATIVE
  /*
  plugins: [
    // Plugin personalizado para utilidades de InstaScore
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Utilidades de texto de marca
        '.text-brand': {
          fontFamily: theme('fontFamily.brand'),
          fontWeight: theme('fontWeight.bold'),
          color: theme('colors.primary.500'),
        },
        '.text-logo-insta': {
          fontFamily: theme('fontFamily.brand'),
          color: theme('colors.primary.500'),
        },
        '.text-logo-score': {
          fontFamily: theme('fontFamily.body'),
          color: theme('colors.secondary.500'),
        },
        
        // Botones de marca
        '.btn-instascore': {
          backgroundColor: theme('colors.primary.500'),
          color: '#ffffff',
          fontFamily: theme('fontFamily.body'),
          fontWeight: theme('fontWeight.semibold'),
          borderRadius: theme('borderRadius.lg'),
          paddingTop: theme('spacing.3'),
          paddingBottom: theme('spacing.3'),
          paddingLeft: theme('spacing.6'),
          paddingRight: theme('spacing.6'),
          boxShadow: theme('boxShadow.instascore'), // ← ESTO CAUSA PROBLEMAS
          '&:hover': {
            backgroundColor: theme('colors.primary.600'),
          },
          '&:active': {
            backgroundColor: theme('colors.primary.600'),
            transform: 'translateY(1px)',
          }
        },
        
        '.btn-instascore-secondary': {
          backgroundColor: theme('colors.secondary.500'),
          color: '#ffffff',
          fontFamily: theme('fontFamily.body'),
          fontWeight: theme('fontWeight.semibold'),
          borderRadius: theme('borderRadius.lg'),
          paddingTop: theme('spacing.3'),
          paddingBottom: theme('spacing.3'),
          paddingLeft: theme('spacing.6'),
          paddingRight: theme('spacing.6'),
          boxShadow: theme('boxShadow.orange'), // ← ESTO CAUSA PROBLEMAS
          '&:hover': {
            backgroundColor: theme('colors.secondary.600'),
          }
        },
        
        // Cards de InstaScore
        '.card-instascore': {
          backgroundColor: theme('colors.background.primary'),
          borderRadius: theme('borderRadius.xl'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.instascore'), // ← ESTO CAUSA PROBLEMAS
        },
        
        // Gradientes de marca
        '.gradient-instascore': {
          background: `linear-gradient(135deg, ${theme('colors.primary.500')} 0%, ${theme('colors.secondary.500')} 100%)`,
        },
        
        '.gradient-instascore-soft': {
          background: `linear-gradient(135deg, ${theme('colors.primary.50')} 0%, ${theme('colors.secondary.50')} 100%)`,
        }
      };
      
      addUtilities(newUtilities);
    }
  ],
  */
};