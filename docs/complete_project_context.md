# InstaScore - Sistema Completo de Gestión de Torneos de Gimnasia

## INFORMACIÓN DEL PROYECTO

### Cliente y Stakeholders
- **Cliente**: Escuela de Gimnasia Artística Valparaíso (EGAV)
- **Dueño del producto**: Pablo Zambrioni  
- **Empresa desarrolladora**: Devalpo Soluciones Tecnológicas
- **Contacto**: copavalparaiso.egav@gmail.com

### Estado Actual del Proyecto
- **Versión Desktop**: 1.0 en fase UAT ✅
- **Versión Mobile**: Por desarrollar 🆕
- **Backend**: 3 microservicios operativos ✅
- **Caso de éxito**: Copa Gymliser validada con 47 participantes ✅

## ARQUITECTURA TÉCNICA

### Stack Tecnológico
```
Backend:
├── .NET Core 9.0
├── 3 Microservicios independientes
├── WebSockets para tiempo real
└── Base de datos SQL Server

Frontend Desktop:
├── Electron (app nativa)
├── React 18+
└── Tailwind CSS

Frontend Mobile (Por desarrollar):
├── React Native
├── Expo (recomendado)
└── Navegación stack/tab
```

### Microservicios y URLs

#### 1. API-Login (Autenticación)
**URL**: `https://api-login-uat.up.railway.app`
```
Funciones:
- Autenticación Google OAuth
- Login/Register tradicional
- Gestión de roles y permisos
- Perfil de usuario
```

#### 2. API-CRUD (Gestión de Campeonatos)  
**URL**: `https://api-cruds-uat.up.railway.app`
```
Funciones:
- CRUD campeonatos, categorías, delegaciones
- Gestión de aparatos y niveles
- Configuración de franjas etarias
- Estadísticas generales
```

#### 3. API-Inscripción (Gestión de Participantes)
**URL**: `https://api-inscripcion-uat.up.railway.app`
```
Funciones:  
- Inscripción de participantes
- Registro de puntajes por aparatos
- Cálculo de All Around automático
- Generación de premiaciones
- Exportación de resultados
```

## MODELO DE DATOS (ENTIDADES PRINCIPALES)

### Estructura de Base de Datos
```sql
-- Entidades Core
Campeonato (id, nombre, fecha, recinto, logo, estado)
├── Categorias (id, nombre, tipoDisciplina, fkCampeonato)
│   ├── Niveles (id, nombre, fkCategoria)  
│   └── Franjas (id, nombre, inicioRango, finRango, fkNivel)
├── Delegaciones (id, nombre, encargado, telefono, logo)
├── Aparatos (id, nombre, fkNivel)
└── Participantes (id, nombre, rut, edad, sexo, fkDelegacion, fkNivel)

-- Evaluación y Resultados
Puntajes (id, participante, aparato, puntaje, campeonato)
├── AllAround (id, participante, puntajeTotal, campeonato)
└── Premiaciones (id, participante, puesto, categoria, tipoPremiacion)

-- Gestión de Usuario
Users (id, email, fullName, rol)
├── Roles (admin, juez, publico)
└── UserLogins (tokens, sessions)
```

### Relaciones Clave
- **Participante** → pertenece a **Delegación** y **Nivel**
- **Puntaje** → vincula **Participante** + **Aparato** + **Campeonato**  
- **AllAround** → suma automática de puntajes por aparatos del participante
- **Premiación** → se calcula según reglas específicas por copa

## REGLAS DE NEGOCIO CRÍTICAS

### Sistema de Categorización

#### 1. Categoría Iniciación
```
Mini Kinder: 3-4 años
├── Aparatos: Salto + Banca + Suelo  
├── Premiación: Solo participación
└── Evaluación: 10 puntos máximo por aparato

Kinder: 5-12 años (3 franjas)
├── F1: 5-7 años
├── F2: 8-9 años  
├── F3: 10-12 años
├── Aparatos: Salto + Viga + Suelo
└── Evaluación: 10 puntos máximo por aparato
```

