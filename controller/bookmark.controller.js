import BookmarkModel from "../models/bookmark.models.js";

export const getBookmark = async (req, res) => {
	try {
		const { userId } = req;
		const { page = 0, take = 10, category } = req.query;

		const bookmarks = await BookmarkModel.findOne({ userId });

		if (!bookmarks) {
			return res.status(404).json({
				message: "Закладки не найдены!",
			});
		}

		const filterBookmarks = bookmarks.bookmarks.filter(
			(book) => book.category === category
		);

		if (!filterBookmarks) {
			return res.status(404).json({
				message: "Закладки не найдены!",
			});
		}

		const itemOffset = (Number(page) * Number(take)) % filterBookmarks.length;
		const endOffset = itemOffset + Number(take);
		const newBookmarks = filterBookmarks.slice(itemOffset, endOffset);

		console.log(newBookmarks);

		res.json({ data: newBookmarks });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Нет доступа!",
		});
	}
};

export const getBookmarkByEndpoint = async (req, res) => {
	try {
		const { userId } = req;
		const { endpoint } = req.params;

		console.log(userId);

		const bookmarks = await BookmarkModel.findOne({ userId });

		if (!bookmarks) {
			res.status(404).json({
				message: "Закладка не найдена",
			});
		}

		const bookmark = bookmarks.bookmarks.filter(
			(elem) => elem.endpoint === endpoint
		);

		res.json(bookmark);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Нет доступа!",
		});
	}
};

export const addBookmark = async (req, res) => {
	try {
		const { userId } = req;
		const { endpoint, url, title, category } = req.body;

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
			bookmarks.bookmarks = bookmarks.bookmarks.map((bookmark) => {
				if (bookmark.endpoint === endpoint) {
					return { ...bookmark, category };
				}
				return bookmark;
			});
		} else {
			bookmarks.bookmarks.push({ endpoint, url, title, category });
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
