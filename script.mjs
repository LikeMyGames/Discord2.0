//need to make peer js import compatible with html and browsers
//import {Peer} from "./node_modules/peerjs/dist/peerjs.min.js";
//import { Peer } from "peerjs";
import {Peer} from "https://esm.sh/peerjs@1.5.2?bundle-deps"
var user = {};
openLogin();
var activeMessageThread = false;
console.log(gmtISOToLocal(new Date().toISOString()));
console.log(gmtToLocal(new Date().toISOString().substring(28, 31)));
var messageThreadMessages = [];
var peer;
var conn;

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

function gmtISOToLocal(time){
	let localTime = new Date().toString().substring(28,31);
	let gmtTime = time.substring(11, 16);
	localTime = parseInt(gmtTime) + parseInt(localTime);
	localTime += gmtTime.substring(2);
	return localTime;
}

function gmtToLocal(time){
	let localTime = new Date().toString().substring(28, 31);
	localTime = parseInt(time.toString()) + parseInt(localTime.toString());
	localTime += time.substring(2,5);
	return localTime;
}

export async function switchToCreateAccount(){
	let createAccountBox = document.querySelector("#createAccountBox");
	let loginBox = document.querySelector("#loginBox");
	createAccountBox.style.display = "block";
	console.log(createAccountBox.style.display);
	loginBox.style.display = "hidden";
	console.log(loginBox.style.display);
}

export function switchToLogin(){
	let createAccountBox = document.querySelector(".createAccountBox");
	let loginBox = document.querySelector(".loginBox");
	createAccountBox.style.display = "hidden";
	console.log(createAccountBox.style.display);
	loginBox.style.display = "block";
	console.log(loginBox.style.display);
}

export async function openLogin(){
	let main = document.querySelector(".main");
	let login = document.querySelector(".login");
	main.style.display = "none";
	login.style.display = "block";
}

export async function openSettings(){
	let main = document.querySelector(".main");
	let settings = document.querySelector(".settings");
	main.style.display = "none";
	settings.style.display = "block";
}

export async function useWithoutAccount(){

}


//need to fix peer js import into file
export async function login(){
	let username = document.querySelector("#userNameInput").value;
	let pass = document.querySelector("#passwordInput").value;
	if(!(username === "" || pass === "")){
		fetch(`./users/${username}.json`)
			.then(res => {
				if(!res.ok){
					throw new Error();
				}
				return res.json();
			})
			.then(data => {
				if(data.password !== pass){
					alert("Please input correct password.")
				}
				else{
					user = {"userName": data.userName, "pfp": data.pfp, "id": data.id};
					console.log("user = " + user.userName);
					console.log(user.password);
					console.log(user.id);
					peer = new Peer(user.id);
					peer.on('open', (id) => {
						console.log(id);
					});
					var conn;
					peer.on('connection', (connection) => {
						conn = connection;
						openConnection();
					})
					let main = document.querySelector(".main");
					let login = document.querySelector(".login");
					let accountInfoUsername = document.querySelector("#accountInfoUser");
					main.style.display = "block";
					login.style.display = "none";
					accountInfoUsername.textContent = user.userName;
					return user;
				}
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

function openConnection(){
	conn.on('open', () => {
		conn.on('data', (data) => {
			sendMessage()
		});
	});
}

function logMessage(data){
	textInput.value += data.name.toString() + ": " + data.message.toString();
}

export async function logout(){
	user = {};
	let settings = document.querySelector(".settings");
	let login = document.querySelector(".login");
	settings.style.display = "none";
	login.style.display = "block";
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

export async function createAccount(){
	let username = document.querySelector("#userNameInput").value;
	let pass = document.querySelector("#passwordInput").value;
	if(!(username === "" || pass === "")){
		if(!(username.includes("<") || username.includes(">") || username.includes(":") || username.includes("\"") || username.includes("/") || username.includes("\\") || username.includes("|") || username.includes("?") || username.includes("*")) && !(pass.includes("<") || pass.includes(">") || pass.includes(":") || pass.includes("\"") || pass.includes("/") || pass.includes("\\") || pass.includes("|") || pass.includes("?") || pass.includes("*"))){
			fetch(`./users/${username}.json`, {method: "HEAD"})
				.then(res => {
					if(!res.ok){
						fetch(`./users/${username}`, {method: "PUT"})
							.then(res => {
								console.log(res);
							})
					}	
				})
				.catch(error => {
					console.warn(error);
					alert("An account with this username already exists. Please choose a different username");
				});
		}
		else{
			alert("The username and/or password that you entered used one the following: < > : \" / \\ | ? *. The username and password that you enter are not allowed to contain the previous characters.")
		}
	}
	else{
		alert("Please enter a username and password to create an account with");
	}
}

export async function sendMessage(){
	let input = messageInput.value;
	let messageThread = document.querySelector(".MessageThread");
	let date =  new Date().toUTCString().substring(0,17);
	let time =  new Date().toUTCString();
	//need to fix problem with 24 hour roll over
	time = time.substring(17);
	messageThread.appendChild(createMessage(user.userName, user.pfp, date, time, input));
	messageInput.value = "";
	saveToJson();
}

export async function sendPeerMessage(date, time, input){
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

module.export = async function hoverServerButton(id){
	console.log("hovering");
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
	
export async function unHoverServerButton(id){
	console.log("unhovering");
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

export async function openDmThread(id){
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

export async function openDMs(){
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


