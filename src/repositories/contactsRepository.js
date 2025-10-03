const supabase = require('../supabaseClient');

async function findContactByEmail(email) {
    return supabase.from('contacts').select('*').eq('email', email).single();
}

async function createContact(contact) {
    return supabase.from('contacts').insert([contact], { returning: 'representation' }).select();
}

async function updateContact(id, updates) {
    return supabase.from('contacts').update(updates).eq('id', id).select();
}

async function deleteContact(id) {
    return supabase.from('contacts').delete().eq('id', id);
}

async function getAllContacts() {
    return supabase.from('contacts').select('*');
}

module.exports = {
    findContactByEmail,
    createContact,
    updateContact,
    deleteContact,
    getAllContacts
};