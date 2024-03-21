import { readDirectory } from "./fileManager";

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