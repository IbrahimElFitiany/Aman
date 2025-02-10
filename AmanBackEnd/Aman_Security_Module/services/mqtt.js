const mqtt = require('mqtt');

const securityClient = mqtt.connect('mqtt://localhost:1883', {
    clientId: 'Security_Station_Subscriber',
});

securityClient.on('connect', () => {
    console.log(`clientID: ${securityClient.options.clientId} Connected to MQTT broker`);

    securityClient.subscribe('sensors/topic', (err) => {
        if (err) {
            console.error('Failed to subscribe to topic:', err);
        } else {
            console.log(`clientID: ${securityClient.options.clientId} Subscribed to topic: sensors/topic`);
        }
    });

    securityClient.subscribe('addHouse/topic', (err) => {
        if (err) {
            console.error('Failed to subscribe to topic:', err);
        } else {
            console.log(`clientID: ${securityClient.options.clientId} Subscribed to topic: addHouse/topic`);
        }
    });
    
});


module.exports = {securityClient};
