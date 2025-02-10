require ('dotenv').config()
const express = require('express');
const policeRoutes = require('./routes/policeRoutes');
const {securityClient} = require("./services/mqtt");
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');



const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use('/police', policeRoutes);

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const trackNamespace = io.of('/police/track');

trackNamespace.on('connection', (socket) => {
    console.log(`A client connected to /police/track socketid: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`A client disconnected from /police/track socketid: ${socket.id}`);
    });
});

app.set('io', io);


securityClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    const trackNamespace = io.of('/police/track');
    
    if (topic === 'sensors/topic') {
        console.log('Handling message from sensors/topic');
        trackNamespace.emit('sensorTriggered', data);
    } else if (topic === 'addHouse/topic') {
        console.log('Handling message from addHouse/topic');
        trackNamespace.emit('houseAdded', data);
    }
});




const PORT = process.env.APP_PORT;
server.listen(PORT, () => {
    console.log(`Police app listening on http://localhost:${PORT}`);
});
