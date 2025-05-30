const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const sensorController = require('../controllers/sensorController')
const {verifyToken} = require('../middleware/authMiddleware')



router
.route('/register')
.post(userController.register);

router
.route('/rooms')
.get(verifyToken, userController.listRooms)
.post(verifyToken, userController.addRoom)
.delete(verifyToken, userController.removeRoom)
.put(verifyToken, userController.updateRoom);



router
.route('/rooms/:roomid')
.get(verifyToken,userController.listFurniture)
.post(verifyToken, userController.addFurniture)
.delete(verifyToken, userController.deleteFurniture)
.put(verifyToken, userController.updateFurniture)





//click on furniture?? idk
router
.route('/rooms/:roomName/:furnitureName')
.post(verifyToken, sensorController.clickOnFurniture);

module.exports = router;