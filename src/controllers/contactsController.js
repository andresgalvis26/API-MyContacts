// src/controllers/contactsController.js

// Importar dependencias necesarias
// const { v4: uuidv4 } = require('uuid');
const supabase = require('../supabaseClient');

// Clase controlador para manejar operaciones de contactos
// En un entorno real, estas operaciones interactuarían con una base de datos
// Aquí se simula con un array en memoria
class ContactsController {
    constructor() {
        // Simular base de datos en memoria
        // this.contacts = [
        //     {
        //         id: '1',
        //         nombre: 'Juan Pérez',
        //         email: 'juan@example.com',
        //         telefono: '123-456-7890',
        //         fechaCreacion: new Date().toISOString()
        //     },
        //     {
        //         id: '2',
        //         nombre: 'María García',
        //         email: 'maria@example.com',
        //         telefono: '098-765-4321',
        //         fechaCreacion: new Date().toISOString()
        //     },
        //     {
        //         id: '3',
        //         nombre: 'Carlos López',
        //         email: 'carlos@example.com',
        //         telefono: '555-555-5555',
        //         fechaCreacion: new Date().toISOString()
        //     },
        //     {
        //         id: '4',
        //         nombre: 'Ana Martínez',
        //         email: 'ana@example.com',
        //         telefono: '444-444-4444',
        //         fechaCreacion: new Date().toISOString()
        //     }
        // ];
    }

    // GET /api/contacts - Obtener todos los contactos
    async getAllContacts(req, res) {
        try {
            const { data, error } = await supabase
                .from('contacts')
                .select('*');

            if (error) throw error;

            res.status(200).json({
                success: true,
                data,
                count: data.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // GET /api/contacts/:id - Obtener un contacto por ID
    async getContactById(req, res) {
        try {
            const { id } = req.params;
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                return res.status(404).json({
                    success: false,
                    message: 'Contacto no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // POST /api/contacts - Crear un nuevo contacto
    async createContact(req, res) {
        try {
            const { name, email, phone } = req.body;

            // Validaciones básicas
            if (!name || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre y email son requeridos'
                });
            }

            // Verificar si el email ya existe
            const existingContact = await supabase
                .from('contacts')
                .select('*')
                .eq('email', email)
                .single();

            if (existingContact.data) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un contacto con ese email'
                });
            }

            const newContact = {
                name,
                email,
                phone
            };

            // Insertar y especificar que queremos los datos de retorno
            const { data, error } = await supabase
                .from('contacts')
                .insert([newContact])
                .select();

            if (error) throw error;

            // Agregar el nuevo contacto a la lista
            res.status(201).json({
                success: true,
                message: 'Contacto creado exitosamente',
                data: data[0]
            });
        } catch (error) {
            console.error('Error creando contacto:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // PUT /api/contacts/:id - Actualizar un contacto
    async updateContact(req, res) {
        try {
            const id = parseInt(req.params.id, 10); // Asegura que sea número
            const { name, email, phone } = req.body;

            const updates = {
            ...(name && { name }),
            ...(email && { email }),
            ...(phone !== undefined && { phone })
            };

            const { data, error } = await supabase
                .from('contacts')
                .update(updates)
                .eq('id', id)
                .select();

            if (error || !data.length) {
                return res.status(404).json({
                    success: false,
                    message: 'Contacto no encontrado',
                    error: error ? error.message : 'No se pudo actualizar'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Contacto actualizado exitosamente',
                data: data[0],
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // DELETE /api/contacts/:id - Eliminar un contacto
    async deleteContact(req, res) {
        try {
            const { id } = req.params;

            const { error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', id);
                
                
            if (error) throw error;

            res.status(200).json({
                success: true,
                message: 'Contacto eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
    // Método para resetear datos (útil para testing)
    // resetContacts() {
    //     this.contacts = [];
    // }

    // Método para obtener la cantidad de contactos
    // getContactsCount() {
    //     return this.contacts.length;
    // }
}

module.exports = ContactsController;