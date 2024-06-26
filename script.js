//need to make peer js import compatible with html and browsers
//import {Peer} from "./node_modules/peerjs/dist/peerjs.min.js";
//import { Peer } from "peerjs";
//import {Peer} from "https://esm.sh/peerjs@1.5.2?bundle-deps"
console.log(document.head.innerHTML);
/*
if(localStorage.getItem("user") != null && localStorage.getItem("pass") != null){
	let userInput = document.querySelector("#userNameInput");
	let passInput = document.querySelector("#passwordInput");
	userInput.value = localStorage.getItem("user");
	passInput.value = localStorage.getItem("pass");
	login();
}
*/
if(localStorage.getItem("theme") != null)
	changeTheme(localStorage.getItem("theme"));
if(localStorage.getItem("customThemes") == null){
	localStorage.setItem("customThemes", []);
}
var user = {};
openWelcome();
var activeMessageThread = false;
var messageThreadMessages = [];
var peer;
var conn;
var call;
var inputMute = false;
var outputMute = false;
var fullscreened = false;
var displayMode = "normal";
var mode = "normal";
var curPeer = {};
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.moxGetUserMedia;


// navigator.mediaDevices.getUserMedia(constraints)
// 	.then(function(stream) {
// 	mediaStream = stream;
// 	})
// 	.catch(function(err) {
// 		/* Handle the error */
// 		alert(err);
// 	});


// var mediaStream = navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream) => {

// });

const messageInput = document.querySelector("#MessageInputText");
messageInput.addEventListener("keydown", (e) => {
	if(e.code === "Enter"){
		e.preventDefault();
		if(activeMessageThread){
			sendMessage();
		}
	}
});

const passwordInput = document.querySelector("#passwordInput");
passwordInput.addEventListener("keydown", (e) => {
	if(e.code === "Enter"){
		e.preventDefault();
		login();
	}
});

const userNameInput = document.querySelector("#userNameInput");
userNameInput.addEventListener("keydown", (e) => {
	if(e.code === "Enter"){
		e.preventDefault();
		passwordInput.focus();
	}
});

const createAccountPassInput = document.querySelector("#createAccountPassword");
createAccountPassInput.addEventListener("keydown", (e) => {
	if(e.code === "Enter"){
		e.preventDefault();
		createAccount();
	}
});

const createAccountUserInput = document.querySelector("#createAccountUsername");
createAccountUserInput.addEventListener("keydown", (e) => {
	if(e.code === "Enter"){
		e.preventDefault();
		createAccountPassInput.focus();
	}
});

function toggleFullscreen(){
	if(fullscreened){
		closeFullscreen();
	}
	else{
		openFullscreen();
	}
	fullscreened = !fullscreened;
}

// Function to open fullscreen
function openFullscreen() {
	let elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        // Safari
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        // IE11
        elem.msRequestFullscreen();
    }
}

// Function to close fullscreen
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        // Safari
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        // IE11
        document.msExitFullscreen();
    }
}

function gmtISOToLocal(time){
	let localTime = new Date().toString().substring(28,31);
	let gmtTime = time.substring(11, 16);
	localTime = parseInt(gmtTime) + parseInt(localTime);
	localTime += gmtTime.substring(2);
	return localTime;
}

function gmtToLocal(time){
	let localTime = new Date().toString().substring(28, 31);
	console.log(localTime)
	localTime = parseInt(time.toString()) + parseInt(localTime.toString());
	console.log(localTime)
	if(localTime < 0){
		localTime = 24 + localTime;
	}
	localTime += time.substring(2,5);
	console.log(localTime)
	return localTime;
}

async function switchToCreateAccount(){
	let createAccountBox = document.querySelector("#createAccount");
	let loginBox = document.querySelector("#login");
	createAccountBox.style.zIndex = "1";
	loginBox.style.zIndex = "-1";
}

function switchToLogin(){
	let createAccountBox = document.querySelector("#createAccount");
	let loginBox = document.querySelector("#login");
	loginBox.style.zIndex = "1";
	createAccountBox.style.zIndex = "-1";
}

