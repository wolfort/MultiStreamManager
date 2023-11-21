import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import http from "http";
import mongoose from "mongoose";
import morgan from "morgan";
import { config } from "./config/config";

dotenv.config();

const router = express();

mongoose.set("strictQuery", true);
mongoose
	.connect(config.mongo.url)
	.then(() => {
		console.log("Connected to mongoDB");
		StartServer();
	})
	.catch((error: any) => {
		console.log("Unable to connect: ");
		console.log(error);
	});

const StartServer = () => {
	router.use(cookieParser());
	router.use(
		cors({
			origin: "*",
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		})
	);
	router.use(express.urlencoded({ extended: true }));
	router.use(express.json());
	router.use(helmet());
	router.use(morgan("common"));

	http.createServer(router).listen(config.server.port);
};
