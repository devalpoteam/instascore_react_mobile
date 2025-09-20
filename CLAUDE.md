# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Descripción del Proyecto

InstaScore es una aplicación móvil React Native para la gestión de torneos de gimnasia. Se conecta a un sistema de producción con 3 microservicios operativos y proporciona puntuación en tiempo real, seguimiento de resultados e información de torneos para competencias de gimnasia.

**Contexto Clave:**
- **Sistema en Producción**: Ya validado con Copa Gymliser (47 participantes reales)
- **3 Microservicios**: Autenticación, operaciones CRUD, y Registro/Puntuación
- **Actualizaciones en Tiempo Real**: Integración WebSocket para puntajes en vivo
- **Cliente**: Escuela de Gimnasia Artística Valparaíso (EGAV)

## Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start
# o
expo start

# Builds específicos por plataforma
npm run android
npm run ios
npm run web

# Desarrollo con plataforma específica
expo start --android
expo start --ios
expo start --clear  # Limpiar caché si es necesario
```

## Vista General de la Arquitectura

### Stack Tecnológico
- **Framework**: React Native con Expo (~53.0.11)
- **Navegación**: React Navigation 7 (Stack + Tab navigators)
- **Gestión de Estado**: Redux Toolkit con Redux Persist
- **Estilos**: NativeWind (Tailwind CSS para React Native)
- **Tiempo Real**: Cliente Socket.io para conexiones WebSocket
- **Notificaciones Push**: Integración Firebase
- **Almacenamiento**: AsyncStorage con SecureStore para datos sensibles

### Estructura del Proyecto
```
src/
├── core/
│   ├── constants/     # Endpoints API, configuración de app
│   └── types/         # Definiciones TypeScript
├── design/
│   └── colorHelper.ts # Gestión centralizada de colores
├── features/          # Módulos basados en características
│   └── auth/
│       ├── screens/   # Pantallas Login, Register
│       └── store/     # Redux slices
├── navigation/        # Configuración de navegación
├── shared/           # Utilidades compartidas y hooks
└── store/           # Configuración del store Redux
```

### Arquitectura de Integración API

**URLs de API en Producción (Ambiente UAT):**
- **API Login**: `https://api-login-uat.up.railway.app`
- **API CRUD**: `https://api-cruds-uat.up.railway.app`  
- **API Inscripción**: `https://api-inscripcion-uat.up.railway.app`
- **WebSocket**: `wss://api-inscripcion-uat.up.railway.app/ws`

La app se integra con un sistema de producción validado. Los endpoints de API están definidos en `src/core/constants/index.ts` con mapeos completos de endpoints para todos los microservicios.

### Patrón de Gestión de Estado

Usa Redux Toolkit con persistencia:
- **Estado Auth**: Autenticación de usuario, tokens, perfil de usuario
- **Persistencia**: Solo los slices `auth` y `settings` son persistidos
- **Operaciones Async**: Usar `createAsyncThunk` para llamadas API
- **Manejo de Errores**: Estados de error centralizados en slices

### Sistema de Diseño

**Colores de Marca** (del Manual de Marca):
- **Azul Primario**: `#1105AD` (Tailwind: `primary-500`)
- **Naranja Secundario**: `#F5A201` (Tailwind: `secondary-500`)
- **Gestión de Colores**: Usar helper `getColor` de `@/design/colorHelper`

**Tipografía**:
- **Fuente de Marca**: Montserrat (para "INSTA")
- **Fuente de Cuerpo**: Nunito (para "SCORE" y contenido)

**Convenciones de Estilos**:
- Usar clases NativeWind para estilos: `className="bg-primary-500 text-white"`
- Para colores dinámicos, usar helper `getColor`: `backgroundColor: getColor.primary[500]`
- Espaciado consistente con escala Tailwind

### Estructura de Navegación

Navegación de tres capas:
1. **RootNavigator**: Renderizado condicional basado en estado de auth
2. **AuthNavigator**: Flujo Login/Register (Stack)
3. **MainNavigator**: Características principales de la app (Bottom Tabs)

El estado de auth determina qué navegador se muestra. Transiciones fluidas entre estados autenticado y no autenticado.

### Características en Tiempo Real

La app soporta actualizaciones de torneos en vivo:
- **Conexión WebSocket** para actualizaciones de puntajes en tiempo real
- **Notificaciones push** vía Firebase
- **Actualizaciones optimistas** para mejor UX
- **Tipos de eventos**: Actualizaciones de puntajes, cambios de ranking, estado de competencia

### Contexto de Lógica de Negocío

**Estructura de Torneos**:
- Campeonatos → Categorías → Niveles → Grupos de Edad (Franjas)
- Puntuación específica por aparato (Salto, Viga, Suelo, etc.)
- Cálculos All-Around (suma de puntajes de aparatos)
- Competencias por equipos vs individuales

**Entidades Clave**:
- Participantes (gimnastas con afiliación a delegación/club)
- Puntajes (por aparato, participante, campeonato)
- Rankings (individuales y por equipos)
- Delegaciones (clubes/escuelas)

## Guías de Desarrollo

### Organización de Archivos
- **Estructura basada en características**: Agrupar pantallas, componentes y lógica relacionados
- **Exports tipo barrel**: Usar archivos index para imports limpios
- **Imports absolutos**: Usar alias `@/` (configurado en babel.config.js)

### Patrón de Servicios API
Al crear servicios API:
- Usar axios para requests HTTP
- Incluir headers de autenticación del estado Redux
- Manejar errores consistentemente
- Soportar actualizaciones en tiempo real con fallbacks WebSocket

### Desarrollo de Componentes
- Usar interfaces TypeScript para todas las props de componentes
- Aprovechar React Native Paper para componentes UI complejos
- Seguir patrones de diseño responsive (hook useResponsive)
- Implementar estados apropiados de carga y error

### Gestión de Estado
- Slices específicos por característica en directorios de características
- Usar createAsyncThunk para operaciones API
- Implementar estados apropiados loading/error/success
- Solo persistir datos esenciales (auth, preferencias de usuario)

### Enfoque de Estilos
- NativeWind para estilos de componentes
- Helper getColor para colores dinámicos
- Escalas consistentes de espaciado y tipografía
- Adherencia al sistema de diseño según guías de marca

## Notas Importantes de Implementación

### Flujo de Autenticación
El sistema de auth está parcialmente implementado con Redux pero necesita integración API con el microservicio de Login. El sistema soporta tanto email/password tradicional como Google OAuth.

### Flujo de Datos de Torneos
Los datos de campeonatos fluyen desde API CRUD → estado Redux → componentes UI. Las actualizaciones en tiempo real vienen vía WebSocket para puntuación en vivo durante competencias.

### Consideraciones de Performance
- Listas grandes de participantes (200+ gimnastas) requieren paginación
- Optimización de imágenes para logos y fotos
- Búsqueda y filtrado con debounce
- Actualizaciones optimistas para características en tiempo real

### Manejo de Errores
Implementar manejo completo de errores para:
- Problemas de conectividad de red
- Fallas de autenticación API
- Desconexiones de tiempo real
- Datos de torneo inválidos

## Referencia de Documentación

Contexto completo del proyecto y documentación API disponible en:
- `docs/complete_project_context.md` - Requerimientos completos de negocio y arquitectura
- `docs/API_ENDPOINTS.json` - Colección Postman con todos los endpoints