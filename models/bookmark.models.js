import { Schema, model } from "mongoose";

const bookmarkSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User" },
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
