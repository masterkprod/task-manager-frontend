# 🎨 Task Manager Frontend

Frontend moderno para la aplicación Task Manager construido con Next.js, React y TailwindCSS.

## 🛠️ Tecnologías

- **Next.js 14** - Framework React con App Router
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **TailwindCSS** - Framework de CSS
- **React Query** - Manejo de estado del servidor
- **React Hook Form** - Manejo de formularios
- **Lucide React** - Iconos modernos
- **React Hot Toast** - Notificaciones

## ✨ Características

### 🎨 Diseño y UX
- **Diseño moderno** con gradientes y sombras suaves
- **Responsive design** para todos los dispositivos
- **Animaciones fluidas** y transiciones
- **Tema atractivo** optimizado para reclutadores
- **Componentes reutilizables** y bien estructurados

### 🔧 Funcionalidades
- **Autenticación completa** con JWT
- **Dashboard interactivo** con estadísticas
- **CRUD de tareas** con filtros avanzados
- **Gestión de usuarios** (solo admin)
- **Perfil de usuario** editable
- **Notificaciones** en tiempo real

### 🚀 Performance
- **Server-side rendering** con Next.js
- **Optimización de imágenes** automática
- **Lazy loading** de componentes
- **Caching inteligente** con React Query
- **Bundle splitting** automático

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp env.example .env.local
```

Editar el archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Task Manager
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas (App Router)
│   ├── auth/              # Páginas de autenticación
│   │   ├── login/         # Página de login
│   │   └── register/      # Página de registro
│   ├── dashboard/         # Dashboard principal
│   │   ├── layout.tsx     # Layout del dashboard
│   │   └── page.tsx       # Página principal
│   ├── layout.tsx         # Layout raíz
│   └── page.tsx           # Página de inicio
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Modal.tsx
│   └── layout/           # Componentes de layout
│       ├── Sidebar.tsx
│       └── Header.tsx
├── hooks/                # Hooks personalizados
│   ├── useAuth.ts        # Hook de autenticación
│   └── useTasks.ts       # Hook de tareas
├── lib/                  # Utilidades y configuración
│   ├── api.ts           # Cliente API
│   └── utils.ts         # Funciones utilitarias
├── types/               # Tipos TypeScript
│   └── index.ts
└── styles/              # Estilos globales
    └── globals.css
```

## 🎨 Sistema de Diseño

### Paleta de Colores
```css
Primary: #3b82f6 (Azul moderno)
Secondary: #64748b (Grises neutros)
Success: #22c55e (Verde)
Warning: #f59e0b (Amarillo)
Error: #ef4444 (Rojo)
```

### Componentes UI

#### Button
```tsx
<Button variant="primary" size="md" loading={false}>
  Texto del botón
</Button>
```

Variantes: `primary`, `secondary`, `outline`, `ghost`, `destructive`
Tamaños: `sm`, `md`, `lg`

#### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="tu@ejemplo.com"
  leftIcon={<Mail />}
  error={errors.email?.message}
/>
```

#### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>
    Contenido de la tarjeta
  </CardContent>
</Card>
```

#### Badge
```tsx
<Badge variant="success" size="md">
  Completada
</Badge>
```

### Animaciones
- **Fade in**: Para elementos que aparecen
- **Slide in**: Para modales y dropdowns
- **Bounce in**: Para notificaciones
- **Hover effects**: Transiciones suaves

## 🔧 Scripts

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run start        # Servidor de producción
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de ESLint
npm run format       # Formatear código con Prettier
npm run type-check   # Verificar tipos TypeScript
```

## 🧪 Testing y Calidad

### Linting
```bash
npm run lint
```

### Formateo
```bash
npm run format
```

### Verificación de tipos
```bash
npm run type-check
```

## 🚀 Deployment

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno:
   - `NEXT_PUBLIC_API_URL`: URL de tu backend
3. Deploy automático en cada push

### Otras plataformas
- **Netlify**: Compatible con Next.js
- **Railway**: Deploy fácil con GitHub
- **AWS Amplify**: Para aplicaciones empresariales

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   # Móviles grandes
md: 768px   # Tablets
lg: 1024px  # Laptops
xl: 1280px  # Desktops
2xl: 1536px # Pantallas grandes
```

### Características responsive
- **Sidebar colapsible** en móviles
- **Grid adaptativo** para cards
- **Navegación móvil** optimizada
- **Formularios** adaptados a pantallas pequeñas

## 🎯 Optimizaciones

### Performance
- **Image optimization** automática
- **Code splitting** por rutas
- **Lazy loading** de componentes
- **Bundle analysis** disponible

### SEO
- **Meta tags** dinámicos
- **Open Graph** configurado
- **Sitemap** automático
- **Robots.txt** incluido

### Accesibilidad
- **ARIA labels** en componentes
- **Keyboard navigation** completa
- **Screen reader** compatible
- **Color contrast** optimizado

## 🔒 Seguridad

### Implementado
- ✅ Validación de formularios
- ✅ Sanitización de inputs
- ✅ Tokens JWT seguros
- ✅ HTTPS en producción
- ✅ Headers de seguridad

## 📊 Analytics y Monitoreo

### Métricas disponibles
- **Core Web Vitals** con Next.js
- **Performance monitoring**
- **Error tracking** (configurable)
- **User analytics** (opcional)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver el archivo LICENSE para más detalles.

## 🎨 Inspiración de Diseño

Este frontend está diseñado para impresionar a reclutadores con:
- **Diseño moderno** y profesional
- **UX optimizada** para productividad
- **Código limpio** y bien documentado
- **Performance** excelente
- **Responsive design** impecable
