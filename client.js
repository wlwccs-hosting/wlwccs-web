// const net = require(['net']);
import net from 'node:net';
const PORT = 11110;
const HOSTNAME = '192.168.1.94';

const client = net.createConnection(PORT, HOSTNAME, () => {
	console.log('Connected to server');
	// client.write('yo');
});

function sendreq() {
	client.write('sending request!!');
};

document.getElementById("reqsend").addEventListener("click", sendreq);

client.setEncoding('utf8');

client.on('data', (data) => {
	console.log(`Received data from server: ${data}`);
});

client.on('end', () => {
	console.log('Disconnected from server');
});

client.on('error', (err) => {
	console.error('Connection error: ', err);
});
