const { User,House,Room,Sensor,Furniture} = require('../models/index');
const sensorController = require('./sensorController')
const db = require('../config/config')

const userController = {

    register: async (req, res) => {
        const { username, password, email, longitude, latitude, government, city, address } = req.body;
    
        if (!username || !password || !email || !longitude || !latitude || !government || !city) {
            return res.status(400).json({ error: "All fields are required." });
        }
    
        const t = await db.transaction();
        try {
            
            const newUser = await User.create(
                { username, password_hash: password, email },
                { transaction: t }
            );
            const userHouse = await House.create(
                { user_id: newUser.user_id, longitude, latitude, government, city, address },
                { transaction: t }
            );
    
            await t.commit();
            res.status(201).json({ message: 'User and house created successfully', user: newUser });
        } catch (error) {
            await t.rollback();
            res.status(500).json({ error: error.message });
        }
    },
    listRooms: async (req, res) => {

        const userHouseID = req.user.house_id;

        try {
            const rooms = await Room.findAll({ where: {house_id: userHouseID} });

            if (!rooms) {
                return res.status(404).json({ error: "no Rooms found" });
            }
    
            res.status(200).json({
                rooms
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    addRoom: async (req, res) => {

        const { roomName, hasSensor} = req.body;

        if (!roomName || hasSensor == null) { 
            return res.status(400).json({ error: "Enter All fields" })
        };

        const userHouseID = req.user.house_id;

        const existingRoom = await Room.findOne({
            where: {
            house_id: userHouseID,
            room_name: roomName.toLowerCase()
            }
        });
        
        if (existingRoom) {
            return res.status(400).json({
            error: "A room with this name already exists in the house."
            });
        }
        
        let sensorId = null

        if (hasSensor) { 
            const newSensor = await Sensor.create({sensor_type: "Door Sensor"})
            sensorId = newSensor.sensor_id
        }

        try {
            const newRoom = await Room.create({
                house_id: userHouseID,
                room_name: roomName.toLowerCase(),
                sensor_id: sensorId
            });

            res.status(201).json({ message: 'Room created successfully'});
        } 
        catch (error) {
            res.status(500).json({ error: error.message});
        }
    },
    removeRoom: async (req, res) => {
        const { roomid } = req.body;
    
        if (!roomid) {
            return res.status(400).json({ error: "please select a valid room" });
        }
    
        try {

            const userHouseID = req.user.house_id;
            const existingRoom = await Room.findOne({
                where: {
                    house_id: userHouseID,
                    room_id: roomid
                }
            });
    
            if (!existingRoom) {
                return res.status(400).json({ error: "wrong Room ID" });
            }

            if (existingRoom.sensor_id) {
                await Sensor.destroy({
                    where: { sensor_id: existingRoom.sensor_id }
                });
            }
            
            await existingRoom.destroy();

            res.status(200).json({ message: 'Room deleted successfully' });
        } 
        
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateRoom: async (req, res)=>{

    },
    listFurniture: async (req, res) => {

        const { roomid } = req.params;     
        const userHouseID = req.user.house_id;

        try {
            const room = await Room.findOne({ where: { room_id: roomid , house_id: userHouseID} });
    
            if (!room) {
                return res.status(404).json({ error: "Room not found" });
            }

            const furniture = await Furniture.findAll({where:{room_id: roomid}})
    
            const userIsThief = req.user.isThief;
            if (userIsThief && room.sensor_id != null){
                
                sensorController.clickOnRoom(req,res,room)
                console.log(`User is thief: ${userIsThief}`);
            }
            
    
            res.status(201).json({
                furniture,
                isThief: userIsThief
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    addFurniture: async (req, res) => {
        const { roomid } = req.params;
        const { furnitureName , hasSensor} = req.body;
    
        if (!furnitureName || hasSensor == null) {
            return res.status(400).json({ error: "Please provide furnitureName" });
        }
    
        const userHouseID = req.user.house_id;

        try {
            const room = await Room.findOne({ where: { room_id: roomid , house_id: userHouseID } });

            if (!room) {
                return res.status(404).json({ error: "Room not found" });
            }

            let sensorId = null

            if (hasSensor) 
                { 
                const newSensor = await Sensor.create({sensor_type: "Movement Detector"})
                sensorId = newSensor.sensor_id
            }

            const newFurniture = await Furniture.create({
                room_id: room.room_id,
                furniture_name: furnitureName.toLowerCase(),
                sensor_id: sensorId
            });
    
            res.status(201).json({
                message: "Furniture added successfully",
                furniture: newFurniture,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteFurniture: async (req, res) => {
        const {roomid} = req.params;
        const {furniture_id} = req.body;
    
        if (!furniture_id) {
            return res.status(400).json({ error: "Please provide a valid furnitureID" });
        }
    
        
        const userHouseID = req.user.house_id;

        try {
            const room = await Room.findOne({ where: { room_id: roomid , house_id: userHouseID}});
    
            if (!room) {
                return res.status(404).json({ error: "Room not found" });
            }

            const existingFurniture = await Furniture.findOne({where:{room_id: roomid, furniture_id: furniture_id}})
            
            
            if (!existingFurniture) {
                return res.status(400).json({ error: "No furniture with this name." });
            }

            await existingFurniture.destroy();

            if (existingFurniture.sensor_id) {
                await Sensor.destroy({
                    where: { sensor_id: existingFurniture.sensor_id }
                });
            }
            
            
            res.status(201).json({
                message: "Furniture deleted successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateFurniture: async(req, res)=>{

    }
};

module.exports = userController;
