// 👇 Importamos la función que queremos probar desde el servicio
// En este caso validateContact se encarga de validar datos antes de crear un contacto
const { validateContact } = require('../../src/services/contactsService');

/**
 * 🔹 TESTS UNITARIOS - Contacts Service
 * A diferencia de los tests de integración, aquí NO usamos Express ni Supabase.
 * Sólo probamos la lógica pura del servicio: validar que un contacto tenga nombre y email.
 */
describe('Unit Tests - Contacts Service', () => {

    /**
     * ✅ Caso 1: Contacto válido
     * Debe devolver "true" porque cumple las validaciones.
     */
    it('debería validar correctamente un contacto válido', () => {
        const contacto = { nombre: 'Andrés', email: 'andres@test.com' };
        expect(validateContact(contacto)).toBe(true);
    });

    /**
     * ❌ Caso 2: Falta el nombre
     * La función debería lanzar un error porque "nombre" es requerido.
     */
    it('debería lanzar error si falta el nombre', () => {
        const contacto = { email: 'andres@test.com' };
        expect(() => validateContact(contacto)).toThrow('Nombre y email son requeridos');
    });

    /**
     * ❌ Caso 3: Falta el email
     * La función debería lanzar un error porque "email" es requerido.
     */
    it('debería lanzar error si falta el email', () => {
        const contacto = { nombre: 'Andrés' };
        expect(() => validateContact(contacto)).toThrow('Nombre y email son requeridos');
    });
});