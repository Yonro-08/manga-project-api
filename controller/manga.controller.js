import jwt from "jsonwebtoken";

import bookmarkModels from "../models/bookmark.models.js";
import MangaModel from "../models/manga.models.js";
import userModels from "../models/user.models.js";

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

		if (!manga) {
			return res.status(400).json({
				message: "Данной манги не существует в базе",
			});
		}

		if (token) {
			const decoded = jwt.verify(token, "secret123");
			const userId = decoded._id;
			const bookmarks = await bookmarkModels.findOne({ userId });

			if (bookmarks) {
				const bookmark = bookmarks.bookmarks.find(
					(bookmark) => bookmark.endpoint === endpoint
				);

				if (bookmark) {
					activeCategory = bookmark.category;
				}
			}
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
		const { title, url, content, typeManga, year, genres } = req.body || {};

		const endpoint = title.englishName.toLowerCase().split(" ").join("-");
		const newGenres = genres.replaceAll(" ", "").split(",");

		const newManga = new MangaModel({
			endpoint,
			title,
			url,
			content,
			typeManga,
			year,
			genres: newGenres,
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

export const postLiked = async (req, res) => {
	try {
		const { userId } = req;
		const { endpoint, chapterNum } = req.body;

		const user = await userModels.findById(userId);

		if (!user) {
			res.status(404).json({
				message: "Пользователь не найден",
			});
		}

		const manga = await MangaModel.findOne({ endpoint });

		if (!manga) {
			res.status(404).json({
				message: "Манга не найдена",
			});
		}

		const newChapters = manga.chapters.map((chapter) => {
			if (chapter.chapterNum === Number(chapterNum)) {
				if (chapter.liked.find((user) => user.toString() === userId)) {
					const newLiked = chapter.liked.filter(
						(user) => user.toString() !== userId
					);
					return { ...chapter._doc, liked: newLiked };
				}

				const newChapter = chapter.liked.push(userId);
				return newChapter;
			}
			return chapter;
		});

		console.log(newChapters);

		await manga.updateOne(
			{
				endpoint,
			},
			{ chapters: newChapters }
		);

		await manga.save();

		res.json(true);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Нет доступа!",
		});
	}
};
