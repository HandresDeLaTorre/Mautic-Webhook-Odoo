/**
 * Controller Odoo API
 */
 require('dotenv').config()

const Odoo = require('odoo-await');



const odoo = new Odoo({
    baseUrl: process.env.PRODUODOOBASEURL,
    db: process.env.PRODUODOODB,
    port: process.env.PRODUODOOPORT,
    username: process.env.PRODUODOOUSER,
    password: process.env.PRODUODOOPSW,
})

/**
 * Busqueda de un contacto con el campo email
 * @param {string} email -Busqueda de un contacto con el campo email
 * @returns - id
 */
const searchContact = async (email)=> {
    await odoo.connect();
    return await odoo.search('res.partner', {email: email});
}

/**
 * Busqueda de un contacto con el campo email
 * @param {string} email_from -Busqueda de un lead con el campo email
 * @returns - id
 */
const searchLead = async (email_from)=> {
    await odoo.connect();
    return await odoo.search('crm.lead', {email_from: email_from});
}

/**
 * 
 * @param {string} countryName - Busca el Id de el pais para crear el contacto
 * @returns 
 */
const searchCountry = async (countryName)=> {
    await odoo.connect();
    return await odoo.search(`res.country`, {name: countryName});
}

/**
 * 
 * - Creamos un nuevo contacto
 * @param {string} name 
 * @param {string} email 
 * @param {number} country 
 * @param {string} mobile -Crear un nuevo contacto
 * @returns 
 */
const createContact = async (name, email, country, mobile)=> {
    await odoo.connect();
    return await odoo.create('res.partner', {
        name: name,
        email:email,
        country_id: country,
        mobile:mobile
    });
}


const createLead = async (partnerId, nameContact, mobile, userId ) => {
    await odoo.connect();
    return await odoo.create('crm.lead',{
        partner_id: partnerId, 
        name:`Nueva oportunidad desde Mautic de ${nameContact } para ${userId}`,
        phone:mobile,
        priority:'2'
    })
}


const readLeads = async (idLead) =>{
    await odoo.connect();
    return await odoo.read('crm.lead', idLead, ['name', 'stage_id', 'user_id', 'priority', '']);
}


const updateLeads = async (idLead) =>{
    await odoo.connect();
    return await odoo.update('crm.lead', idLead, {priority: '1', stage_id: 3});
}


const readContacts = async () => {
    try {
       await odoo.connect();
       const contacts = await odoo.read('res.partner', [8], ['name', 'email']);
       console.log(contacts);
    } catch (e) {
        console.error(e);
    }
}

//readContacts()

//readContacts()
module.exports = {
    searchContact,
    searchLead,
    readContacts,
    readLeads,
    createContact,
    createLead,
    updateLeads,
    searchCountry
}