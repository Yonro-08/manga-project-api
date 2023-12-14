import { Router } from "express";

import {
  createChapter,
  createManga,
  getManga,
  getMangaByEndpoint,
} from "../controller/manga.controller.js";

const router = Router();

router.get("/manga", getManga);
router.get("/manga/:endpoint", getMangaByEndpoint);
router.post("/manga", createManga);
router.patch("/manga/:endpoint/chapters", createChapter);

export default router;