#### 2. Categoría Niveles USAG
```
Nivel 1: hasta 12 años (3 franjas)
├── F1: hasta 7 años
├── F2: 8-9 años
├── F3: 10-12 años

Nivel 2: hasta 14 años (3 franjas)  
├── F1: hasta 9 años
├── F2: 10-11 años
├── F3: 12-14 años

Nivel 3: hasta 16 años (3 franjas)
├── F1: hasta 11 años
├── F2: 12-13 años  
├── F3: 14-16 años

Nivel 4: hasta 16 años (2 franjas)
├── F1: hasta 12 años
├── F2: 13-16 años

Nivel 5: hasta 16 años (1 franja)
```

#### 3. Categoría Máster (16+ años)
```
Principiante: F1 (16-18), F2 (19+)
Intermedio: F1 (16-18), F2 (19+)  
Avanzado: F1 (16-18), F2 (19+)
```

### Aparatos por Disciplina
```
Gimnasia Femenina:
- Salto
- Viga (1.10m altura)
- Suelo (12m flexi roll / 15m airtrack)
- Banca (solo iniciación)

Gimnasia Masculina:
- Salto  
- Suelo
- Arzones
- Anillas
- Barras Paralelas
- Barra Fija
```

### Cálculo de All Around
```javascript
// Regla universal
AllAround = Suma de puntajes en todos los aparatos de la categoría

// Ejemplo Kinder:
AllAround = Salto + Viga + Suelo

// Ejemplo Nivel 2 Femenino:
AllAround = Salto + Viga + Suelo  

// Ejemplo Nivel 2 Masculino:
AllAround = Salto + Suelo + Arzones + Anillas + Paralelas + Barra
```

### Reglas de Premiación por Copa

#### Copa Gymliser (CASO DE ÉXITO VALIDADO)
```javascript
// Premiación Individual
- Medalla participación: Todas las gimnastas
- Por aparato: 1°, 2°, 3° lugar por franja
- All Around: 1° al 10° lugar por franja

// Premiación por Equipos  
- Se suman los 5 mejores puntajes All Around por equipo
- Categorías: Iniciación (Mini Kinder + Kinder) + Niveles USAG (N1-N5)
- Sin considerar franjas para equipos

// Copa General Gymliser
Copa = Suma equipos (Iniciación + Nivel1 + Nivel2 + Nivel3 + Nivel4 + Nivel5)
```

#### Copa Los Angeles
```javascript
// Equipos por categoría:
Kinder: 2 mejores AA
N1 Modificado: 2 mejores AA  
N1: 2 mejores AA
N2: 2 mejores AA
N3: 2 mejores AA
Formativo 1: 1 mejor AA
Formativo 2: 2 mejores AA

// Total: 13 puntajes AA por equipo
```

#### Copa Stadio  
```javascript
// Equipos por categoría:
Mini + Kinder: 5 mejores AA
Niveles 1-2-3: 3 mejores AA por nivel
Niveles 4-5: 2 mejores AA por nivel  
Senior Iniciación: 2 mejores AA
Senior Avanzado: 2 mejores AA
```

## ENDPOINTS CRÍTICOS DE LA API

### Autenticación
```javascript
// Login tradicional
POST /api/Auth/login
Body: { email, password }
Response: { token, user, roles }

// Login con Google
GET /api/Auth/signin  
// Callback OAuth
GET /api/Auth/callback

// Perfil del usuario
GET /api/Roles/profile
Headers: { Authorization: "Bearer {token}" }
Response: { userId, userName, email, roles }

// Registro
POST /api/Auth/register  
Body: { email, password, fullName }
```

### Gestión de Campeonatos
```javascript
// Listar campeonatos activos
GET /Campeonato/GetAll
Response: [{ id, nombre, fecha, recinto, estado, logo }]

// Detalle de campeonato
GET /Campeonato/GetById?id={campeonatoId}

// Logo del campeonato  
GET /Campeonato/GetLogoById?id={campeonatoId}

// Categorías del campeonato
GET /Categoria/GetByCampeonato?campeonatoId={id}
Response: [{ id, nombre, tipoDisciplina, fkCampeonato }]

// Delegaciones
GET /Delegacion/GetAll
Response: [{ id, nombre, encargado, telefono, correo }]
```

