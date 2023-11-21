import express from "express";
import controller from "../controllers/userController";

const router = express.Router();

router.post("/login", controller.loginUser);

export = router;
