// src/controllers/contactsController.js

// Importar dependencias necesarias
const { v4: uuidv4 } = require('uuid');

// Clase controlador para manejar operaciones de contactos
// En un entorno real, estas operaciones interactuarían con una base de datos
// Aquí se simula con un array en memoria
class ContactsController {
    constructor() {
        // Simular base de datos en memoria
        this.contacts = [
            {
                id: '1',
                nombre: 'Juan Pérez',
                email: 'juan@example.com',
                telefono: '123-456-7890',
                fechaCreacion: new Date().toISOString()
            },
            {
                id: '2',
                nombre: 'María García',
                email: 'maria@example.com',
                telefono: '098-765-4321',
                fechaCreacion: new Date().toISOString()
            }
        ];
    }

    // GET /api/contacts - Obtener todos los contactos
    getAllContacts(req, res) {
        try {
            res.status(200).json({
                success: true,
                data: this.contacts,
                count: this.contacts.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // GET /api/contacts/:id - Obtener un contacto por ID
    getContactById(req, res) {
        try {
            const { id } = req.params;
            const contact = this.contacts.find(c => c.id === id);

            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: 'Contacto no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: contact
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // POST /api/contacts - Crear un nuevo contacto
    createContact(req, res) {
        try {
            const { nombre, email, telefono } = req.body;

            // Validaciones básicas
            if (!nombre || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre y email son requeridos'
                });
            }

            // Verificar si el email ya existe
            const existingContact = this.contacts.find(c => c.email === email);
            if (existingContact) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un contacto con ese email'
                });
            }

            const newContact = {
                id: uuidv4(),
                nombre,
                email,
                telefono: telefono || '',
                fechaCreacion: new Date().toISOString()
            };

            this.contacts.push(newContact);

            res.status(201).json({
                success: true,
                data: newContact,
                message: 'Contacto creado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // PUT /api/contacts/:id - Actualizar un contacto
    updateContact(req, res) {
        try {
            const { id } = req.params;
            const { nombre, email, telefono } = req.body;

            const contactIndex = this.contacts.findIndex(c => c.id === id);

            if (contactIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Contacto no encontrado'
                });
            }

            // Verificar si el email ya existe en otro contacto
            if (email) {
                const existingContact = this.contacts.find(c => c.email === email && c.id !== id);
                if (existingContact) {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe otro contacto con ese email'
                    });
                }
            }

            // Actualizar solo los campos proporcionados
            const updatedContact = {
                ...this.contacts[contactIndex],
                nombre: nombre || this.contacts[contactIndex].nombre,
                email: email || this.contacts[contactIndex].email,
                telefono: telefono !== undefined ? telefono : this.contacts[contactIndex].telefono,
                fechaModificacion: new Date().toISOString()
            };

            this.contacts[contactIndex] = updatedContact;

            res.status(200).json({
                success: true,
                data: updatedContact,
                message: 'Contacto actualizado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // DELETE /api/contacts/:id - Eliminar un contacto
    deleteContact(req, res) {
        try {
            const { id } = req.params;
            const contactIndex = this.contacts.findIndex(c => c.id === id);

            if (contactIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Contacto no encontrado'
                });
            }

            const deletedContact = this.contacts[contactIndex];
            this.contacts.splice(contactIndex, 1);

            res.status(200).json({
                success: true,
                data: deletedContact,
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
    resetContacts() {
        this.contacts = [];
    }

    // Método para obtener la cantidad de contactos
    getContactsCount() {
        return this.contacts.length;
    }
}

module.exports = ContactsController;