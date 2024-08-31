const express = require('express')
const router = express.Router() //Router from express
const mainController = require('../controllers/mainController')

//App Routes
router.get('/', mainController.homepage) //homepage function to run
router.get('/about', mainController.about) //homepage function to run



module.exports=router //exporting router