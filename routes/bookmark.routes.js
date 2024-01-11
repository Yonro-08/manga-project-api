import { Router } from "express";

import { addBookmark, getBookmark } from "../controller/bookmark.controller.js";
import CheckAuth from "../utils/CheckAuth.js";

const router = new Router();

router.get("/bookmarks", CheckAuth, getBookmark);
router.patch("/bookmarks", CheckAuth, addBookmark);

export default router;
