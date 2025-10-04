const socket = new WebSocket("wss://5.80.142.132:11110");

const EncryptData = new TextEncoder();
const DecryptData = new TextDecoder();
async function account_do(type) {
	const username_val = document.getElementById("username").value;
	const password_val = document.getElementById("password").value;
	const token = await window.crypto.subtle.digest("SHA-256", EncryptData.encode(username_val.concat(password_val)));
	socket.send(DecryptData.decode(token).concat(type));
};

function panel_switch() {
	const account_panel = document.querySelectorAll(".account-panel");
	for (let i = 0; i < account_panel.length; i++) {
		account_panel[i].remove();
	};
	const text_test = document.createElement("p");
	text_test.innerText = "test";
	document.getElementById("server-panel").appendChild(text_test);
};

function signup_check(signup_status) {
	switch (signup_status) {
		case "0":
			console.log("signup success");
			panel_switch();
			break;
		case "1":
			console.log("signup failed");
			break;
	};
};

function login_check(login_status) {
	switch (login_status) {
		case "0":
			console.log("login success");
			panel_switch();
			break;
		case "1":
			console.log("login failed");
			break;
	};
};

socket.onopen = () => {
	console.log('connected');
};

socket.onmessage = (event) => {
	console.log('received: ', event.data);
	switch (event.data[0]) {
		case "S":
			signup_check(event.data[1]);
			break;
		case "L":
			login_check(event.data[1]);
			break;
	};
};

socket.onclose = () => {
	console.log('disconnected');
};
