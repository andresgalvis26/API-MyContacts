// services/contactsService.js
function validateContact(contact) {
    if (!contact.nombre || !contact.email) {
        throw new Error('Nombre y email son requeridos');
    }
    return true;
}
module.exports = { validateContact };