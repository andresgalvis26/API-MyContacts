const request = require('supertest');
const app = require('../src/app');

describe('API de Contactos', () => {
    describe('GET /', () => {
        it('debería retornar información de la API', async () => {
            const res = await request(app)
                .get('/')
                .expect(200);

            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('version');
            expect(res.body).toHaveProperty('endpoints');
        });
    });

    describe('GET /health', () => {
        it('debería retornar estado OK', async () => {
            const res = await request(app)
                .get('/health')
                .expect(200);

            expect(res.body.status).toBe('OK');
            expect(res.body).toHaveProperty('timestamp');
            expect(res.body).toHaveProperty('uptime');
        });
    });

    describe('GET /api/contacts', () => {
        it('debería obtener todos los contactos', async () => {
            const res = await request(app)
                .get('/api/contacts')
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body).toHaveProperty('data');
            expect(res.body).toHaveProperty('count');
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('GET /api/contacts/:id', () => {
        it('debería obtener un contacto específico', async () => {
            // Primero obtenemos todos los contactos para obtener un ID válido
            const allContacts = await request(app).get('/api/contacts');
            const contactId = allContacts.body.data[0].id;

            const res = await request(app)
                .get(`/api/contacts/${contactId}`)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('id', contactId);
            expect(res.body.data).toHaveProperty('nombre');
            expect(res.body.data).toHaveProperty('email');
        });

        it('debería retornar 404 para contacto inexistente', async () => {
            const res = await request(app)
                .get('/api/contacts/999999')
                .expect(404);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Contacto no encontrado');
        });
    });

    describe('POST /api/contacts', () => {
        it('debería crear un nuevo contacto', async () => {
            const nuevoContacto = {
                nombre: 'Test User',
                email: 'test@example.com',
                telefono: '555-0123'
            };

            const res = await request(app)
                .post('/api/contacts')
                .send(nuevoContacto)
                .expect(201);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data.nombre).toBe(nuevoContacto.nombre);
            expect(res.body.data.email).toBe(nuevoContacto.email);
            expect(res.body.data).toHaveProperty('fechaCreacion');
        });

        it('debería validar campos requeridos', async () => {
            const contactoInvalido = {
                telefono: '555-0123'
                // falta nombre y email
            };

            const res = await request(app)
                .post('/api/contacts')
                .send(contactoInvalido)
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Nombre y email son requeridos');
        });

        it('debería prevenir emails duplicados', async () => {
            const contacto1 = {
                nombre: 'Usuario 1',
                email: 'duplicado@example.com'
            };

            const contacto2 = {
                nombre: 'Usuario 2',
                email: 'duplicado@example.com'
            };

            // Crear primer contacto
            await request(app)
                .post('/api/contacts')
                .send(contacto1)
                .expect(201);

            // Intentar crear segundo contacto con mismo email
            const res = await request(app)
                .post('/api/contacts')
                .send(contacto2)
                .expect(409);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Ya existe un contacto con ese email');
        });
    });

    describe('PUT /api/contacts/:id', () => {
        it('debería actualizar un contacto existente', async () => {
            // Crear un contacto primero
            const nuevoContacto = {
                nombre: 'Para Actualizar',
                email: 'actualizar@example.com'
            };

            const createRes = await request(app)
                .post('/api/contacts')
                .send(nuevoContacto);

            const contactId = createRes.body.data.id;

            // Actualizar el contacto
            const datosActualizados = {
                nombre: 'Contacto Actualizado',
                telefono: '555-9999'
            };

            const res = await request(app)
                .put(`/api/contacts/${contactId}`)
                .send(datosActualizados)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.nombre).toBe(datosActualizados.nombre);
            expect(res.body.data.telefono).toBe(datosActualizados.telefono);
            expect(res.body.data).toHaveProperty('fechaModificacion');
        });

        it('debería retornar 404 para contacto inexistente', async () => {
            const res = await request(app)
                .put('/api/contacts/999999')
                .send({ nombre: 'Test' })
                .expect(404);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Contacto no encontrado');
        });
    });

    describe('DELETE /api/contacts/:id', () => {
        it('debería eliminar un contacto existente', async () => {
            // Crear un contacto primero
            const nuevoContacto = {
                nombre: 'Para Eliminar',
                email: 'eliminar@example.com'
            };

            const createRes = await request(app)
                .post('/api/contacts')
                .send(nuevoContacto);

            const contactId = createRes.body.data.id;

            // Eliminar el contacto
            const res = await request(app)
                .delete(`/api/contacts/${contactId}`)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Contacto eliminado exitosamente');

            // Verificar que el contacto ya no existe
            await request(app)
                .get(`/api/contacts/${contactId}`)
                .expect(404);
        });

        it('debería retornar 404 para contacto inexistente', async () => {
            const res = await request(app)
                .delete('/api/contacts/999999')
                .expect(404);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Contacto no encontrado');
        });
    });

    describe('Endpoints inexistentes', () => {
        it('debería retornar 404 para rutas no encontradas', async () => {
            const res = await request(app)
                .get('/api/inexistente')
                .expect(404);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Endpoint no encontrado');
        });
    });
});