/**
 * Router Webhook principal
 */
const express = require('express')
const router = express.Router()
const checkOrigin = require('../middleware/origin')
const webhook = require('../controllers/webhooks/webhook')
//webhook inicia

router.post('/pruebas', checkOrigin, webhook.postPruebas)

router.post('/points', checkOrigin, webhook.pointschange)


router.get('/', webhook.respuesta)



module.exports = router