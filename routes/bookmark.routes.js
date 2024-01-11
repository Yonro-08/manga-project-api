import { Router } from "express";

import {
	addBookmark,
	getBookmark,
	sendTotalLengthCategory,
} from "../controller/bookmark.controller.js";
import CheckAuth from "../utils/CheckAuth.js";

const router = new Router();

router.get("/bookmarks", CheckAuth, getBookmark);
router.get("/bookmarks/totalLength", CheckAuth, sendTotalLengthCategory);
router.patch("/bookmarks", CheckAuth, addBookmark);

export default router;
