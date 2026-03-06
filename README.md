# Backend Multiusuario con JWT

Backend multiusuario con autenticación JWT y autorización por recurso. Implementa registro, login, CRUD protegido de tareas y aislamiento de datos por usuario.

## 🚀 Stack Tecnológico

- **Node.js** + **Express** - Framework web
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **bcrypt** - Hash de contraseñas
- **dotenv** - Variables de entorno

## 📋 Características

- ✅ Sistema de autenticación con JWT
- ✅ Registro y login de usuarios
- ✅ Endpoint /auth/me para obtener información del usuario autenticado
- ✅ CRUD completo de tareas con aislamiento por usuario
- ✅ Filtrado de tareas por estado (completadas/pendientes)
- ✅ Paginación en tareas y usuarios
- ✅ Protección de rutas con middleware de autenticación
- ✅ Gestión de usuarios con paginación
- ✅ Manejo centralizado de errores
- ✅ Validaciones de entrada (email formato, contraseña mínimo 6 caracteres)
- ✅ Queries parametrizadas (prevención de SQL injection)

## 🛠️ Instalación

### Prerrequisitos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)

### Pasos

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/DanyelHdz1231/backend-nodejs
   cd backend-nodejs
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Copia el archivo `.env.example` a `.env` y ajusta los valores:

   ```bash
   cp .env.example .env
   ```

   Edita `.env` con tus credenciales:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=backend_training
   JWT_SECRET=tu_clave_secreta_aqui
   PORT=3000
   ```

4. **Crear la base de datos**

   Ejecuta el siguiente script SQL en MySQL:

   ```sql
   CREATE DATABASE backend_training;
   USE backend_training;

   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE tasks (
     id INT AUTO_INCREMENT PRIMARY KEY,
     text VARCHAR(500) NOT NULL,
     completed BOOLEAN DEFAULT FALSE,
     user_id INT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   );
   ```

5. **Iniciar el servidor**

   ```bash
   npm start
   ```

   El servidor estará corriendo en `http://localhost:3000`

## 📡 Endpoints

### Autenticación

#### Registro

```http
POST /auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (201):**

```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Obtener información del usuario autenticado

```http
GET /auth/me
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**

```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "created_at": "2026-03-02T10:00:00.000Z"
}
```

### Tareas (requieren autenticación)

Todas las rutas de tareas requieren el header de autorización:

```
Authorization: Bearer <tu_token_jwt>
```

#### Obtener todas las tareas del usuario

```http
GET /tasks?page=1&limit=10&completed=true
Authorization: Bearer <token>
```

**Parámetros de query (opcionales):**

- `page` - Número de página (default: 1)
- `limit` - Elementos por página (default: 10, max: 100)
- `completed` - Filtrar por estado: `true` o `false`

**Respuesta (200):**

```json
{
  "data": [
    {
      "id": 1,
      "text": "Aprender Node.js",
      "completed": false,
      "created_at": "2026-03-02T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

#### Crear una tarea

```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Nueva tarea"
}
```

**Respuesta (201):**

```json
{
  "id": 2,
  "text": "Nueva tarea",
  "completed": false,
  "userId": 1
}
```

#### Eliminar una tarea

```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

**Respuesta (204):** Sin contenido

#### Alternar estado de completado

```http
PATCH /tasks/:id/toggle
Authorization: Bearer <token>
```

**Respuesta (200):**

```json
{
  "id": 1,
  "text": "Aprender Node.js",
  "completed": true,
  "created_at": "2026-03-02T10:00:00.000Z"
}
```

#### Actualizar texto de una tarea

```http
PATCH /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Aprender Node.js y Express"
}
```

**Respuesta (200):**

```json
{
  "id": 1,
  "text": "Aprender Node.js y Express",
  "completed": false,
  "created_at": "2026-03-02T10:00:00.000Z"
}
```

### Usuarios

#### Obtener todos los usuarios (con paginación)

```http
GET /users?page=1&limit=10
```

**Respuesta (200):**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "created_at": "2026-03-02T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

## 🔐 Autenticación

### Flujo de autenticación

1. **Registro/Login**: El usuario se registra o inicia sesión
2. **Recepción del token**: El servidor responde con un JWT válido por 1 hora
3. **Uso del token**: El cliente incluye el token en el header `Authorization` de cada petición:
   ```
   Authorization: Bearer <token>
   ```
4. **Verificación**: El middleware `authenticate` valida el token antes de procesar la petición

### Middleware de autenticación

El middleware `authenticate` se encarga de:

- Verificar la presencia del token en el header `Authorization`
- Validar la firma y expiración del JWT
- Extraer el `userId` del token y agregarlo a `req.user`
- Rechazar peticiones con token inválido o expirado (401)

### Aislamiento de datos

Cada usuario solo puede acceder a sus propias tareas:

- Las queries incluyen filtros por `user_id`
- El `userId` se obtiene del token JWT verificado
- No es posible acceder o modificar tareas de otros usuarios

## 🗂️ Estructura del Proyecto

```
src/
├── app.js                    # Punto de entrada y configuración del servidor
├── controllers/              # Lógica de controladores
│   ├── authController.js     # Registro y login
│   ├── taskController.js     # CRUD de tareas
│   └── userController.js     # Gestión de usuarios
├── db/
│   └── connection.js         # Configuración de la conexión a MySQL
├── middlewares/
│   ├── authMiddleware.js     # Verificación de JWT
│   └── errorHandler.js       # Manejo centralizado de errores
├── routes/                   # Definición de rutas
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   └── userRoutes.js
└── services/                 # Lógica de negocio
    ├── authService.js
    ├── taskService.js
    └── userService.js
```

## 🛡️ Seguridad

- **Contraseñas hasheadas** con bcrypt (12 rounds)
- **JWT firmado** con clave secreta
- **Queries parametrizadas** para prevenir SQL injection
- **Variables de entorno** para datos sensibles
- **Validación de entrada** en todos los endpoints
- **Aislamiento de datos** por usuario
- **Sin exposición de passwords** en respuestas

## 🐛 Códigos de Error

| Código | Descripción                                | Ejemplos                                                       |
| ------ | ------------------------------------------ | -------------------------------------------------------------- |
| 400    | Bad Request - Datos de entrada inválidos   | Email inválido, contraseña muy corta, texto vacío, ID inválido |
| 401    | Unauthorized - Token inválido o faltante   | Token expirado, credenciales incorrectas                       |
| 404    | Not Found - Recurso no encontrado          | Tarea no existe, usuario no encontrado                         |
| 500    | Internal Server Error - Error del servidor | Error de base de datos, error inesperado                       |

## 📝 Notas

- Los tokens JWT expiran en 1 hora
- El límite de paginación máximo es 100 elementos
- Las contraseñas deben tener al menos 6 caracteres
- Se valida el formato de email con expresión regular
- El proyecto usa CommonJS (`require`/`module.exports`)

## 🚧 Mejoras Futuras

- [ ] Implementar refresh tokens
- [ ] Agregar requisitos de complejidad para contraseñas (mayúsculas, números, símbolos)
- [ ] Implementar rate limiting
- [ ] Agregar tests unitarios e integración
- [ ] Documentación con Swagger/OpenAPI
- [ ] Logs estructurados
- [ ] Agregar endpoint para cambiar contraseña
- [ ] Implementar recuperación de contraseña por email

## 📄 Licencia

ISC
