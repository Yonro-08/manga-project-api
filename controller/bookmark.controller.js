import BookmarkModel from "../models/bookmark.models.js";

export const getBookmark = async (req, res) => {
	try {
		const { userId } = req;
		const { page = 1, take = 10, category } = req.query;

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

		const itemOffset = (Number(page) - 1) * Number(take);
		const endOffset = itemOffset + Number(take);
		const newBookmarks = filterBookmarks.slice(itemOffset, endOffset);

		res.json(newBookmarks);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Нет доступа!",
		});
	}
};

export const sendTotalLengthCategory = async (req, res) => {
	try {
		const { userId } = req;
		const bookmarks = await BookmarkModel.findOne({ userId });

		if (!bookmarks) {
			res.status(404).json({
				message: "Закладка не найдена",
			});
		}

		const categoryCounts = bookmarks.bookmarks.reduce((acc, book) => {
			const category = book.category;

			acc[category] = (acc[category] || 0) + 1;
			return acc;
		}, {});

		res.json(categoryCounts);
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

		// console.log(bookmarks);

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
			if (category === "Убрать из закладок") {
				bookmarks.bookmarks = bookmarks.bookmarks.filter(
					(bookmark) => bookmark.endpoint !== endpoint
				);
			} else {
				bookmarks.bookmarks = bookmarks.bookmarks.map((bookmark) => {
					if (bookmark.endpoint === endpoint) {
						return { ...bookmark, category };
					}
					return bookmark;
				});
			}
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