async function openWelcome(){
	let welcome = document.querySelector(".welcome");
	let createAccount = document.querySelector("#createAccount");
	let login = document.querySelector("#login");
	let main = document.querySelector(".main");
	let settings = document.querySelector(".settings");
	login.style.zIndex = "0";
	createAccount.style.zIndex = "0";
	main.style.zIndex = "-2",
	welcome.style.zIndex = "1";
	settings.style.zIndex = "-1";
}

async function openLogin(){
	let main = document.querySelector(".main");
	let login = document.querySelector("#login");
	let welcome = document.querySelector(".welcome");
	welcome.style.zIndex = "-1";
	main.style.zIndex = "-1";
	login.style.zIndex = "1";
	switchToLogin();
}

async function openCreateAccount(){
	openLogin();
	switchToCreateAccount();
}

async function openSettings(){
	let main = document.querySelector(".main");
	let settings = document.querySelector(".settings");
	main.style.zIndex = "-1";
	settings.style.zIndex = "1";
	let firstSettingsButton = document.querySelector(".myAccountSettingsButton");
	changeSettingsContent("myAccount");
}

async function closeSettings(){
	let main = document.querySelector(".main");
	let settings = document.querySelector(".settings");
	main.style.zIndex = "1";
	settings.style.zIndex = "-2";
}

async function useWithoutAccount(){
	let id = generateRandHex(4);
	peer = new Peer(id, {debug: 2})
	peer.on('open', (id) => {
		alert("peer created with an id of " + id);
	})
	peer.on('connection', (connection) => {
		conn = connection;
		openConnection();
		console.log(id + " recieving peer connection")
	})
	peer.on('call', function(call) {
		getUserMedia({video: true, audio: true}, function(stream) {
    		call.answer(stream); // Answer the call with an A/V stream.
    		call.on('stream', function(remoteStream) {
				openCall();
    		});
			}, function(err) {
				console.log('Failed to get local stream' ,err);
		});
	});
	user = {userName: `Untitled (ID: ${id})`, pfp: './images/dmIcon.png', id: id}
	let welcome = document.querySelector(".welcome");
	let main = document.querySelector(".main");
	welcome.style.zIndex = "-1";
	main.style.zIndex = "1";
	mode = "noAccount";
	let accountInfoUsername = document.querySelector("#accountInfoUser");
	let accountInfoID = document.querySelector("#accountInfoID");
	accountInfoUsername.textContent = user.userName;
	accountInfoID.textContent = user.id;
	addAddDmChatButton();
}

async function addAddDmChatButton(){
	let mainWindow = document.querySelector(".container");
	mainWindow.appendChild(elementFromHTML(`
	<div class="addDmButtonBox">
		<button class="addDMButton" onclick="addDMChat()">
			<span class="material-symbols-rounded">add</span>
		</button>
	</div>
	`))
}

async function addDMChat(){
	let body = document.querySelector("body")
	body.appendChild(elementFromHTML(`
		<div id="addDmWindow" class="addDMWindow" >
			<div class="addDMBox" >
				<div style="display: flex; justify-content: center; align-items: center;">
					<label id="idInput" style="color: white;" for="idInput">ID: </label>
					<input id="idInput" type="text" name="idInput" autocomplete="off">
				</div>
				<div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
					<button id="idInput" onclick="
					let idinput = document.querySelector('input#idInput');
					idinput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', which: 13, keyCode: 13}));" >Enter</button>
					<button id="idInput" onclick="document.querySelector('.addDMWindow').remove()" >Back</button>
				</div>
			</div>
		</div>
	`))
	let idInput = document.querySelector("input#idInput")
	idInput.addEventListener("keydown", (e) => {
		if(e.code === "Enter"){
			e.preventDefault();
			console.log(idInput.value);
			let input = idInput.value;
			let messageList = document.querySelector(".MessageList");
			let addDmWindow = document.querySelector("#addDmWindow");
			addDmWindow.remove();
			if(messageList.querySelector(`#DM${input}`) == null){
				messageList.appendChild(elementFromHTML(`
				<button class="DmThread" id="DM${input}" onclick="openDmFromID('${input}')">
					<img src="./images/dmIcon.png" class="DmPFP">
					<h2 class="DmUserName">${input}</h2>
				</button>
				`))
			}
		}
	})
}

