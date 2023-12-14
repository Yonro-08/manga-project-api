import { Router } from "express";

import { getUser, createUser } from "../controller/user.controller.js";

const router = new Router();

router.get("/user", getUser);
router.post("/user", createUser);

export default router;
