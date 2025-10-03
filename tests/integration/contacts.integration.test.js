// 👈 Muy importante: el mock de supabase DEBE ir antes de importar app
// De esta forma interceptamos cualquier llamada a supabase en el código
jest.mock('../../src/supabaseClient', () => ({
    from: jest.fn()
}));

// Dependencias para testing
const request = require('supertest'); // simula requests HTTP
const app = require('../../src/app'); // nuestra app Express
const supabase = require('../../src/supabaseClient'); // el mock de supabase

/**
 * 🔹 TESTS DE INTEGRACIÓN API CONTACTOS
 * Aquí simulamos los endpoints reales de la API,
 * pero sin tocar la base de datos (gracias al mock).
 */
describe('Integration Tests - API de Contactos', () => {

    /**
     * -------------------------------------------
     * GET /api/contacts
     * -------------------------------------------
     * Simulamos un SELECT general a la tabla "contacts"
     * Devolvemos un array con un solo contacto "Mock User".
     */
    describe('GET /api/contacts', () => {
        beforeEach(() => {
            supabase.from.mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    data: [
                        { id: 1, name: 'Mock User', email: 'mock@test.com', phone: '123456789' }
                    ],
                    error: null
                })
            });
        });

        it('debería obtener todos los contactos', async () => {
            const res = await request(app).get('/api/contacts').expect(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data[0]).toHaveProperty('name', 'Mock User');
        });
    });

    /**
     * -------------------------------------------
     * POST /api/contacts
     * -------------------------------------------
     * 1. Primero simulamos la validación de duplicados (select().eq().single()) → sin duplicado.
     * 2. Luego insertamos un nuevo contacto con insert().select().
     */
    describe('POST /api/contacts', () => {
        beforeEach(() => {
            supabase.from.mockReturnValue({
                // Paso 1: Validación duplicado
                select: jest.fn(() => ({
                    eq: jest.fn().mockReturnThis(),
                    single: jest.fn().mockResolvedValue({ data: null, error: null }) // no existe duplicado
                })),
                // Paso 2: Inserción
                insert: jest.fn(() => ({
                    select: jest.fn().mockResolvedValue({
                        data: [{ id: 2, name: 'Nuevo', email: 'nuevo@test.com', phone: '555-1234' }],
                        error: null
                    })
                }))
            });
        });

        it('debería crear un nuevo contacto', async () => {
            const nuevoContacto = { name: 'Nuevo', email: 'nuevo@test.com', phone: '555-1234' };

            const res = await request(app)
                .post('/api/contacts')
                .send(nuevoContacto)
                .expect(201);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('id', 2);
            expect(res.body.data).toHaveProperty('name', 'Nuevo');
        });
    });

    /**
     * -------------------------------------------
     * PUT /api/contacts/:id
     * -------------------------------------------
     * Simulamos un update con eq() + select(),
     * devolviendo el contacto actualizado.
     */
    describe('PUT /api/contacts/:id', () => {
        beforeEach(() => {
            supabase.from.mockReturnValue({
                update: jest.fn(() => ({
                    eq: jest.fn().mockReturnThis(),
                    select: jest.fn().mockResolvedValue({
                        data: [
                            { id: 1, name: 'Actualizado', email: 'mock@test.com', phone: '987654321' }
                        ],
                        error: null
                    })
                }))
            });
        });

        it('debería actualizar un contacto existente', async () => {
            const res = await request(app)
                .put('/api/contacts/1')
                .send({ name: 'Actualizado' })
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('name', 'Actualizado');
        });
    });

    /**
     * -------------------------------------------
     * DELETE /api/contacts/:id
     * -------------------------------------------
     * Simulamos un delete con eq(),
     * devolviendo un array con el id eliminado.
     */
    describe('DELETE /api/contacts/:id', () => {
        beforeEach(() => {
            supabase.from.mockReturnValue({
                delete: jest.fn(() => ({
                    eq: jest.fn().mockResolvedValue({
                        data: [{ id: 1 }],
                        error: null
                    })
                }))
            });
        });

        it('debería eliminar un contacto existente', async () => {
            const res = await request(app).delete('/api/contacts/1').expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toBeDefined();
        });
    });
});