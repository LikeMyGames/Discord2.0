import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String, requried: true},
	pfp: {type: String, default: "./images/dmIcon.png"},
	//email: {type: String, required: true, lowercase: true},
	//friends: [{user: {type: SchemaTypes.ObjectId, ref: 'User', required: false,},}]
	//peerID: {type: String, required: true},
}, {collection: 'Users'});

const User = model('User', userSchema);
export default User;