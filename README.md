# Relvo Landing Page

Landing page moderna para Relvo, un ERP inteligente que automatiza completamente la contabilidad de empresas.

## 🚀 Características

- Diseño moderno con efectos glassmorphism
- Modo claro/oscuro
- Animaciones suaves y efectos interactivos
- Integración con Supabase para captura de early-birds
- Responsive design
- Typewriter effect en el hero
- Tabla comparativa colapsable

## 📋 Requisitos Previos

- Node.js (opcional, para servidor local con npm)
- O Python 3 (para servidor HTTP simple)
- Cuenta de Supabase (gratuita)

## 🔧 Configuración

### 1. Configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **SQL Editor** y ejecuta el siguiente SQL para crear la tabla:

```sql
-- Crear tabla para early-birds
CREATE TABLE early_birds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'landing_page'
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE early_birds ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir inserts públicos
CREATE POLICY "Allow public inserts" ON early_birds
    FOR INSERT
    TO anon
    WITH CHECK (true);
```

4. Ve a **Settings > API** y copia:
   - **Project URL**
   - **anon/public key**

5. Edita `config.js` y reemplaza los valores:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://tu-proyecto.supabase.co',
    anonKey: 'tu-anon-key-aqui'
};
```

### 2. Instalar Dependencias (Opcional)

Si usas el servidor Node.js:

```bash
npm install
```

## 🖥️ Ejecutar Servidor Local

### Opción 1: Servidor HTTP Simple (Python)

```bash
# Python 3
python -m http.server 8000

# O Python 2
python -m SimpleHTTPServer 8000
```

Luego abre: `http://localhost:8000`

### Opción 2: Servidor Node.js

```bash
npx http-server -p 8000
```

O usando el script incluido:

```bash
npm start
```

### Opción 3: Live Server (VS Code)

Si usas VS Code, instala la extensión "Live Server" y haz clic derecho en `index.html` > "Open with Live Server"

## 📁 Estructura de Archivos

```
relvo-landing/
├── index.html              # Página principal
├── config.js               # Configuración de Supabase
├── supabase-integration.js # Lógica de integración con Supabase
├── server.js              # Servidor local (opcional)
├── package.json           # Dependencias Node.js (opcional)
└── README.md             # Este archivo
```

## 🎨 Personalización

### Colores y Tema

Los colores se definen en las variables CSS dentro de `index.html`. Busca `:root` y `body.dark` para modificar los temas.

### Contenido

Edita directamente el HTML en `index.html` para cambiar textos, imágenes o secciones.

## 🔒 Seguridad

- La clave `anon` de Supabase es pública y segura para usar en el frontend
- Row Level Security (RLS) está habilitado en Supabase
- Solo se permiten inserts, no lecturas públicas

## 📝 Notas

- Asegúrate de que `config.js` esté configurado antes de usar el formulario
- El formulario mostrará mensajes de error si Supabase no está configurado
- Los emails duplicados se manejan automáticamente

## 🐛 Troubleshooting

### El formulario no envía datos

1. Verifica que `config.js` tenga las credenciales correctas
2. Asegúrate de que la tabla `early_birds` existe en Supabase
3. Verifica la consola del navegador para errores
4. Confirma que RLS permite inserts públicos

### Errores de CORS

Si ves errores de CORS, verifica que la URL de Supabase en `config.js` sea correcta.

## 📄 Licencia

© 2024 Relvo Inc. Todos los derechos reservados.

