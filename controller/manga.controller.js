import jwt from "jsonwebtoken";

import bookmarkModels from "../models/bookmark.models.js";
import MangaModel from "../models/manga.models.js";

export const getManga = async (req, res) => {
	try {
		const manga = await MangaModel.find(
			{},
			{
				title: {
					russianName: 1,
				},
				endpoint: 1,
				url: 1,
				typeManga: 1,
				year: 1,
			}
		);

		res.json(manga);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Не удалось найти манги!",
		});
	}
};

export const getMangaByEndpoint = async (req, res) => {
	try {
		const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
		let activeCategory = "Добавить в закладку";
		const { endpoint } = req.params;

		const manga = await MangaModel.findOne({ endpoint });

		if (token) {
			const decoded = jwt.verify(token, "secret123");
			const bookmarks = await bookmarkModels.findOne({ userId: decoded._id });

			if (bookmarks) {
				const bookmark = bookmarks.bookmarks.find(
					(bookmark) => bookmark.endpoint === endpoint
				);

				if (bookmark) {
					activeCategory = bookmark.category;
				}
			}
		}

		if (!manga) {
			return res.status(400).json({
				message: "Данной манги не существует в базе",
			});
		}

		res.status(200).json({ ...manga._doc, activeCategory });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Не удалось найти мангу",
		});
	}
};

export const createManga = async (req, res) => {
	try {
		const { title, url, content, typeManga, year } = req.body || {};

		const endpoint = title.englishName.toLowerCase().split(" ").join("-");

		const newManga = new MangaModel({
			endpoint,
			title,
			url,
			content,
			typeManga,
			year,
		});

		await newManga.save();

		res.status(200).json({ result: "Манга успешно создалась!" });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Не удалось создать мангу",
		});
	}
};

export const createChapter = async (req, res) => {
	try {
		const { endpoint } = req.params;
		const { chapterTom, chapterNum, chapterImage } = req.body || {};

		const manga = await MangaModel.findOne({ endpoint });

		if (!manga) {
			return res.status(404).json({
				message: "Данной манги не существует в базе",
			});
		}

		const { chapters } = manga;

		chapters.push({ chapterTom, chapterNum, chapterImage });

		await manga.updateOne(
			{
				endpoint,
			},
			{ chapters }
		);

		await manga.save();
		res.status(200).json({ result: "Глава успешно добавлена" });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
