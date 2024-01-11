import BookmarkModel from "../models/bookmark.models.js";
import UserModel from "../models/user.models.js";

export const getBookmark = async (req, res) => {
	try {
		const { userId } = req;
		const { page = 0, take = 10, category } = req.query;

		const user = await UserModel.findById(userId);

		if (!user) {
			res.status(404).json({
				message: "Пользователь не найден",
			});
		}

		const bookmark = user.bookmarks.filter(
			(book) => book.category === category
		);
		console.log(bookmark);

		res.json(bookmarks);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Не доступа!",
		});
	}
};

export const addBookmark = async (req, res) => {
	try {
		const { userId } = req;
		const { endpoint, url, title, category } = req.body;

		const user = await UserModel.findById(userId);

		if (!user) {
			res.status(404).json({
				message: "Пользователь не найден",
			});
		}

		const bookmarks = await BookmarkModel.findOne({ userId });

		if (!bookmarks) {
			const newBookmarks = new BookmarkModel({
				userId,
				bookmarks: { endpoint, url, title, category },
			});

			newBookmarks.totalLength[category] = 1;

			await newBookmarks.save();

			return res.json({
				status: "Success",
			});
		}

		if (
			bookmarks.bookmarks.find((bookmark) => bookmark.endpoint === endpoint)
		) {
			let prevCategory;

			bookmarks.bookmarks = bookmarks.bookmarks.map((bookmark) => {
				if (bookmark.endpoint === endpoint) {
					prevCategory = bookmark.category;
					return { ...bookmark, category };
				}
				return bookmark;
			});

			bookmarks.totalLength[prevCategory] = bookmarks.bookmarks.filter(
				(bookmark) => bookmark.category === prevCategory
			).length;

			bookmarks.totalLength[category] = bookmarks.bookmarks.filter(
				(bookmark) => bookmark.category === category
			).length;
		} else {
			bookmarks.bookmarks.push({ endpoint, url, title, category });

			bookmarks.totalLength[category] = bookmarks.bookmarks.filter(
				(bookmark) => bookmark.category === category
			).length;
		}

		await bookmarks.save();

		res.json({
			status: "Success",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Нет доступа!",
		});
	}
};
