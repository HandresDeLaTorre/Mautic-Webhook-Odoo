/**
 * Controller Webhook principal
 */
const { httpError } = require('../../helpers/handleError')
//const mautic = require('../mautic/apimautic')
const odooApi = require('../odoo/odooapi')

// const crypto = require('crypto-js');
// const sha256 = require ('crypto-js/sha256');
// const hmacSHA256 = require ('crypto-js/hmac-sha512');
// const Base64 = require ('crypto-js/enc-base64');
// const crypto = require('crypto');
// const getRawBody = require('raw-body');
// const { error } = require('console');

const SECRET = '3dfd764e1cc1a4e3de45e220e174f4655d9b99a65f36882bc7a989fcf41b3413'

//const message, nonce, path, privateKey; // ...
//const hashDigest = sha256(nonce + message);
//const hmacDigest = Base64.stringify(hmacSHA256(path + hashDigest, privateKey));

const Listener = async (req, res) => {
    try {
        const data = req.body;
        const name = data['sessionInfo']['parameters']['person'][0]['name'];
        const email = data['sessionInfo']['parameters']['correo-usuario'][0];
        const mobile = data['sessionInfo']['parameters']['mobile'][0];
        mautic.createUserWithChat(name, email, mobile)
        res.send({ "completo": "200" })
        console.log({ usuario: "nuevo confirmado" });
    } catch (e) {
        httpError(res, e)
    }
}

const respuesta = (req, res) => {
    res.send(`<h1>Funciona el webhook</h1>`)
}

const listener2 = (req, res) => {
    try {

        const body = JSON.stringify(req.body);
        const header = req.headers;
        const headerLength = req.headers['content-length'];

        const computedSignature = crypto.createHmac('sha256', SECRET)
            .update(body)
            .digest('base64');

        console.log('Computed signature (from body):', computedSignature);


        console.log('***---> Body: ');

        //console.log('***---> Header length: ', headerLength);
        res.send({ "completo": "200" });
        console.log('***---> Header full: ', header);
    } catch (e) {
        httpError(res, e)
    }
};

const listenertest = (req, res) => {
    try {
        const data = req.body;
        odooApi.createContact(req)
        res.send({ "completo": "200", 'webhook': 'TEST' });
    } catch (e) {
        httpError(res, e)
    }
}

var peticiones = []

const test2 = (req, res) => {
    try {
        data = req.body.data

        const totalPeticiones = peticiones.push(data)
        console.log(peticiones);
        console.log(totalPeticiones);

        if (totalPeticiones === 3) {
            peticiones = []
            let contador = 0;
            contador++
            var conteofinal = +1
            console.log(`Data es: ${data} && contador es ${contador}`);
        } else {
            contador = 0
        }

        res.send({ "completo": "200", 'webhook': 'TEST' });
    } catch (e) {
        console.error(e);
    }
}

/**
 * Webhook para busqueda de contacto en odoo por email
 */
