import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
	username: string;
	email: string;
	password: string;
	refreshToken: {
		token: string;
		ip: string;
		date: string;
	}[];
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		min: 5,
	},
	refreshToken: [
		{
			token: {
				type: String,
			},
			ip: {
				type: String,
			},
			date: {
				type: String,
			},
		},
	],
});

export default mongoose.model<IUserModel>("User", UserSchema);
