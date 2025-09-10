# 🎯 Task Manager - Aplicación Fullstack CRUD

Una aplicación moderna y completa para gestión de tareas con autenticación JWT, roles de usuario y una interfaz atractiva.

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- **Autenticación JWT** con access tokens y refresh tokens seguros
- **Cookies httpOnly** para máxima seguridad
- **Roles de usuario** (usuario/admin) con permisos diferenciados
- **Validación robusta** de datos de entrada
- **Rate limiting** para prevenir abuso
- **Helmet** para headers de seguridad

### 📋 Gestión de Tareas
- **CRUD completo** de tareas con estados y prioridades
- **Filtros avanzados** por estado, prioridad, fecha y búsqueda
- **Estadísticas detalladas** de productividad
- **Fechas de vencimiento** con alertas
- **Paginación** para grandes volúmenes de datos

### 🎨 Interfaz de Usuario
- **Diseño moderno** con TailwindCSS
- **Responsive design** para todos los dispositivos
- **Animaciones suaves** y transiciones
- **Tema atractivo** con gradientes y sombras
- **Componentes reutilizables**
- **UX optimizada**

### 🛠️ Tecnologías

#### Frontend
- **Next.js 14** con App Router
- **React 18** con TypeScript
- **TailwindCSS** para estilos
- **React Query** para manejo de estado
- **React Hook Form** para formularios
- **Lucide React** para iconos

#### Backend
- **Express.js** con TypeScript
- **MongoDB** con Mongoose ODM
- **JWT** para autenticación
- **Swagger** para documentación
- **Express Validator** para validación
- **Helmet** para seguridad

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- MongoDB (local o Atlas)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <tu-repo-url>
cd task-manager
```

### 2. Configurar Backend

```bash
cd Back
npm install
```

Crear archivo `.env` basado en `env.example`:
```bash
cp env.example .env
```

Configurar variables de entorno:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_ACCESS_SECRET=access_secret
JWT_REFRESH_SECRET=refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

Iniciar el servidor:
```bash
npm run dev
```

El backend estará disponible en `http://localhost:5000`
- API: `http://localhost:5000/api`
- Documentación Swagger: `http://localhost:5000/api-docs`
- Health Check: `http://localhost:5000/health`

### 3. Configurar Frontend

```bash
cd Front
npm install
```

Crear archivo `.env.local` basado en `env.example`:
```bash
cp env.example .env.local
```

Configurar variables de entorno:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Task Manager
NEXT_PUBLIC_APP_VERSION=1.0.0
```

Iniciar el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## 📚 Documentación de la API

### Endpoints Principales

#### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh` - Refrescar token
- `GET /api/auth/profile` - Obtener perfil

#### Usuarios
- `PUT /api/users/profile` - Actualizar perfil
- `PUT /api/users/change-password` - Cambiar contraseña
- `PUT /api/users/deactivate` - Desactivar cuenta
- `GET /api/users` - Obtener usuarios (admin)
- `GET /api/users/:id` - Obtener usuario por ID (admin)
- `PUT /api/users/:id` - Actualizar usuario (admin)
- `DELETE /api/users/:id` - Eliminar usuario (admin)

#### Tareas
- `POST /api/tasks` - Crear tarea
- `GET /api/tasks` - Obtener tareas
- `GET /api/tasks/stats` - Obtener estadísticas
- `GET /api/tasks/:id` - Obtener tarea por ID
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Colección de Postman

Importa la colección `postman-collection.json` en Postman para probar todos los endpoints.

## 🎨 Características del Diseño

### Paleta de Colores
- **Primary**: Azul moderno (#3b82f6)
- **Secondary**: Grises neutros
- **Success**: Verde (#22c55e)
- **Warning**: Amarillo (#f59e0b)
- **Error**: Rojo (#ef4444)

### Componentes UI
- Botones con variantes y estados
- Inputs con validación visual
- Cards con sombras suaves
- Badges para estados y prioridades
- Modales responsivos
- Sidebar colapsible

### Animaciones
- Fade in para elementos
- Slide in para modales
- Bounce in para notificaciones
- Transiciones suaves en hover

## 🚀 Deployment

### Frontend en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno:
   - `NEXT_PUBLIC_API_URL`: URL de tu backend en Render
3. Deploy automático en cada push

### Backend en Render

1. Conecta tu repositorio a Render
2. Usa el archivo `render.yaml` para configuración automática
3. Configura las variables de entorno en el dashboard
4. Deploy automático en cada push

### Base de Datos

- **Desarrollo**: MongoDB local o Atlas
- **Producción**: MongoDB Atlas (recomendado)

## 🧪 Testing

### Backend
```bash
cd Back
npm run lint
npm run format
```

### Frontend
```bash
cd Front
npm run lint
npm run format
npm run type-check
```

## 📁 Estructura del Proyecto

```
Task Manager/
├── Back/                    # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── config/         # Configuración
│   │   ├── controllers/    # Controladores
│   │   ├── models/         # Modelos de MongoDB
│   │   ├── routes/         # Rutas de la API
│   │   ├── middlewares/    # Middlewares
│   │   ├── services/       # Servicios
│   │   └── utils/          # Utilidades
│   ├── postman-collection.json
│   └── render.yaml
├── Front/                   # Frontend (Next.js + React)
│   ├── src/
│   │   ├── app/           # Páginas (App Router)
│   │   ├── components/    # Componentes React
│   │   ├── hooks/         # Hooks personalizados
│   │   ├── lib/           # Utilidades y API client
│   │   ├── types/         # Tipos TypeScript
│   │   └── styles/        # Estilos globales
│   └── vercel.json
└── README.md
```

## 🔧 Scripts Disponibles

### Backend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linter
- `npm run format` - Formatear código

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linter
- `npm run format` - Formatear código
- `npm run type-check` - Verificar tipos

## 🎯 Características para Reclutadores

### Código de Calidad
- **TypeScript** en todo el stack
- **ESLint + Prettier** para código consistente
- **Arquitectura modular** y escalable
- **Documentación completa** con TSDoc
- **Manejo de errores** robusto

### Seguridad
- **JWT con refresh tokens** seguros
- **Validación de entrada** exhaustiva
- **Rate limiting** implementado
- **Headers de seguridad** con Helmet
- **Cookies httpOnly** para tokens

### UX/UI
- **Diseño moderno** y atractivo
- **Responsive design** completo
- **Animaciones suaves** y profesionales
- **Componentes reutilizables**
- **Accesibilidad** considerada

### DevOps
- **Docker ready** (configuración incluida)
- **CI/CD** con GitHub Actions
- **Deploy automático** en Vercel y Render
- **Monitoreo** con health checks
- **Logging** estructurado

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Master K**
- GitHub: [@masterkprod](https://github.com/masterkprod)
- LinkedIn: [Gonzalo Vega](https://www.linkedin.com/in/gonzalo-jesus-vega/)
- Email: masterkprod@gmail.com

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework React
- [TailwindCSS](https://tailwindcss.com/) por el sistema de estilos
- [Express.js](https://expressjs.com/) por el framework Node.js
- [MongoDB](https://www.mongodb.com/) por la base de datos
- [Lucide](https://lucide.dev/) por los iconos

---

⭐ **¡Si te gusta este proyecto, no olvides darle una estrella!** ⭐
