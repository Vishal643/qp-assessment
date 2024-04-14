import express from "express";
const router = express.Router();
import { register, login } from "../controllers/user";

router.post("/signup", register);
router.post("/login", login);

export { router as userRouter };