async function openDmFromID(id){
	console.log(id + " in openDmFromID()")
	conn = peer.connect(`${id}`);
	curPeer.id = id;
	openConnection();
	console.log("sending id");
}

function openConnection(){
	console.log(conn.label + " in openConnection()");
    conn.on('open', function(){
		console.log("opening connection")
        conn.on('data', function(data){
			if(data.setup != undefined){
				addDMChat()
				let idinput = document.querySelector("input#idInput");
				idinput.value = `${data.id}`;
				idinput.dispatchEvent(new KeyboardEvent("keydown", { key: 'Enter', code: 'Enter', which: 13, keyCode: 13}));
				document.querySelector(`button.DmThread#DM${data.id} h2`).textContent = data.username;
				let messageThreadTitle = document.querySelector(".messageThreadTitle")
				messageThreadTitle.innerHTML = `
					<img class="topBarImage" src="./images/dmIcon.png" >
					<h3 class="topBarUserName" >${data.username}</h3>
				`;
				let messageInput = document.querySelector('input.MessageThreadTextInput');
				messageInput.placeholder = `Message @${data.username}`
				return;
			}
			if(curPeer.username != data.username){
				document.querySelector(`button.DmThread#DM${data.id} h2`).textContent = data.username;
			}
            showMessage(document.querySelector(".MessageThread"), data.userName, data.pfp, data.date, data.time, data.message);
        });
		conn.send({
			setup: true,
			id: user.id,
			username: user.userName
		})
		activeMessageThread = true;
    });
}	

//need to fix peer js import into file
async function login(){
	let username = document.querySelector("#userNameInput").value;
	let password = document.querySelector("#passwordInput").value;
	localStorage.setItem("user", username);
	localStorage.setItem("pass", password);
	if(!(username === "" || password === "")){
		fetch(`https://datcord-api.onrender.com/user/${username}/${password}`)
			.then(res => {
				if(!res.ok){
					throw new Error();
				}
				return res.json();
			})
			.then(data => {
				console.log(data);
				user = {userName: data.username, password: data.password, pfp: data.pfp, id: data.peerID}
				peer = new Peer(user.id, {debug: 3})
				peer.on('open', (id) => {
					alert("peer created with an id of " + id);
				})
				peer.on('connection', (connection) => {
					conn = connection;
					openConnection();
					console.log(id + " recieving peer connection")
				})
				peer.on('call', function(call) {
					getUserMedia({video: true, audio: true}, function(stream) {
    					call.answer(stream); // Answer the call with an A/V stream.
    					call.on('stream', function(remoteStream) {
							openCall();
    					});
						}, function(err) {
							console.log('Failed to get local stream' ,err);
					});
				});
				let welcome = document.querySelector(".welcome");
				let main = document.querySelector(".main");
				welcome.style.zIndex = "-1";
				main.style.zIndex = "1";
				mode = "noAccount";
				let accountInfoUsername = document.querySelector("#accountInfoUser");
				let accountInfoID = document.querySelector("#accountInfoID");
				accountInfoUsername.textContent = user.userName;
				accountInfoID.textContent = user.id;
				addAddDmChatButton();
			})
			.catch(error => {
				console.error(error);
				alert("The username or password that you entered is not correct. Please input a correct username and password.");
			});
	}
	else{
		alert("Please enter a username and password to login with");
	}
}

function connect(id){
	conn = peer.connect(id.toString());
	openConnection();
}

function logMessage(data){
	textInput.value += data.name.toString() + ": " + data.message.toString();
}

async function logout(){
	user = {};
	openWelcome();
	let username = document.querySelector("#userNameInput");
	let pass = document.querySelector("#passwordInput");
	username.value = "";
	pass.value = "";
	let servers = document.querySelector(".customServerList");
	while(servers.hasChildNodes()){
		servers.removeChild(servers.firstChild);
	}
	let messageThreads = document.querySelector(".MessageList");
	while(messageThreads.hasChildNodes()){
		messageThreads.removeChild(messageThreads.firstChild);
	}
	let messages = document.querySelector(".MessageThread");
	while(messages.hasChildNodes()){
		messages.removeChild(messages.firstChild);
	}
}