### Participantes y Resultados
```javascript
// Lista de participantes del campeonato
GET /api/Inscripciones/ListaParticipantesCampeonato?id={campeonatoId}
Response: [{ 
  id, nombre, rut, edad, sexo, 
  delegacion, nivel, categoria, franja,
  estado // "Pendiente" | "Aprobado" | "Cancelado"
}]

// Puntajes de un campeonato (CON FILTROS)
GET /api/PuntajesAparato/PuntajesCampeonato?campeonatoId={id}&categoriaId={id}&nivelId={id}&aparatoId={id}&disciplina={tipo}&delegacionId={id}&franjaId={id}
Response: [{
  participante: { nombre, delegacion },
  aparato: { nombre },
  puntaje: number,
  allAround: number,
  puesto: number
}]

// Puntajes de un participante específico  
GET /api/PuntajesAparato/participantePuntaje?idParticipante={id}
Response: {
  participante: { nombre, delegacion, categoria },
  puntajes: [{ aparato, puntaje }],
  allAround: number,
  puesto: number
}
```

### Premiaciones y Rankings
```javascript
// Premiaciones individuales (CON FILTROS)
GET /api/PremiacionesResultados/individuales?campeonatoId={id}&categoriaId={id}&nivelId={id}&aparatoId={id}&disciplina={tipo}&delegacionId={id}&franjaId={id}
Response: [{
  puesto: number,
  participante: { nombre, delegacion },
  puntaje: number,
  categoria: string,
  aparato: string
}]

// Premiaciones por equipos
GET /api/PremiacionesResultados/equipos?campeonatoId={id}&delegacionId={id}&categoriaId={id}&nivelId={id}  
Response: [{
  puesto: number,
  delegacion: { nombre, logo },
  puntajeTotal: number,
  participantes: [{ nombre, allAround }]
}]

// Todos los resultados del campeonato
GET /api/PremiacionesResultados/ResultadosGetByIdCampeonato?campeonatoId={id}
Response: {
  individuales: [...],
  equipos: [...]
}
```

### Estadísticas
```javascript
// Contadores por campeonato
GET /Home/countCategorias?campeonatoId={id}
GET /Home/countDelegaciones?campeonatoId={id}  
GET /Home/countParticipantes?campeonatoId={id}
GET /Home/countDiasCampeonatos?campeonatoId={id}

// Contadores generales
GET /HomeControllerGeneral/countCategorias
GET /HomeControllerGeneral/countDelegaciones
GET /HomeControllerGeneral/countParticipantes
```

## DATOS DE EJEMPLO (COPA GYMLISER VALIDADA)

### Estructura de Participante
```javascript
{
  "id": 1,
  "nombre": "Valentina Sanches", 
  "rut": "12345678-9",
  "edad": 8,
  "añoNacimiento": 2016,
  "delegacion": {
    "id": 1,
    "nombre": "Escuela de Gimnasia Artística", 
    "logo": "egav_logo.png"
  },
  "categoria": "MINI KINDER",
  "nivel": "Kinder",
  "franja": "F1",
  "estado": "Aprobado"
}
```

### Estructura de Puntajes
```javascript
{
  "participanteId": 1,
  "campeonatoId": 1,
  "puntajes": [
    { "aparato": "Salto", "puntaje": 9.2 },
    { "aparato": "Viga", "puntaje": 8.8 }, 
    { "aparato": "Suelo", "puntaje": 9.5 }
  ],
  "allAround": 27.5,
  "puesto": 1,
  "fechaRegistro": "2024-10-17T14:30:00Z"
}
```

### Ranking Ejemplo (Copa Gymliser)
```javascript
{
  "categoria": "MINI KINDER",
  "ranking": [
    {
      "puesto": 1,
      "nombre": "Valentina Sanches",
      "delegacion": "Escuela de Gimnasia Artística", 
      "allAround": 27.5,
      "puntajes": { "salto": 9.2, "viga": 8.8, "suelo": 9.5 }
    },
    {
      "puesto": 2, 
      "nombre": "Matías Urquieta",
      "delegacion": "EGAV",
      "allAround": 24.6,
      "puntajes": { "salto": 8.1, "viga": 8.0, "suelo": 8.5 }
    }
  ]
}
```

