const socket = new WebSocket("wss://wlwccs.duckdns.org:49152");
let account_id = "If Nathan is reading this... your roblox game will never come out >:(";

const EncryptData = new TextEncoder();
const DecryptData = new TextDecoder();
async function account_do(type) {
	const username_val = document.getElementById("username").value;
	const password_val = document.getElementById("password").value;
	const token = await window.crypto.subtle.digest("SHA-256", EncryptData.encode(username_val.concat(password_val)));
	socket.send(DecryptData.decode(token).concat(type));
};

function toggle_req() {
	socket.send(account_id);
};

function submit_command() {
	const command_send = "C".concat(command_input.value, '`', account_id);
	socket.send(command_send);
};

const command_input = document.createElement("input");
const command_submit = document.createElement("button");
function panel_switch() {
	const account_panel = document.querySelectorAll(".account-panel");
	for (let i = 0; i < account_panel.length; i++) {
		account_panel[i].remove();
	};
	const panel_heading = document.createElement("h1");
	panel_heading.innerText = "Server Panel";
	const toggle_but = document.createElement("button");
	toggle_but.setAttribute("onclick", "toggle_req()");
	toggle_but.innerText = "Toggle Server";
	const port_contents = document.createElement("p");
	const v4port = (parseInt(account_id)+11111).toString();
	const v6port = (parseInt(account_id)+11112).toString();
	port_contents.innerText = `IPv4 port: ${v4port}, IPv6 port: ${v6port}`;
	const server_val = document.createElement("p");
	server_val.innerText = "Server status: unknown";
	server_val.id = "server_stat";
	const command_panel = document.createElement("div");
	command_panel.class = "command-panel";
	command_panel.id = "command-panel";
	command_input.class = "textinput";
	command_input.id = "input_command";
	command_input.type = "text";
	command_input.name = "commandinput";
	command_submit.setAttribute("onclick", "submit_command()");
	command_submit.innerText = "Run Command";
	command_submit.id = "commandsubmit";
	document.getElementById("server-panel").appendChild(panel_heading);
	document.getElementById("server-panel").appendChild(toggle_but);
	document.getElementById("server-panel").appendChild(port_contents);
	document.getElementById("server-panel").appendChild(server_val);
	document.getElementById("server-panel").appendChild(command_panel);
};

function accountent_check(status) {
	switch (status) {
		case "L1":
			console.log("login failed");
			break;
		case "S1":
			console.log("signup failed");
			break;
		default:
			console.log("signup/login success");
			account_id = status;
			panel_switch();
			break;
	};
};


socket.onopen = () => {
	console.log('connected');
};

socket.onmessage = (event) => {
	console.log('received: ', event.data);
	if (event.data == "none" || event.data == "off" || event.data == "on") {
		document.getElementById("server_stat").innerText = `Server status: ${event.data}`;
		if (event.data == "on") {
			document.getElementById("command-panel").appendChild(command_input);
			document.getElementById("command-panel").appendChild(command_submit);
		} else {
			const companel_clear = document.querySelectorAll(".command-panel");
			for (let i = 0; i < companel_clear.length; i++) {
				if (companel_clear[i].name == command_input.name) {
					command_input.remove();
					const companel_filler = document.createElement("p");
					companel_filler.innerText = "Server is off or doesn't exist.";
					document.getElementById("command-panel").appendChild(companel_filler);
				};
				if (companel_clear[i].id == command_submit.id) {
					command_submit.remove();
				};
			};
		};
	} else {
		accountent_check(event.data);
	};
};

socket.onclose = () => {
	console.log('disconnected');
};