async function toggleInputMute(){
	let inputIcon = document.querySelector("#toggleInputMuteIcon");
	if(inputMute){
		inputIcon.innerHTML = "mic";
		inputMute = !inputMute;
	}
	else{
		inputIcon.innerHTML = "mic_off";
		inputMute = !inputMute;
	}
}

async function toggleOutputMute(){
	let outputIcon = document.querySelector("#toggleOutputMuteIcon");
	if(outputMute){
		outputIcon.innerHTML = "headset_mic";
		outputMute = !outputMute;
	}
	else{
		outputIcon.innerHTML = "headset_off";
		outputMute = !outputMute;
	}
}

async function createAccount(){
	let username = document.querySelector("#createAccountUsername").value;
	let password = document.querySelector("#createAccountPassword").value;
	if(!(username === "" || password === "")){
		if(!(username.includes("-") || username.includes("_"))){
			fetch(`https://datcord-api.onrender.com/user/${username}/${password}`, {method: 'POST'})
				.then(res => {
					if(!res.ok)
						throw new Error();
					return res.json();
				})
				.then(data => {
					console.log(data);
					user = {userName: data.username, password: data.password, pfp: data.pfp, id: data.peerID}
					peer = new Peer(user.id, {debug: 3})
					peer.on('open', (id) => {
						alert("peer created with an id of " + id);
					})
					peer.on('connection', (connection) => {
						conn = connection;
						openConnection();
						console.log(id + " recieving peer connection")
					})
					peer.on('call', function(call) {
						getUserMedia({video: true, audio: true}, function(stream) {
    						call.answer(stream); // Answer the call with an A/V stream.
    						call.on('stream', function(remoteStream) {
								openCall();
    						});
							}, function(err) {
								console.log('Failed to get local stream' ,err);
						});
					});
					let welcome = document.querySelector(".welcome");
					let main = document.querySelector(".main");
					welcome.style.zIndex = "-1";
					main.style.zIndex = "1";
					mode = "noAccount";
					let accountInfoUsername = document.querySelector("#accountInfoUser");
					let accountInfoID = document.querySelector("#accountInfoID");
					accountInfoUsername.textContent = user.userName;
					accountInfoID.textContent = user.id;
					addAddDmChatButton();
				})
				.catch(err => {
					console.error("Account already exists or it can't be created", err);
				})
		}
		else{
			alert("The username that you entered used one the following: - _ The username that you enter is not allowed to contain the previous characters.")
		}
	}
	else{
		alert("Please enter a username and password to create an account with");
	}
}

function generateRandHex(size){
	let result = [];
	let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
	for (let n = 0; n < size; n++) {
		result.push(hexRef[Math.floor(Math.random() * 16)]);
	}
	return result.join('');
}

function notify(msg) {
    let notification = document.getElementById("notification")
    notification.innerHTML = msg
    notification.hidden = false
    setTimeout(() => {
        notification.hidden = true;
    }, 3000)
}

async function sendMessage(){
	let messageThread = document.querySelector(".MessageThread");
	let input = messageInput.value;
	let date =  new Date().toUTCString().substring(0,17);
	let time =  new Date().toUTCString();
	//need to fix problem with 24 hour roll over
	time = time.substring(17);
	conn.send({
		userName: user.userName,
		pfp: user.pfp,
		date: date,
		time: time,
		message: input
	});
	messageInput.value = "";
	messageInput.blur();
	showMessage(messageThread, user.userName, user.pfp, date, time, input);
}

async function showMessage(messageThread, userName, pfp, date, time, input){
	messageThread.appendChild(createMessage(userName, pfp, date, time, input));
}

async function startCall(mode){
	if(conn == null || undefined){
		alert('cannot start audio or video call without an active chat')
		return;
	}

	getUserMedia({video: true, audio: true}, function(stream) {
		var call = peer.call('2', stream);
		call.on('stream', function(remoteStream) {
			openCall();
		});
		  }, function(err) {
			console.log('Failed to get local stream' ,err);
	});

	// alert(conn.peer);
	// alert('trying to start call')
	// call = peer.call(conn.peer, navigator.mediaDevices.getUserMedia({audio: true, video: true}));
	// console.log(call)
	// openCall();
}