### Premiación por Equipos
```javascript
{
  "copa": "Copa Gymliser",
  "equipos": [
    {
      "puesto": 1,
      "delegacion": {
        "nombre": "Escuela de Gimnasia Artística",
        "logo": "egav_logo.png"
      },
      "puntajeTotal": 127.8,
      "mejoresParticipantes": [
        { "nombre": "Valentina Sanches", "allAround": 27.5 },
        { "nombre": "Mariela Cisternas", "allAround": 23.3 },
        { "nombre": "Florencia Jara", "allAround": 18.8 },
        { "nombre": "Maite Rojas", "allAround": 9.55 },
        { "nombre": "Martín Esquivel", "allAround": 24.2 }
      ]
    }
  ]
}
```

## FUNCIONALIDADES REQUERIDAS PARA APP MOBILE

### Pantallas Principales
```
1. LoginScreen 
   - Login con email/password
   - Login con redes sociales
   - Registro de usuario
   - Recuperar contraseña

2. HomeScreen (Dashboard)
   - Lista de campeonatos activos
   - Campeonatos próximos  
   - Búsqueda de campeonatos
   - Notificaciones recientes

3. CampeonatoDetailScreen
   - Información del campeonato
   - Categorías disponibles
   - Delegaciones participantes
   - Horarios de competencia

4. ResultsScreen (TIEMPO REAL)
   - Rankings por categoría/nivel/franja
   - Filtros: categoría, delegación, aparato
   - Búsqueda de participantes
   - Indicador "EN VIVO" cuando hay updates

5. GymnastProfileScreen  
   - Información del participante
   - Puntajes por aparato
   - Historial de competencias
   - Botón "Seguir" para notificaciones

6. RankingScreen
   - Rankings individuales
   - Rankings por equipos  
   - Filtros avanzados
   - Exportar/Compartir resultados

7. SettingsScreen
   - Perfil de usuario
   - Configuración de notificaciones
   - Modo gratuito vs premium
   - Cerrar sesión
```

### Funcionalidades Tiempo Real
```javascript
// WebSocket para updates en vivo
const wsUrl = 'wss://api-inscripcion-uat.up.railway.app/ws';

// Eventos que debe escuchar la app:
- 'puntaje_actualizado': Nuevo puntaje registrado
- 'ranking_actualizado': Cambio en posiciones  
- 'competencia_iniciada': Inicio de nueva ronda
- 'competencia_finalizada': Fin de categoría
- 'premiacion_generada': Resultados finales listos
```

### Sistema de Notificaciones
```javascript
// Tipos de notificaciones push:
1. "Nuevo puntaje registrado para [Gimnasta]"
2. "[Gimnasta] subió al puesto #[N] en [Categoría]"  
3. "Iniciando competencia de [Categoría] - [Aparato]"
4. "Resultados finales disponibles para [Categoría]"
5. "¡[Delegación] ganó la [Copa]!"

// Configuración de notificaciones:
- Por gimnasta específico (seguidos)
- Por delegación  
- Por categoría
- Solo eventos importantes
```

### Modo Gratuito vs Premium
```javascript
// Gratuito:
- Ver resultados básicos
- Rankings generales
- Información de campeonatos
- Notificaciones limitadas

// Premium: 
- Estadísticas detalladas por participante
- Comparativas históricas
- Análisis de rendimiento
- Notificaciones ilimitadas
- Exportar resultados personalizados
- Sin publicidad
```

## CONSIDERACIONES TÉCNICAS CRÍTICAS

### Performance
```javascript
// Optimizaciones requeridas:
- Paginación en listas largas (200+ participantes)
- Cache local para resultados frecuentes  
- Lazy loading de imágenes (logos, fotos)
- Debounce en búsquedas y filtros
- Optimistic updates en tiempo real
```

