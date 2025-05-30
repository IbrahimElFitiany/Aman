const mqtt = require('mqtt');

const sensor = mqtt.connect('mqtt://localhost:1883', {
    clientId: 'sensor(publisher)',
});

sensor.on('connect', () => {
    console.log(`Sensor with ID:${sensor.options.clientId} connected to broker`);
});

sensor.on('error', (err) => {
    console.error("MQTT Connection error:", err);
});

module.exports = {
    sensor
}