async function openCall(){
	alert('opening call')
	let body = document.querySelector('body');
	console.log(body)
	body.appendChild(elementFromHTML(`
	<video class="stream" style="position: absolute; left: 0px; top: 0px; height: 50vh; width: 50vw;" autoplay>
	</video>`
	));
	let video = document.querySelector('video.stream');
	video.srcObject = remoteStream;
}

async function sendPeerMessage(date, time, input){
	conn.send({
		userName: user.userName,
		pfp: user.pfp,
		date: date,
		time: time,
		body: input
	});
}

async function saveToJson(){
	console.log(messageThreadMessages);
}

async function hoverServerButton(id){
	var element = document.getElementById(id + "Notification");
	if(element.className === "unSeenMessage"){
		element.className = "unSeenMessageHovered";
	} else {
		element.className = "SeenMessageHovered";
	}
	
	//element.style.setProperty("content", "url(images/unseenMessageHovered.png)");
	//element.style.marginTop = "20px";
	//element.style.height = "24px";
}
	
// Function to download data to a file
function download(data, filename, type) {
	var file = new Blob([data], {type: type});
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}
	alert(file);
}
	
async function unHoverServerButton(id){
	var element = document.getElementById(id + "Notification");
	if(element.className === "unSeenMessageHovered"){
		element.className = "unSeenMessage";
	} else {
		element.className = "SeenMessage";
	}
	//element.style.setProperty("content", "url(images/unseenMessage.png)");
	//element.style.marginTop = "27.5px";
	//element.style.height = "8px";
}

async function loadDmThread(data, index){
    let messageThread = document.querySelector(".MessageThread");
    messageThread.innerHTML = '';
    console.log(data.DMs[index]);
    for(let i = 0; i<data.DMs[index].messages.length; i++){
    	let message = data.DMs[index].messages[i];
    	messageThread.appendChild(createMessage(message.userName, message.pfp, message.date, message.time, message.body));
    }
	activeMessageThread = true;
}

async function openDmThread(id){
	if(mode === "noAccount"){
		return;
	}
    let index = id.substring(2);
    fetch(`./users/${user.userName}.json`)
		.then(res => {
			if(!res.ok){
				throw new Error("user file does not exist");
			}
			return res.json();
		})
		.then(data => {
            loadDmThread(data, index);
        })
		.catch(error => console.error(error));
}

async function loadDMs(data){
	if(mode === "noAccount"){
		return;
	}
    let messageList = document.querySelector(".MessageList");
    //console.log(data.DMs.length);
    for(let i = 0; i<data.DMs.length; i++){
        let dm = data.DMs[i];
        messageList.appendChild(elementFromHTML(`
			<button class="DmThread" id="DM${i}" onclick="openDmThread(this.id)">
                <img src="${dm.pfp}" class="DmPFP">
				<h2 class="DmUserName">${dm.userName}</h2>
			</button>
		`));
    }
};

async function openDMs(){
	if(mode === "noAccount"){
		return;
	}
    let messageList = document.querySelector(".MessageList");
    messageList.innerHTML = '';
	fetch(`./users/${user.userName}.json`)
		.then(res => {
			if(!res.ok){
				throw new Error("user file does not exist");
			}
			return res.json();
		})
		.then(data => loadDMs(data))
		.catch(error => console.error(error));
}

