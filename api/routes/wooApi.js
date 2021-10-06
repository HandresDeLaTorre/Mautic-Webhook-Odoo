/**
 * Router wooApi principal
 */
 const express = require('express')
 const router = express.Router()
 //const checkOrigin = require('../middleware/origin')
 const wooApi = require('../controllers/wooapi/wooApi.controller')
 //webhook inicia
 
//  router.post('/pruebas', checkOrigin, webhook.postPruebas)
 
//  router.post('/points', checkOrigin, webhook.pointschange)
 
 
 router.get('/', wooApi.getProducts)

 router.get('/hola', wooApi.helloApi)

 router.get('/uno', wooApi.getProduct)

 router.post('/create', wooApi.createProduct)
 
 
 
 module.exports = router