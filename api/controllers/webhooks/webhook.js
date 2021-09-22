/**
 * Controller Webhook principal
 */
const { httpError } = require('../../helpers/handleError')
//const mautic = require('../mautic/apimautic')
const odooApi = require('../odoo/odooapi')

const respuesta = (req, res) => {
    res.send(`<h1>Funciona el webhook</h1>`)
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
        name: data.firstname.normalizedValue,
        lastname: data.lastname.normalizedValue,
        mobile: data.mobile.normalizedValue,
        country: data.country.normalizedValue,
        email: data.email.normalizedValue,
    }
    const fullname = `${parametros.name} ${parametros.lastname}`;

    try {
        const idLeadOdoo = await odooApi.searchLead(parametros.email)
        const idUsuarioOdoo = await odooApi.searchContact(parametros.email)

        if (points >= 20 && points <= 45 && idUsuarioOdoo.length === 0 && idLeadOdoo.length === 0) {
            // console.log(`*==>Los puntos totales del usuario son: ${points} Se puede crear un usuario`);
            const countryId = await odooApi.searchCountry(parametros.country)
            const crearContact = await odooApi.createContact(parametros.name, parametros.email, parseInt(countryId, 10), parametros.mobile)
            //console.log(`Se creo el contacto ${crearContact}`);
            res.status(200).send({ "completo": "201", "webhook": "TEST" });


        } else if (points >= 46 && points <= 100 && idUsuarioOdoo.length >= 1 && idLeadOdoo.length === 0) {
            const peticiones = turnos.push(points)
            const turno = turnos.length

            const partnerId = parseInt(idUsuarioOdoo, 10);

            const crearLead = async (userId) => {
                const idNewLead = await odooApi.createLead(partnerId, fullname, parametros.mobile, userId);
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

            // console.log(`****==>El Array turno contiene: ${turnos}`);  
            res.status(201).send({ "completo": "201", "webhook": "TEST" });
        } else {
            // console.log('********* Fin del programa ************');
            res.status(201).send({ "completo": "201", "webhook": "TEST" });
        }
    } catch (e) {
        httpError(res, e)
    }
}

const postPruebas = async (req, res) => {
    try {
        const dataHeaders = req.headers
        const dataBody = req.body
        console.log(dataHeaders);
        console.log(dataBody);
        res.send({ "completo": "200", "webhook": "TEST" });
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    pointschange,
    postPruebas,
    respuesta
}