async function changeSettingsContent(id){
	let settingsContent = document.querySelector(".mainSettingsContent");
	console.log(id);
	id = id.toString();
	switch(id){
		case "myAccount":
			settingsContent.innerHTML = `
			<h1 style="margin-top: 0px;">My Account</h1>
			<div class="accountInfoViewer">
				<div class="accountInfoViewerColorBar">
				</div>
				<div class="AccountInfo">
					<div class="genericInfoBar">
						<img class="pfp" src="./images/dmIcon.png">
						<div style="display: flex; flex-direction: column; align-item: center; justify-content: center;">
							<h2>
								UserName
							</h2>
							<br>
							<h2>
								ID: ${user.id}
							</h2>
						</div>
					</div>
				</div>
			</div>
			`;
			break;
		case "profile":
			settingsContent.innerHTML = `
			<h1 style="margin-top: 0px;">Profile</h1>
			`;
			break;
		case "appearance":
			settingsContent.innerHTML = `
			<h1 style="margin-top: 0px;">Appearance</h1>
			<br>
			<h2>Preview</h2>
			<div class="settingsAppearancePreview">
				
			</div>
			<br>
			<br>
			<h2 class="settingsContentGroupTitle">THEME</h2>
			<div class="themes">
				<div>
					<button id="light" class="themeOption lightMode" onclick="changeTheme(this.id)" title="Light">
						<span id="lightModeIcon" class="material-symbols-rounded">light_mode</span>
					</button>
				</div>
				<div>
					<button id="dark" class="themeOption darkMode selectedColorTheme" onclick="changeTheme(this.id)" title="Dark">
						<span id="darkModeIcon" class="material-symbols-rounded">
							dark_mode
						</span>
					</button>
				</div>
				<div>
					<button id="add" class="themeOption darkMode" onclick="openThemeColorPicker()" title="Add Theme">
						<span id="darkModeIcon" class="material-symbols-rounded">add</span>
					</button>
				</div>
			</div>
			<div class="customTheme">

			</div>
			<br>
			<br>
			<h2 class="settingsContentGroupSubTitle">Color</h2>
			<h3>Coming soon hopefully</h3>
			<hr class="settingsContentGroupSeperator">
			<h2 class="settingsContentGroupSubTitle">In-app Icon</h2>
			<h3>Coming soon hopefully</h3>
			<br>
			<hr class="settingsContentGroupSeperator">
			<br>
			<h2 class="settingsContentGroupTitle">MESSAGE DISPLAY</h2>
			<h3>This doesn't work yet, but it looks cool  (I really hope that I can get this to work)</h3>
			<button id="normal" class="messageMode" onclick="switchMessageDisplayType(this.id)">
				<span class="material-symbols-outlined" id="messageModeSelectorIcon">radio_button_checked</span>
				<h2 class="messageModeSelectorText">Cozy: Modern, beautiful, and easy on you eyes (for the most part).</h2>
			</button>
			<button id="compact" class="messageMode"  onclick="switchMessageDisplayType(this.id)">
				<span class="material-symbols-outlined" id="messageModeSelectorIcon">radio_button_unchecked</span>
				<h2 class="messageModeSelectorText">Compact: Fit more messages on screen at one time.  #IRC</h2>
			</button>
			<hr class="settingsContentGroupSeperator">
			`;
			let preview = document.querySelector(".settingsAppearancePreview");
			showPreviewMessage(preview, user.userName, user.pfp, "1/1/2024", new Date().toUTCString().substring(17), "this is a test this is a test this is a test this is a test this is a test this is a test this is a test this is a test this is a test this is a test this is a test");
			showPreviewMessage(preview, user.userName, user.pfp, "1/1/2024", new Date().toUTCString().substring(17), "this is a test this is a test this is a test this is a test this is a test this is a test this is a test this is a test this is a test this is a test this is a test");
			showPreviewMessage(preview, user.userName, user.pfp, "1/1/2024", new Date().toUTCString().substring(17), "this is a test this is a test this is a test this is a test this is a test this is a test this is a test this is a test this is a test this is a test this is a test");
			changeTheme(localStorage.getItem("theme"));
			break;
		case "accessibility":
			settingsContent.innerHTML = `
			<h1 style="margin-top: 0px;">Accessibility</h1>
			`;
			break;
		case "voice&video":
			settingsContent.innerHTML = `
			<h1 style="margin-top: 0px;">Voice & Video</h1>
			`;
			break;
		case "chat":
			settingsContent.innerHTML = `
			<h1 style="margin-top: 0px;">Chat</h1>
			`;
			break;
		case "keybinds":
			settingsContent.innerHTML = `
			<h1 style="margin-top: 0px;">Keybinds</h1>
			`;
			break;
		case "language":
			settingsContent.innerHTML = `
			<h1 style="margin-top: 0px;">Language</h1>
			`;
			break;
		case "advanced":
			settingsContent.innerHTML = `
			<h1 style="margin-top: 0px;">Advanced</h1>
			`;
			break;
		default:
			settingsContent.innerHTML = `
			<h1 style="margin-top: 0px;">This Should Not Be Here</h1>
			`;
			break;
	}
}

