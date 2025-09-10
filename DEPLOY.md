# 🚀 Guía de Deploy - Task Manager

Esta guía te ayudará a desplegar la aplicación Task Manager en Render (backend) y Vercel (frontend).

## 📋 Prerrequisitos

- Cuenta en [GitHub](https://github.com)
- Cuenta en [Render](https://render.com)
- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas) (opcional, para base de datos en la nube)

## 🗄️ 1. Configurar Base de Datos

### Opción A: MongoDB Atlas (Recomendado para producción)
1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster
4. Obtén la cadena de conexión
5. Configura las reglas de acceso (0.0.0.0/0 para permitir todas las IPs)

### Opción B: Base de datos de Render
1. Render creará automáticamente una base de datos MongoDB si usas el archivo `render.yaml`

## 🔧 2. Deploy del Backend en Render

### Método 1: Usando render.yaml (Automático)
1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en "New +" → "Blueprint"
3. Conecta tu repositorio de GitHub
4. Render detectará automáticamente el archivo `render.yaml`
5. Configura las variables de entorno:
   - `FRONTEND_URL`: URL de tu frontend en Vercel (se configurará después)
6. Haz clic en "Apply" para crear los servicios

### Método 2: Deploy Manual
1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `task-manager-backend`
5. Configura:
   - **Name**: `task-manager-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

6. Configura las variables de entorno:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/task-manager
   JWT_ACCESS_SECRET=tu_secreto_super_seguro_aqui
   JWT_REFRESH_SECRET=tu_otro_secreto_super_seguro_aqui
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   FRONTEND_URL=https://tu-frontend.vercel.app
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

7. Haz clic en "Create Web Service"

### Verificar el Deploy del Backend
- El backend estará disponible en: `https://tu-servicio.onrender.com`
- Documentación Swagger: `https://tu-servicio.onrender.com/api-docs`
- Health Check: `https://tu-servicio.onrender.com/health`

## 🎨 3. Deploy del Frontend en Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en "New Project"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `task-manager-frontend`
5. Configura:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `Front` (si está en un monorepo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. Configura las variables de entorno:
   ```
   NEXT_PUBLIC_API_URL=https://tu-servicio.onrender.com
   NEXT_PUBLIC_APP_NAME=Task Manager
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

7. Haz clic en "Deploy"

### Verificar el Deploy del Frontend
- El frontend estará disponible en: `https://tu-proyecto.vercel.app`

## 🔄 4. Actualizar URLs

### Actualizar Backend
1. Ve a tu servicio en Render
2. Ve a "Environment"
3. Actualiza `FRONTEND_URL` con la URL de Vercel
4. Reinicia el servicio

### Actualizar Frontend
1. Ve a tu proyecto en Vercel
2. Ve a "Settings" → "Environment Variables"
3. Actualiza `NEXT_PUBLIC_API_URL` con la URL de Render
4. Redespliega el proyecto

## 🧪 5. Probar la Aplicación

1. Visita tu frontend en Vercel
2. Regístrate con una nueva cuenta
3. Crea algunas tareas
4. Verifica que todo funcione correctamente

## 🔧 6. Configuración Adicional

### Dominio Personalizado (Opcional)
- **Vercel**: Configura un dominio personalizado en "Settings" → "Domains"
- **Render**: Configura un dominio personalizado en "Settings" → "Custom Domains"

### Monitoreo
- **Vercel**: Analytics incluido
- **Render**: Logs disponibles en el dashboard

## 🚨 Solución de Problemas

### Error de Build en Render
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que el comando de build funcione localmente
- Revisa los logs de build en Render

### Error de Conexión a Base de Datos
- Verifica la cadena de conexión de MongoDB
- Asegúrate de que las reglas de acceso permitan conexiones desde Render
- Revisa los logs de la aplicación

### Error de CORS
- Verifica que `FRONTEND_URL` esté configurado correctamente
- Asegúrate de que la URL no tenga una barra final

### Error de Variables de Entorno
- Verifica que todas las variables estén configuradas
- Asegúrate de que los nombres coincidan exactamente
- Reinicia el servicio después de cambiar variables

## 📊 URLs Importantes

Después del deploy, tendrás:
- **Frontend**: `https://tu-proyecto.vercel.app`
- **Backend API**: `https://tu-servicio.onrender.com/api`
- **Documentación**: `https://tu-servicio.onrender.com/api-docs`
- **Health Check**: `https://tu-servicio.onrender.com/health`

## 🎉 ¡Listo!

Tu aplicación Task Manager estará completamente desplegada y funcionando en producción. Los cambios en el código se desplegarán automáticamente cuando hagas push a la rama principal.

## 📞 Soporte

Si tienes problemas con el deploy:
1. Revisa los logs en Render y Vercel
2. Verifica las variables de entorno
3. Asegúrate de que la base de datos esté accesible
4. Consulta la documentación de [Render](https://render.com/docs) y [Vercel](https://vercel.com/docs)
