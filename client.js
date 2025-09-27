// const socket = new WebSocket("ws://5.80.142.132");
// const WebSocket = require('ws');
const socket = new WebSocket("ws://5.80.142.132:11110");
document.getElementById("reqsend").addEventListener("click", reqsend);

socket.onopen = () => {
	console.log('connected');
};

function sendreq() {
	socket.send('hi.');
};

socket.onmessage = (event) => {
	console.log('received: ', event.data);
};

socket.onclose = () => {
	console.log('disconnected');
};