function switchMessageDisplayType(id){
	if(id === "normal"){
		if(displayMode === "normal"){
			console.log("display mode is already on normal");
		}
		else{
			console.log("switching to normal display mode");
			let normalDisplayIcon = document.querySelector("button#normal.messageMode span");
			normalDisplayIcon.innerHTML = "radio_button_checked";
			let compactDisplayIcon = document.querySelector("button#compact.messageMode span");
			compactDisplayIcon.innerHTML = "radio_button_unchecked";
			displayMode = "normal";
		}
	}
	else if(id === "compact"){
		if(displayMode === "compact"){
			console.log("display mode is already on compact");
		}
		else{
			console.log("switching to compact display mode");
			let normalDisplayIcon = document.querySelector("button#normal.messageMode span");
			normalDisplayIcon.innerHTML = "radio_button_unchecked";
			let compactDisplayIcon = document.querySelector("button#compact.messageMode span");
			compactDisplayIcon.innerHTML = "radio_button_checked";
			displayMode = "compact";
		}
	}
}

async function changeTheme(id){
	if(id == null){
		return;
	}
	let root = document.documentElement;
	let elem = document.querySelector(`#${id}`);
	console.log(id);
	switch(id){
		case "light":
			root.style.setProperty("--dark-color", "#CACACAFF");
			root.style.setProperty("--darkLight-color", "#F5F5F5FF");
			root.style.setProperty("--light-color", "white");
			root.style.setProperty("--lightLight-color", "lightgrey");
			root.style.setProperty("--text-color", "black");
			for (let elem of document.getElementsByClassName('selectedColorTheme')) {
				elem.classList.remove('selectedColorTheme');
			}
			elem.classList.add("selectedColorTheme");
			localStorage.setItem("theme", "light");
			return;
		case "dark":
			root.style.setProperty("--dark-color", "#1f2022ff");
			root.style.setProperty("--darkLight-color", "#2b2d31ff");
			root.style.setProperty("--light-color", "#303338ff");
			root.style.setProperty("--lightLight-color", "#383a40ff");
			root.style.setProperty("--text-color", "white");
			for (let elem of document.getElementsByClassName('selectedColorTheme')) {
			    elem.classList.remove('selectedColorTheme');
			}
			elem.classList.add("selectedColorTheme");
			localStorage.setItem("theme", "dark");
			return;
		default:
			let customThemes = localStorage.getItem("customThemes");
			console.log(customThemes)
			changeTheme("dark");
			return;
	}
}

function createMessage(user, pfp, date, time, body){
	messageThreadMessages.push({"userName": user, "pfp": pfp, "date": date, "time": time, "body": body});
	time = gmtToLocal(time);
	return elementFromHTML(`
		<div class="message">
			<img class="messagePFP" id="message1PFP" style="content: url('images/dmIcon.png');">
			<div style="display: flex; flex-direction: column; padding-left: 10px; ">
				<div style="display: flex; overflow: hidden;">
					<h2 class="messageUsername" id="message1Username">${user}</h2>
					<h3 class="messageDate" id="message1Date">${date}</h3>
					<h3 class="messageTime" id="message1Time">${time}</h3>
				</div>
				<p class="messageText">${body}</p>
			</div>
		</div>
	`);
	/*
	return elementFromHTML(`
		<div class="message">
			<table>
				<tbody>
					<tr>
						<td style="vertical-align: top;">
							<img class="messagePFP" id="message1PFP" style="content: url('images/dmIcon.png');">
						</td>
						<td>
							<div style="vertical-align: top; overflow: auto; padding-left: 10px; ">
								<div style="display: inline-block; overflow: hidden;">
									<h2 class="messageUsername" id="message1Username">${user}</h2>
									<h3 class="messageDate" id="message1Date">${date}</h3>
									<h3 class="messageTime" id="message1Time">${time}</h3>
								</div>
								<p>${body}</p>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	`);
	*/
}

