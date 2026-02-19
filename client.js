const socket = new WebSocket("wss://wlwccs.duckdns.org:49152");
let account_id = "freddie gibbs";
let in_spanel = false;
let received_status = "none";
let account_key = "";

const EncryptData = new TextEncoder();
const DecryptData = new TextDecoder();
async function account_do(type) {
	let age = 0;
	if (type == 'S') {
		const bday_check = (document.getElementById("birthday").value).split('-');
		const object_date = new Date();
		const current_date = object_date.toISOString().split('T')[0].split('-');
		age = parseInt(current_date[0]) - parseInt(bday_check[0]);
		const month = parseInt(current_date[1]) - parseInt(bday_check[1]);
		if (month < 0 || (month == 0 && parseInt(bday_check[2]) > parseInt(current_date[2]))) {
			age--;
		};
	};
	if (type != 'S' || (type == 'S' && age >= 13)) {
		const username_val = document.getElementById("username").value;
		const password_val = document.getElementById("password").value;
		const token = await window.crypto.subtle.digest("SHA-256", EncryptData.encode(username_val.concat(password_val)));
		account_key = DecryptData.decode(token);
		socket.send(account_key.concat(type));
	} else {
		document.getElementById("signup-status").innerText = "You must be 13 or above to make a WLWCCS Hosting account.";
	};
};

function toggle_req() {
	socket.send(`${account_id}#${account_key}`);
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

let amountStatus = "";
function server_type(amount_status) {
	amountStatus = amount_status;
	socket.send("T#".concat(account_id));
};

function create_server(bedrock, java) {
	if (bedrock) {
		// bedrock server
		socket.send("NB#".concat(account_id, '#', account_key));
	} else if (bedrock && java) {
		// geyser server
		socket.send("NG#".concat(account_id, '#', account_key));
	} else if (java) {
		// java server
		socket.send("NJ#".concat(account_id, '#', account_key));
	} else {
		// default to bedrock
		socket.send("NB#".concat(account_id, '#', account_key));
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

function change_prop(prop_choice) {
	socket.send(`G#${prop_choice}#`.concat(account_id));
};

function panel_switch(port_check) {
	if (amountStatus[1] != '2') {
		in_spanel = true;
		const panel_heading = document.createElement("h1");
		panel_heading.innerText = "Server Panel";
		const toggle_but = document.createElement("button");
		toggle_but.setAttribute("onclick", "toggle_req()");
		toggle_but.innerText = "Toggle Server";
		const port_contents = document.createElement("p");
		let v4port = "";
		let v6port = "";
		if (port_check[1] == "1") {
			v4port = (parseInt(account_id)+11111).toString();
			port_contents.innerText = `IPv4 port: ${v4port}`;
		} else {
			if (port_check[1] == '2') {
				v4port = (parseInt(account_id)+33333).toString();
				port_contents.innerText = `IPv4 port: ${v4port}`;
			} else {
				v4port = (parseInt(account_id)+33333).toString();
				v6port = (parseInt(account_id)+33335).toString();
				port_contents.innerText = `IPv4 port: ${v4port}, bedrock port: ${v6port}`;
			};
		};
		const server_val = document.createElement("p");
		server_val.innerText = `Server status: ${received_status}`;
		server_val.id = "server_stat";
		command_input.setAttribute("class", "textinput");
		command_input.id = "input_command";
		command_input.type = "text";
		command_input.name = "commandinput";
		if (received_status == "on") {
			command_submit.setAttribute("onclick", "submit_command()");
			command_submit.innerText = "Run Command";
		} else {
			command_submit.setAttribute("onclick", "subcom_block()");
			command_submit.innerText = "Server is currently not available.";
		};
		command_submit.id = "commandsubmit";
		command_input.setAttribute("placeholder", "Command goes here ...");
		const allow_cheats = document.createElement("p");
		allow_cheats.innerText = "Toggle Cheats";
		allow_cheats.setAttribute("onclick", "change_prop('AC')");
		allow_cheats.setAttribute("class", "para_button");
		const toggle_gamemode = document.createElement("p");
		toggle_gamemode.setAttribute("onclick", "change_prop('CG')");
		toggle_gamemode.innerText = "Toggle Gamemode";
		toggle_gamemode.setAttribute("class", "para_button");
		const server_props = document.createElement("fieldset");
		server_props.id = "server_prop";
		const serverprops_title = document.createElement("legend");
		serverprops_title.innerText = "Server Properties";
		document.getElementById("server-panel").appendChild(panel_heading);
		document.getElementById("server-panel").appendChild(toggle_but);
		document.getElementById("server-panel").appendChild(port_contents);
		document.getElementById("server-panel").appendChild(server_val);
		document.getElementById("server-panel").appendChild(command_input);
		document.getElementById("server-panel").appendChild(command_submit);
		document.getElementById("server-panel").appendChild(document.createElement("br"));
		document.getElementById("server-panel").appendChild(document.createElement("br"));
		document.getElementById("server-panel").appendChild(server_props);
		document.getElementById("server_prop").appendChild(serverprops_title);
		if (port_check[1] == '1') {
			document.getElementById("server_prop").appendChild(allow_cheats);
		};
		document.getElementById("server_prop").appendChild(toggle_gamemode);
	} else {
		const view_heading = document.createElement("h1");
		view_heading.innerText = "Make a Server";
		const choice_set = document.createElement("fieldset");
		choice_set.id = "choice_set";
		const choice_heading = document.createElement("legend");
		choice_heading.innerText = "Server Choice";
		const bedrock_choice = document.createElement("p");
		bedrock_choice.setAttribute("class", "para_button");
		bedrock_choice.setAttribute("onclick", "create_server(true,false)");
		bedrock_choice.innerText = "Bedrock Server";
		const java_choice = document.createElement("p");
		java_choice.setAttribute("class", "para_button");	
		java_choice.setAttribute("onclick", "create_server(false,true)");
		java_choice.innerText = "Java Server";
		const geyser_choice = document.createElement("p");
		geyser_choice.setAttribute("class", "para_button");
		geyser_choice.setAttribute("onclick", "create_server(true,true)");
		geyser_choice.innerText = "Bedrock & Java Server";
		document.getElementById("server-panel").appendChild(view_heading);
		document.getElementById("server-panel").appendChild(choice_set);
		document.getElementById("choice_set").appendChild(choice_heading);
		document.getElementById("choice_set").appendChild(bedrock_choice);
		document.getElementById("choice_set").appendChild(java_choice);
		document.getElementById("choice_set").appendChild(geyser_choice);
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
			console.log(`account id: ${account_id}`);
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
		received_status = event.data;
		document.getElementById("server_stat").innerText = `Server status: ${received_status}`;
		if (received_status == "on") {
			command_submit.innerText = "Run Command";
			command_submit.setAttribute("onclick", "submit_command()");
		} else {
			command_submit.innerText = "Server is currently not available.";
			command_submit.setAttribute("onclick", "subcom_block()")
		};
	} else if (event.data[0] == 'A') {
		server_type(event.data);
		// panel_switch(event.data);
	} else if (event.data[0] == 'T') {
		panel_switch(event.data);
	} else {
		if (event.data == "off" || event.data == "none" || event.data == "on") {
			received_status = event.data;
		} else {
			accountent_check(event.data);
		};
	};
};

socket.onclose = () => {
	console.log('disconnected');
};
