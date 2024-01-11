import { Router } from "express";

import {
	addBookmark,
	getBookmark,
	getBookmarkByEndpoint,
} from "../controller/bookmark.controller.js";
import CheckAuth from "../utils/CheckAuth.js";

const router = new Router();

router.get("/bookmarks", CheckAuth, getBookmark);
router.get("/bookmarks/:endpoint", CheckAuth, getBookmarkByEndpoint);
router.patch("/bookmarks", CheckAuth, addBookmark);

export default router;