function createPreviewMessage(user, pfp, date, time, body){
	time = gmtToLocal(time);
	return elementFromHTML(`
		<div class="message">
			<img class="messagePFP" id="message1PFP" style="content: url('images/dmIcon.png');">
			<div style="display: flex; flex-direction: column; padding-left: 10px; ">
				<div style="display: flex; overflow: hidden;">
					<h2 class="messageUsername" id="message1Username">${user}</h2>
					<h3 class="messageDate" id="message1Date">${date}</h3>
					<h3 class="messageTime" id="message1Time">${time}</h3>
				</div>
				<p class="messageText">${body}</p>
			</div>
		</div>
	`);
}

function showPreviewMessage(previewDisplay, user, pfp, date, time, body){
	previewDisplay.append(createPreviewMessage(user, pfp, date, time, body));
}

async function addCustomTheme(){
	let dark = document.querySelector(".colorPicker#darkPicker").value;
	let darkLight = document.querySelector(".colorPicker#darkPicker").value;
	let light = document.querySelector(".colorPicker#darkPicker").value;
	let lightLight = document.querySelector(".colorPicker#darkPicker").value;
	let text = document.querySelector(".colorPicker#textPicker").value;
	let title = document.querySelector(".editThemeTitleText#themeTitle").value;
	let colorPickers = document.querySelector(".editTheme");
	console.log("adding " + title)
	let themes = document.querySelector(".customTheme");
	themes.append(elementFromHTML(`
		<button id="dark" class="themeOption darkMode customTheme selectedColorTheme" onclick="changeTheme(this.id)" title="${title}">
			<span id="customThemeIcon" class="material-symbols-rounded icon">
				dark_mode
				<span id="before" class="material-symbols-rounded" onclick="console.log(id)">more_horiz</span> 
			</span>
		</button>
	`));
	localStorage.getItem("customThemes").push({});
	colorPickers.remove();
}

async function openThemeColorPicker(){
	let body = document.querySelector("body");
	body.append(elementFromHTML(`
		<div class="editTheme">
			<div class="editThemeBox">
				<div class="editThemeTitle">
					<input type="text" class="editThemeTitleText" id="themeTitle" value="Untitled">
				</div>
				<button class="editThemeSaveButton" onclick="addCustomTheme()">
					<h2 class="editThemeSaveButtonText">
						Save
					</h2>
				</button>
				<input class="colorPicker" type="color" value="#1f2022" id="darkPicker">
				<input class="colorPicker" type="color" value="#2b2d31" id="darkLightPicker">
				<input class="colorPicker" type="color" value="#303338" id="lightPicker">
				<input class="colorPicker" type="color" value="#383a40" id="lightLightPicker">
				<h2 style="grid-row: 2 / 3; grid-column: 1 / 2; justify-self: center; align-self: flex-start; margin-top: 210px; font-size: 30px;">Darkest</h2>
				<h2 style="grid-row: 2 / 3; grid-column: 2 / 3; justify-self: center; align-self: flex-start; margin-top: 210px; font-size: 30px;">Dark</h2>
				<h2 style="grid-row: 2 / 3; grid-column: 3 / 4; justify-self: center; align-self: flex-start; margin-top: 210px; font-size: 30px;">Light</h2>
				<h2 style="grid-row: 2 / 3; grid-column: 4 / 5; justify-self: center; align-self: flex-start; margin-top: 210px; font-size: 30px;">Lightest</h2>
				<input class="colorPicker" type="color" value="#ffffff" id="textPicker">
				<h2 style="grid-row: 2 / 3; grid-column: 1 / 2; justify-self: center; align-self: flex-end;  margin-bottom: 5px; font-size: 30px;">Text Color</h2>
			</div>
		</div>
	`));
}

function elementFromHTML(html){
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}

class User{
	constructor(user, pass, peerId){
		this.user = user;
		this.pass = pass;
        this.peerId = peerId;
	}

	checkPass(pass){
		return pass === this.pass;
	}

	getUser(){
		return this.user;
	}

	setNewPass(oldPass, newPass){
		if(oldpass === this.pass){
			this.pass = newPass;
		}
		return;
	}
}