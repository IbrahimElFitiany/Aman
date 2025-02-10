const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')



router
.route('/users')
.get(adminController.listUsers)


router
.route('/houses')
.get(adminController.listHouses)


router
.route('/rooms')
.get(adminController.listRooms)


router
.route('/gov')
.post(adminController.addGov)


module.exports = router;