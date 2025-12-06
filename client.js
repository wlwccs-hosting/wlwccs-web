const socket = new WebSocket("wss://wlwccs.duckdns.org:49152");
let account_id = "freddie gibbs";
let in_spanel = false;

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
	const command_send = "C".concat(command_input.value, '#', account_id);
	socket.send(command_send);
};

const command_input = document.createElement("input");
const command_submit = document.createElement("button");
function panel_switch_init() {
	const account_panel = document.querySelectorAll(".account-panel");
	for (let i = 0; i < account_panel.length; i++) {
		account_panel[i].remove();
	};
	socket.send("A#".concat(account_id));
};

function create_server(bedrock, java) {
	if (bedrock) {
		// bedrock server
		socket.send("NB#".concat(account_id));
	} else if (bedrock && java) {
		// geyser server
		socket.send("NG#".concat(account_id));
	} else if (java) {
		// java server
		socket.send("NJ#".concat(account_id));
	} else {
		// default to bedrock
		socket.send("NB#".concat(account_id));
	};
	const server_panel = document.querySelectorAll("server-panel");
	for (let i = 0; i < server_panel.length; i++) {
		server_panel[i].remove();
	};
	const create_notice = document.createElement("h1");
	create_notice.innerText = "Server is being made.";
	const create_notice2 = document.createElement("p");
	create_notice2.innerText = "Refresh and relogin to your account.";
	document.getElementById("server-panel").appendChild(create_notice);
	document.getElementById("server-panel").appendChild(create_notice2);
};

function panel_switch(amount_status) {
	if (amount_status[1] != '0') {
		const panel_heading = document.createElement("h1");
		panel_heading.innerText = "Server Panel";
		const toggle_but = document.createElement("button");
		toggle_but.setAttribute("onclick", "toggle_req()");
		toggle_but.innerText = "Toggle Server";
		const port_contents = document.createElement("p");
		const v4port = (parseInt(account_id)+11111).toString();
		let v6port = "";
		if (account_id != "1") {
			v6port = (parseInt(account_id)+11113).toString();
		} else {
			v6port = "11113";
		};
		port_contents.innerText = `IPv4 port: ${v4port}, IPv6 port: ${v6port}`;
		const server_val = document.createElement("p");
		server_val.innerText = "Server status: unknown";
		server_val.id = "server_stat";
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
		document.getElementById("server-panel").appendChild(command_input);
		document.getElementById("server-panel").appendChild(command_submit);
	} else {
		in_spanel = true;
		const view_heading = document.createElement("h1");
		view_heading.innerText = "Make a Server";
		const choice_heading = document.createElement("h2");
		choice_heading.innerText = "Server Choice";
		const bedrock_choice = document.createElement("input");
		const bedrock_text = document.createElement("label");
		bedrock_choice.id = "bedrock";
		bedrock_text.setAttribute("for", "bedrock");
		bedrock_text.innerText = "Bedrock Server";
		const java_choice = document.createElement("input");
		const java_text = document.createElement("label");
		java_choice.id = "java";
		java_text.setAttribute("for", "java");
		java_text.innerText = "Java Server";
		const geyser_note = document.createElement("p");
		geyser_note.innerText = "NOTE: If you want to setup a server with both Bedrock AND Java support - press both for a Geyser server. If no choices are picked - it defaults to Bedrock.";
		const server_create = document.createElement("button");
		server_create.setAttribute("onclick", "create_server(bedrock_choice.checked, java_choice.checked)");
		server_create.innerText = "Create Server";
		document.getElementById("server-panel").appendChild(view_heading);
		document.getElementById("server-panel").appendChild(choice_heading);
		document.getElementById("server-panel").appendChild(bedrock_choice);
		document.getElementById("server-panel").apppendChild(bedrock_text);
		document.getElementById("server-panel").appendChild(java_choice);
		document.getElementById("server-panel").appendChild(java_text);
		document.getElementById("server-panel").appendChild(geyser_note);
		document.getElementById("server-panel").appendChild(server_create);
	};
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
			panel_switch_init();
			break;
	};
};


socket.onopen = () => {
	console.log('connected');
};

function subcom_block() {
	console.log("Server is currently not available, stop sending commands.");
};

socket.onmessage = (event) => {
	console.log('received: ', event.data);
	if (in_spanel && (event.data == "none" || event.data == "off" || event.data == "on")) {
		document.getElementById("server_stat").innerText = `Server status: ${event.data}`;
		if (event.data == "on") {
			command_submit.innerText = "Run Command";
			command_submit.setAttribute("onclick", "submit_command()");
		} else {
			command_submit.innerText = "Server is currently not available.";
			command_submit.setAttribute("onclick", "subcom_block()")
		};
	} else if (event.data[0] == 'A') {
		panel_switch(event.data);
	} else {
		accountent_check(event.data);
	};
};

socket.onclose = () => {
	console.log('disconnected');
};