### Manejo de Estados
```javascript
// Estados críticos a manejar:
const AppState = {
  auth: { user, token, isAuthenticated },
  campeonatos: { activos, seleccionado, loading },
  resultados: { 
    participantes, 
    rankings, 
    filters: { categoria, delegacion, aparato },
    isLive: boolean 
  },
  notifications: { pending, settings },
  offline: { isConnected, pendingSync }
};
```

### Offline Mode
```javascript
// Funcionalidades offline:
- Cache de últimos resultados vistos
- Lista de campeonatos descargados
- Perfil de usuario  
- Configuración de notificaciones
- Sincronización automática al reconectar
```

### Validaciones de Datos
```javascript
// Validaciones importantes:
- Verificar estructura de API responses
- Manejar errores de conectividad
- Validar tokens de autenticación
- Verificar integridad de puntajes
- Detectar datos inconsistentes
```

## CASOS DE USO PRIORITARIOS

### 1. Ver Resultados en Tiempo Real
```
Flujo:
1. Usuario abre app → ve campeonatos activos
2. Selecciona "Copa Valparaíso 2024" 
3. Ve categorías disponibles
4. Toca "MINI KINDER" → ve ranking actual
5. Recibe notificación: "Nuevo puntaje para Valentina"
6. Ve actualización automática en ranking
7. Toca en Valentina → ve detalles de puntajes
```

### 2. Seguir a un Gimnasta
```
Flujo:
1. Usuario busca "Valentina Sanches"
2. Ve perfil con puntajes actuales  
3. Toca "Seguir" → se activan notificaciones
4. Recibe push: "Valentina compite en Viga en 5 min"
5. Recibe push: "Valentina obtuvo 9.2 en Viga!"
6. Ve actualización de puesto en ranking
```

### 3. Comparar Equipos
```
Flujo:
1. Usuario va a "Rankings por Equipos"
2. Aplica filtro "Copa Gymliser"
3. Ve tabla con delegaciones y puntajes
4. Toca "EGAV" → ve detalles de mejores 5 AA
5. Compara con otros equipos
6. Comparte resultado en redes sociales
```

## ARCHIVOS Y RECURSOS DISPONIBLES

### Assets del Proyecto
```
- Logo EGAV (egav_logo.png)
- Logos de delegaciones participantes  
- Iconos de aparatos (salto, viga, suelo, etc.)
- Paleta de colores corporativa (morado/naranja)
- Tipografía corporativa
```

### Datos de Prueba
```
- 47 participantes reales de Copa Gymliser
- Puntajes validados y verificados
- Estructura de premiación comprobada
- APIs funcionando en ambiente UAT
- WebSockets operativos
```

### Documentación Técnica  
```
- Colección Postman completa
- Modelo de datos actualizado
- Diagramas de arquitectura
- Especificaciones de APIs
- Casos de uso documentados
```

## PRÓXIMOS PASOS PARA DESARROLLO

### Fase 1: Setup y Estructura (Semana 1)
```
1. Configurar proyecto React Native
2. Setup navegación (Stack + Tab)
3. Configurar servicios de API
4. Implementar autenticación básica
5. Crear componentes base
```

### Fase 2: Funcionalidad Core (Semana 2-3)
```
1. Pantallas de campeonatos y categorías
2. Sistema de resultados en tiempo real
3. Perfiles de gimnastas
4. Sistema de búsqueda y filtros
5. Integración con WebSockets
```

### Fase 3: Features Avanzadas (Semana 4)
```
1. Sistema de notificaciones push
2. Modo offline con sincronización  
3. Funcionalidades premium
4. Optimizaciones de performance
5. Testing y debugging
```

### Fase 4: Deployment (Semana 5)
```
1. Build para App Store / Play Store
2. Configuración de entornos
3. Testing en dispositivos reales
4. Documentación de usuario
5. Lanzamiento beta
```

---

**IMPORTANTE**: Este contexto representa un proyecto real en producción. La Copa Gymliser ya fue validada exitosamente con 47 participantes reales, y las APIs están funcionando en ambiente UAT. El desarrollo de la app mobile debe integrarse con esta infraestructura existente.