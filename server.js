const awsIot = require('aws-iot-device-sdk');
const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = 4000; // Specify the port number you want to use

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});

const device = awsIot.device({
  keyPath: 'private_ECG.key',
  certPath: 'certificate_ECG.crt',
  caPath: 'AmazonRootCA1 (3).pem',
  clientId: '1234',
  host: 'a3odoutj13lvzg-ats.iot.us-east-1.amazonaws.com'
});

device.on('connect', () => {
  console.log('Connected to AWS');
  device.subscribe('topic_1');
});

io.on('connection', (socket) => {
  console.log('Connected to Sockets');
  socket.on("status", (arg) => {
    console.log("Set Status to:: " + arg);
    device.publish('topic_1', arg);
  });  
});

device.on('message', (topic, payload) => {
  console.log('message', topic, payload.toString());
  io.emit('send', payload.toString());
});

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
