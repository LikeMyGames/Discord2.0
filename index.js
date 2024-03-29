var user = null;
if(user === null){
	openLogin();
}
var activeMessageThread = false;
console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
var localTime = new Date().toString().substring(28,31);
var gmtTime = new Date().toISOString().substring(11, 16);
console.log(gmtTime);
localTime = parseInt(gmtTime) + parseInt(localTime);
localTime += gmtTime.substring(2);
console.log(localTime);

console.log(gmtToLocal(new Date().toISOString()));

const messageInput = document.querySelector("#MessageInputText");
messageInput.addEventListener("keydown", (e) => {
	if(e.code === "Enter"){
		e.preventDefault();
		if(activeMessageThread){
			sendMessage();
		}
	}
});

async function gmtISOToLocal(time){
	let localTime = new Date().toString().substring(28,31);
	let gmtTime = time.substring(11, 16);
	localTime = parseInt(gmtTime) + parseInt(localTime);
	localTime += gmtTime.substring(2);
	return localTime;
}

async function gmtToLocal(time){
	let localTime = new Date().toString().substring(28,31);
	localTime = parseInt(gmtTime) + parseInt(localTime);
	localTime += gmtTime.substring(2);
	return localTime;
}

async function openLogin(){
	let main = document.querySelector(".main");
	let login = document.querySelector(".login");
	main.style.display = "none";
	login.style.display = "block";
}

async function openSettings(){
	let main = document.querySelector(".main");
	let settings = document.querySelector(".settings");
	main.style.display = "none";
	settings.style.display = "block";
}

async function login(){
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
				console.log(data.password);
				if(data.password === pass){
					user = username;
				}
				console.log("user = " + user);
				let main = document.querySelector(".main");
				let login = document.querySelector(".login");
				let accountInfoUsername = document.querySelector("#accountInfoUser");
				main.style.display = "block";
				login.style.display = "none";
				accountInfoUsername.textContent = user;

				return user;
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

async function logout(){
	user = null;
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

async function createAccount(){
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

async function sendMessage(){
	let input = messageInput.value;
	let messageThread = document.querySelector(".MessageThread");
	messageThread.appendChild(createMessage(user, new Date().toString().substring(0,16), new Date().toString().substring(18), input));
	messageInput.value = "";
}

function hoverServerButton(id){
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
	
function unHoverServerButton(id){
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
        messageThread.appendChild(createMessage(message.userName, message.date, message.time, message.body));
    }
	activeMessageThread = true;
}

async function openDmThread(id){
    let index = id.substring(2);
    fetch(`./users/${user}.json`)
		.then(res => {
			if(!res.ok){
				throw new Error("user file does not exist");
			}
			return res.json();
		})
		.then(data => {
            console.log(index);
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

async function openDMs(){
    let messageList = document.querySelector(".MessageList");
    messageList.innerHTML = '';
	fetch(`./users/${user}.json`)
		.then(res => {
			if(!res.ok){
				throw new Error("user file does not exist");
			}
			return res.json();
		})
		.then(data => loadDMs(data))
		.catch(error => console.error(error));
}

function createMessage(user, date, time, body){
	return elementFromHTML(`
		<div class="message" style="display: inline-block;">
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
									<h3 class="messageTime" id="message1Time">${gmtToLocal(time)}</h3>
								</div>
								<p>${body}</p>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	`);
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