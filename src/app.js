const express = require('express');
const cors = require('cors');
const ContactsController = require('./controllers/contactsController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Instancia del controlador
const contactsController = new ContactsController();

// Middleware de logging (opcional)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas
app.get('/', (req, res) => {
    res.json({
        message: 'API de Contactos - DevOps con JavaScript',
        version: '1.0.0',
        endpoints: {
            'GET /api/contacts': 'Obtener todos los contactos',
            'GET /api/contacts/:id': 'Obtener contacto por ID',
            'POST /api/contacts': 'Crear nuevo contacto',
            'PUT /api/contacts/:id': 'Actualizar contacto',
            'DELETE /api/contacts/:id': 'Eliminar contacto'
        }
    });
});

// Rutas de la API
app.get('/api/contacts', (req, res) => contactsController.getAllContacts(req, res));
app.get('/api/contacts/:id', (req, res) => contactsController.getContactById(req, res));
app.post('/api/contacts', (req, res) => contactsController.createContact(req, res));
app.put('/api/contacts/:id', (req, res) => contactsController.updateContact(req, res));
app.delete('/api/contacts/:id', (req, res) => contactsController.deleteContact(req, res));

// Ruta para healthcheck
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Iniciar servidor solo si no está en modo testing
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        console.log(`📋 API de Contactos lista para DevOps`);
    });
}

module.exports = app;