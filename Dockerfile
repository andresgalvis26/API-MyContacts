# Usar la imagen oficial de Node.js
FROM node:22-bullseye-slim

# Información del mantenedor
LABEL maintainer="tu-email@example.com"
LABEL description="API de Contactos para DevOps"

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Variables de entorno para producción
ENV APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=71571f9a-1237-4c12-b1ad-7eec37799378;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/;ApplicationId=8e76c077-7c6a-4dff-97fc-96b8dcb622fc
ENV SUPABASE_URL=https://dahncwtliklmzojpxezh.supabase.co
ENV SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhaG5jd3RsaWtsbXpvanB4ZXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjk2OTMsImV4cCI6MjA3NDkwNTY5M30.dqWmj7GJUCuCA0k38T3yfpWDXz_IKfqhnVgvDC0ZRso

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Crear usuario no-root para seguridad
RUN addgroup --system nodejs && \
    adduser --system --ingroup nodejs api-user

# Copiar código fuente
COPY --chown=api-user:nodejs ./src ./src
COPY --chown=api-user:nodejs ./tracing.js ./

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
# CMD ["npm", "start"]
CMD ["node", "-r", "./tracing.js", "src/app.js"]