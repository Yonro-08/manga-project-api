import { Schema, model } from "mongoose";

const bookmarkSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		totalLength: {
			Читаю: {
				type: Number,
				default: 0,
			},
			"Буду читать": {
				type: Number,
				default: 0,
			},
			Прочитано: {
				type: Number,
				default: 0,
			},
			Брошено: {
				type: Number,
				default: 0,
			},
			Отложено: {
				type: Number,
				default: 0,
			},
			"Не интересно": {
				type: Number,
				default: 0,
			},
		},
		bookmarks: {
			type: Array({
				endpoint: String,
				url: String,
				title: String,
				category: String,
			}),
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

export default model("Bookmark", bookmarkSchema);
