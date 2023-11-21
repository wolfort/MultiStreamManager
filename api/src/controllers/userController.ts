import { Request, Response } from "express";
import User from "../models/User";
const CryptoJS = require("crypto-js");
const Jwt = require("jsonwebtoken");
const moment = require("moment");

const loginUser = async (req: Request, res: Response) => {
	try {
		const username = req.body.username;
		const password = req.body.password;

		const foundUser = await User.findOne({ username }).lean();

		if (!foundUser) {
			console.log("User doesn't exist");
			res.status(401).json({
				message: "Błędne dane logowania",
				type: "error",
			});
			res.end();
			return;
		}

		const hashedPassword = CryptoJS.AES.decrypt(
			foundUser.password,
			process.env.CRYPTOJS_SECURITY
		);
		const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

		if (OriginalPassword !== password) {
			console.log("Wrong password");
			res.status(401).json({
				message: "Błędne dane logowania",
				type: "error",
			});
			res.end();
			return;
		}

		const accessToken = Jwt.sign(
			{
				id: foundUser._id,
				username: foundUser.username,
				email: foundUser.email,
			},
			process.env.JWT_SECURITY,
			{ expiresIn: "1h" }
		);
		const refreshToken = Jwt.sign(
			{
				id: foundUser._id,
				username: foundUser.username,
				email: foundUser.email,
			},
			process.env.JWT_SECURITY,
			{ expiresIn: "30d" }
		);

		await User.findByIdAndUpdate(
			foundUser._id,
			{
				$push: {
					refreshToken: {
						token: refreshToken,
						ip: req.headers["x-real-ip"],
						date: moment(new Date()).format(),
					},
				},
			},
			{ new: true }
		);

		return res.status(200).json({
			data: {
				accessToken,
				refreshToken,
			},
			message: "Login successful",
			type: "success",
		});
	} catch (error) {
		res.status(500).json({ message: error, type: "error" });
		console.log(error);
	}
};

export default {
	loginUser,
};
