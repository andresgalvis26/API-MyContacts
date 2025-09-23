# 🚀 Guía de Configuración DevOps

Esta guía te llevará paso a paso para implementar todos los conceptos DevOps que estás aprendiendo en Platzi, pero con JavaScript.

## 📋 Checklist de Configuración

### 1. ✅ Configuración Inicial del Proyecto

```bash
# 1. Crear nuevo repositorio en GitHub
# 2. Clonar localmente
git clone <tu-repo-url>
cd api-contactos

# 3. Copiar todos los archivos del proyecto
# 4. Instalar dependencias
npm install

# 5. Verificar que todo funciona
npm test
npm run dev
```

### 2. 🔧 Configuración de GitHub

#### A. Protección de Ramas
1. Ve a tu repo → Settings → Branches
2. Agregar regla para `main`:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

#### B. GitHub Projects
1. En tu repo → Projects → New project
2. Crear columnas:
   - 📋 Backlog
   - 🏗️ In Progress  
   - 👀 In Review
   - ✅ Done
   - 🐛 Bugs

#### C. Crear Environments
1. Ve a Settings → Environments
2. Crear environments:
   - `staging` (auto-deploy desde develop)
   - `production` (requiere approval)

### 3. 📝 Crear Issues de Ejemplo

```markdown
# Issue 1: Configurar CI/CD Pipeline
- [ ] Crear workflow de GitHub Actions
- [ ] Configurar testing automatizado
- [ ] Implementar security scan
- [ ] Setup deployment pipeline

# Issue 2: Mejorar Validaciones API
- [ ] Validar formato de email
- [ ] Validar formato de teléfono
- [ ] Agregar más pruebas unitarias

# Issue 3: Implementar Logging
- [ ] Agregar Winston para logging
- [ ] Log de requests HTTP
- [ ] Log de errores

# Issue 4: Containerización
- [ ] Crear Dockerfile
- [ ] Setup docker-compose
- [ ] Configurar health checks
```

### 4. 🧪 Verificar que Todo Funciona

```bash
# Instalar dependencias
npm install

# Ejecutar pruebas - deberías ver ~17 tests
npm test

# Ejecutar con coverage
npm run test:coverage

# Ejecutar servidor
npm run dev

# Probar endpoints:
curl http://localhost:3000/
curl http://localhost:3000/api/contacts
curl http://localhost:3000/health
```

### 5. 🔄 Configurar el Pipeline CI/CD

#### A. El pipeline ya está creado en `.github/workflows/ci-cd.yml`
#### B. Configurar Secrets (si necesario)
- Ve a repo → Settings → Secrets and variables → Actions
- Agregar secretos como:
  - `CODECOV_TOKEN` (opcional)
  - Credenciales de deployment (cuando sea necesario)

### 6. 🐳 Docker (Opcional pero Recomendado)

```bash
# Construir imagen
docker build -t api-contactos .

# Ejecutar contenedor
docker run -p 3000:3000 api-contactos

# O usar docker-compose
docker-compose up
```

## 🎯 Flujo de Trabajo DevOps

### Desarrollo de Nueva Funcionalidad

1. **Crear Issue** en GitHub Projects
2. **Crear rama** desde main:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Desarrollar** con TDD:
   ```bash
   # Escribir prueba primero
   npm run test:watch
   # Implementar código
   # Ver pruebas pasar ✅
   ```
4. **Commit y Push**:
   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```
5. **Crear Pull Request**
6. **CI ejecuta automáticamente**:
   - ✅ Pruebas en Node 16, 18, 20
   - ✅ Security scan
   - ✅ Coverage report
7. **Code Review**
8. **Merge a main**
9. **Deploy automático** 🚀

### Hotfix de Producción

1. **Crear rama** desde main:
   ```bash
   git checkout -b hotfix/fix-critical-bug
   ```
2. **Fix rápido** con prueba
3. **PR directo a main**
4. **Deploy inmediato**

## 📊 Métricas DevOps a Monitorear

### 1. Lead Time
- Tiempo desde commit hasta producción
- **Meta**: < 1 día

### 2. Deployment Frequency  
- Qué tan seguido hacemos deploy
- **Meta**: Múltiples deploys por día

### 3. Mean Time to Recovery (MTTR)
- Tiempo para recuperarse de fallas
- **Meta**: < 1 hora

### 4. Change Failure Rate
- % de deploys que causan fallas
- **Meta**: < 15%

## 🛠️ Herramientas Utilizadas

| Herramienta | Propósito | Equivalente C# |
|-------------|-----------|----------------|
| **Jest** | Testing Framework | xUnit, NUnit |
| **Supertest** | API Testing | ASP.NET Core Testing |
| **GitHub Actions** | CI/CD | Azure DevOps |
| **Node.js** | Runtime | .NET Runtime |
| **Express** | Web Framework | ASP.NET Core |
| **npm** | Package Manager | NuGet |
| **Docker** | Containerization | Docker (mismo) |

## 🔍 Debugging del Pipeline

### Si las pruebas fallan:
```bash
# Ejecutar localmente
npm test -- --verbose

# Ver coverage
npm run test:coverage

# Ejecutar una prueba específica
npm test -- --testNamePattern="debería crear un nuevo contacto"
```

### Si el servidor no inicia:
```bash
# Verificar sintaxis
node -c src/app.js

# Ver logs detallados
DEBUG=* npm run dev
```

## 🎯 Comandos de Ejemplo para Probar la API

```bash
# Obtener todos los contactos
curl -X GET http://localhost:3000/api/contacts

# Crear un contacto
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos Mendoza",
    "email": "carlos@test.com",
    "telefono": "555-0199"
  }'

# Obtener contacto por ID (usar ID real)
curl -X GET http://localhost:3000/api/contacts/1

# Actualizar contacto
curl -X PUT http://localhost:3000/api/contacts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos Mendoza Actualizado",
    "telefono": "555-9999"
  }'

# Eliminar contacto
curl -X DELETE http://localhost:3000/api/contacts/1

# Health check
curl -X GET http://localhost:3000/health
```

## 🎓 Conceptos Clave Aprendidos

1. **Infrastructure as Code** → Dockerfile, docker-compose
2. **Pipeline as Code** → .github/workflows/ci-cd.yml
3. **Test Automation** → Jest + Supertest
4. **GitOps** → Todo controlado por Git
5. **Shift Left** → Testing temprano en el pipeline
6. **Continuous Integration** → Merge frecuente + tests automáticos
7. **Continuous Deployment** → Deploy automático en merge
8. **Monitoring** → Health checks + logging

## 🚀 Próximos Pasos Avanzados

1. **Implement Feature Flags**
2. **Add Prometheus Metrics**  
3. **Setup ELK Stack** para logging
4. **Blue-Green Deployments**
5. **A/B Testing Framework**
6. **Security Scanning** con Snyk
7. **Performance Testing** con Artillery
8. **Database Integration** (MongoDB, PostgreSQL)
9. **API Documentation** con Swagger/OpenAPI
10. **Load Testing** con Artillery o k6

## 🔧 Troubleshooting Común

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error en las pruebas
```bash
# Ejecutar una prueba específica
npm test -- --testNamePattern="GET /"

# Ver output detallado
npm test -- --verbose
```

### Puerto 3000 ocupado
```bash
# Cambiar puerto
PORT=3001 npm run dev

# O matar proceso
lsof -ti :3000 | xargs kill -9
```

---

¡Ahora tienes una réplica completa del flujo DevOps del curso de Platzi, pero con JavaScript! 🎉

**¿Siguiente paso?** ¡Crea tu repo en GitHub y empieza a configurar la protección de ramas!