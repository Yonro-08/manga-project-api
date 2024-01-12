import { Router } from "express";

import {
	createChapter,
	createManga,
	getManga,
	getMangaByEndpoint,
	postLiked,
} from "../controller/manga.controller.js";
import CheckAuth from "../utils/CheckAuth.js";

const router = Router();

router.get("/manga", getManga);
router.get("/manga/:endpoint", getMangaByEndpoint);
router.post("/manga/liked", CheckAuth, postLiked);
router.post("/manga", CheckAuth, createManga);
router.patch("/manga/:endpoint/chapters", CheckAuth, createChapter);

export default router;