const searchContactByemail = async (req, res) => {
    let points = parseInt(req.body['mautic.lead_points_change'][0]['points']['new_points'], 10);
    let tags = req.body['mautic.lead_points_change'][0]['contact']['tags']
    let data = req.body['mautic.lead_points_change'][0]['contact']['fields']['core'];
    let name = data.firstname.normalizedValue
    let lastname = data.lastname.normalizedValue
    let fullname = name + ' ' + lastname
    let mobile = data.mobile.normalizedValue
    let country = data.country.normalizedValue
    let email = data.email.normalizedValue
    try {
        const busquedaUsuarioOdoo = await odooApi.searchContact(email)
        const busquedaLeadOdoo = await odooApi.searchLead(email)
        const countryId = await odooApi.searchCountry(country)
        if (busquedaUsuarioOdoo.length === 0 && busquedaLeadOdoo.length === 0) {
            if (points >= 25 && points <= 50) {
                const contactoIdCreate = await odooApi.createContact(fullname, email, parseInt(countryId, 10), mobile);
                console.log(`***==>Se creo un nuevo contacto el id es: ${contactoIdCreate}`);
            } else console.log(`**==> No existe el contacto pero necesita entre 25 y 50 puntos para ser creado solo tiene ${points}`);

        } else if (busquedaLeadOdoo.length === 0 && busquedaUsuarioOdoo.length >= 1) {
            if (points >= 51 && points <= 80) {
                console.log(`***==>El Lead se puede crear ahora `);
                const leadCreated = await odooApi.createLead(parseInt(busquedaUsuarioOdoo, 10), fullname, mobile);
                console.log(`****=>Se Creo el Lead nº ${leadCreated}`);
            } else {
                console.log(`****==>El lead necesita mas de 51 puntos; tan solo tiene ${points}`);
            }
        } else {
            console.log(`No se ejecuto ningun metodo el usuario solo tiene ${points} puntos`);
            //const updateDataLead = await odooApi.updateLeads(parseInt(busquedaLeadOdoo, 10))
            //console.log(updateDataLead);
            const dataLead = await odooApi.readLeads(busquedaLeadOdoo);
            console.log(`***La Data del Lead es: ${JSON.stringify(dataLead)}`);
        }
        res.send({ "completo": "200", "webhook": "TEST" });
    } catch (e) {
        httpError(res, e)
    }
}

let turnos = []


/**
 * 
 * @param {*} req - 
 * @param {*} res 
 */
const pointschange = async (req, res) => {
    const points = parseInt(req.body['mautic.lead_points_change'][0]['points']['new_points'], 10);
    const tags = req.body['mautic.lead_points_change'][0]['contact']['tags'];
    const data = req.body['mautic.lead_points_change'][0]['contact']['fields']['core'];
    const parametros = {
        name : data.firstname.normalizedValue,
        lastname : data.lastname.normalizedValue,
        mobile : data.mobile.normalizedValue,
        country : data.country.normalizedValue,
        email : data.email.normalizedValue,
    }
    const fullname = `${parametros.name} ${parametros.lastname}`;

    try {
        const idLeadOdoo = await odooApi.searchLead(parametros.email)
        const idUsuarioOdoo = await odooApi.searchContact(parametros.email)
        
        if (points >= 20 && points <= 45 && idUsuarioOdoo.length === 0 && idLeadOdoo.length === 0) {
            console.log(`*==>Los puntos totales del usuario son: ${points} Se puede crear un usuario`);

        
        } else if (points >= 46 && points <= 100 && idUsuarioOdoo.length >= 1 && idLeadOdoo.length === 0){
            const peticiones = turnos.push(points)
            const turno = turnos.length

            const partnerId = parseInt(idUsuarioOdoo, 10);

            const crearLead = async (userId ) =>{ 
                const idNewLead = await odooApi.createLead(partnerId, fullname, parametros.mobile, userId );
                return idNewLead;
            }

            switch (turno) {
                case 1:
                    //console.log(`ASESOR ${turno}`);
                    const idlead1 = await crearLead(turno)
                    console.log(`*==> Se creo un Lead con el ID: ${idlead1} para el ASESOR ${turno}`);
                    break;
                case 2:
                    //console.log(`ASESOR ${turno}`);
                    const idlead2 = await crearLead(turno)
                    console.log(`*==> Se creo un Lead con el ID: ${idlead2} para el ASESOR ${turno}`);
                    break; 
                case 3:
                    //console.log(`ASESOR ${turno}`);
                    const idlead3 = await crearLead(turno)
                    console.log(`*==> Se creo un Lead con el ID: ${idlead3} para el ASESOR ${turno}`);
                    turnos = []
                    break;            
                default:
                    turnos = []
                    console.log('Vamos a borra el array');
                    break;
            }

            console.log(`****==>El Array turno contiene: ${turnos}`);         
        }else{
            console.log('********* Fin del programa ************');
        }
    res.send({ "completo": "200", "webhook": "TEST" });
    } catch (e) {
        httpError(res, e)
    }
}

module.exports = {
    test2,
    respuesta,
    listener2,
    listenertest,
    searchContactByemail,
    pointschange,
    Listener
}
