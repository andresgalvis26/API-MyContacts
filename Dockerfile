# Usar la imagen oficial de Node.js
FROM node:22-alpine

# Información del mantenedor
LABEL maintainer="tu-email@example.com"
LABEL description="API de Contactos para DevOps"

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S api-user -u 1001

# Copiar código fuente
COPY --chown=api-user:nodejs ./src ./src

# Exponer el puerto
EXPOSE 3000

# Cambiar a usuario no-root
USER api-user

# Definir healthcheck
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
CMD ["node", "src/app.js"]