const { House, Room, TheftLog , PoliceTracking} = require('../../Aman_User_Module/models/index');


const policeController = {

    track: async (req, res) => {
        try {
            const houses = await House.findAll();

            res.status(200).json({
                houses: houses,
            });
        } 
        
        catch (error) {
            console.error('Error in policeController.track:', error);
            res.status(500).json({ error: 'An error occurred while starting tracking.' });
        }
    },
    trackHouseRooms: async (req, res) => {
        try {
            const houseId = req.params.houseId; 
            const rooms = await Room.findAll({where: {house_id: houseId}});
    
            const latestTheftLog = await TheftLog.findOne({
                where: { house_id: houseId },
                order: [['log_timestamp', 'DESC']],
            });

            if (!latestTheftLog) {
                return res.status(200).json({
                    rooms,
                    status: 'no theif in the House',
                 });
            }
            else{
                const policelogs = await PoliceTracking.findOne({
                    where: {theft_log_id: latestTheftLog.log_id}
                })
    
                if (policelogs == null) {
                     const roomId = latestTheftLog.room_id;
                     const roomName = await Room.findOne({
                        where: {room_id: roomId}
                    })
            
                     res.status(200).json(
                     { 
                         rooms,
                         "Theif in RoomID": roomId,
                         "Theif in RoomName": roomName.room_name
                     });
                }
    
                else{
                    return res.status(200).json({ status: 'no theif in the House' });
                }
            }
        } 
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while getting room details' });
        }
    },
    fireAlarm: async (req, res) => {
        try {
            const { houseId, roomId } = req.body; // Get houseId and roomId from the request body
    
            // Check if houseId and roomId are provided
            if (!houseId || !roomId) {
                return res.status(400).json({ error: 'House ID and Room ID are required' });
            }
    
            // Fetch the latest theft log for the house and room
            const latestTheftLog = await TheftLog.findOne({
                where: { house_id: houseId, room_id: roomId },
                order: [['log_timestamp', 'DESC']],
            });
    
            if (!latestTheftLog) {
                return res.status(404).json({ error: 'No theft logs found for this house and room' });
            }
    
            // Add a new entry to the Police_Tracking table with resolved as false
            const newPoliceTrackingEntry = await PoliceTracking.create({
                theft_log_id: latestTheftLog.log_id,
                resolved: false,
                resolved_timestamp: null, // Initially no resolved timestamp
            });
    
            // Emit the event to the '/police/track' namespace
            const trackNamespace = req.app.get('io').of('/police/track');
            trackNamespace.emit('takeAction', {
                message: "Alarm Fired by police for the room under threat",
                houseId: houseId,
                roomId: roomId,
            });
    
            // Simulate waiting for 5 seconds to resolve the log
            setTimeout(async () => {
                // Resolve the entry after 5 seconds
                await newPoliceTrackingEntry.update({
                    resolved: true,
                    resolved_timestamp: new Date(), // Current timestamp for resolution
                });
                trackNamespace.emit('actionTaken', {
                    message: "Action taken by police for the room under threat",
                    houseId: houseId,
                    roomId: roomId,
                });

            }, 10000);
    
            // Respond back with success
            res.status(200).json({
                message: 'Fire alarm triggered and logged for room',
                houseId: houseId,
                roomId: roomId,
                theftLogId: latestTheftLog.log_id,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while triggering the alarm' });
        }
    },
    
};

module.exports = policeController;
