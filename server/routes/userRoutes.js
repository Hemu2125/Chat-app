import express from "express";
import { register,login,setAvatar } from "../controllers/usersController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login",login);
router.post("/setAvatar/:id",setAvatar);

export default router;