import { Router } from "express";

import { createUser, getLogin, getMe } from "../controller/user.controller.js";
import CheckAuth from "../utils/CheckAuth.js";
import { registerValidation } from "../validations/auth.js";

const router = new Router();

router.get("/auth/me", CheckAuth, getMe);
router.post("/auth/login", getLogin);
router.post("/auth/register", registerValidation, createUser);

export default router;
