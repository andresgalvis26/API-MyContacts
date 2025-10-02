# --- Stage 1: Builder ---
FROM node:22-alpine AS builder

# Instalar dependencias necesarias para compilar módulos nativos (ej: bcrypt, sharp, etc.)
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

# Copiar solo package.json y package-lock.json para aprovechar cache
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar el resto del código
COPY ./src ./src
COPY ./tracing.js ./

# --- Stage 2: Final (ligera) ---
FROM node:22-alpine

WORKDIR /usr/src/app

# Crear usuario no-root
RUN addgroup -S nodejs && adduser -S api-user -G nodejs

# Copiar solo los archivos necesarios desde builder
COPY --from=builder /usr/src/app ./

# Exponer puerto
EXPOSE 3000

# Cambiar a usuario no-root
USER api-user

# Healthcheck (ligero en Node.js)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "const http = require('http'); \
    const options = { hostname: 'localhost', port: 3000, path: '/health', timeout: 2000 }; \
    const req = http.request(options, (res) => { \
    if (res.statusCode === 200) { process.exit(0); } \
    else { process.exit(1); } \
    }); \
    req.on('error', () => process.exit(1)); \
    req.end();"

# Comando por defecto
CMD ["node", "-r", "./tracing.js", "src/app.js"]
