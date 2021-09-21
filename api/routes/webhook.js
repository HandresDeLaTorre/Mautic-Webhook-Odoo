/**
 * Router Webhook principal
 */
 const express = require('express')
 const router = express.Router()
 //const checkOrigin = require('../middleware/origin')
 const webhook = require('../controllers/webhooks/webhook')
 //webhook inicia
 router.post('/callback', webhook.listener2);
 
 router.post('/callbacktest', webhook.listenertest);
 
 router.post('/callbacktest2', webhook.searchContactByemail);
 
 router.post('/points', webhook.pointschange)
 
 //router.get('/callbacktest2', webhook.searchContactByemail);
 
 router.get('/', webhook.respuesta)
 
 
 
 module.exports = router 