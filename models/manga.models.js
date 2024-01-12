import { Schema, model } from "mongoose";

const mangaSchema = new Schema(
	{
		endpoint: String,
		title: {
			englishName: String,
			russianName: String,
			otherName: {
				type: String,
				default: "",
			},
		},
		status: {
			type: String,
			default: "Продолжается",
		},
		url: String,
		content: String,
		typeManga: String,
		year: Number,
		chapters: {
			type: [
				{
					chapterTom: Number,
					chapterNum: Number,
					chapterImage: [String],
					liked: {
						type: [{ type: Schema.Types.ObjectId, ref: "User" }] || [],
						default: [],
					},
					createChapter: {
						type: Date,
						default: Date.now,
					},
				},
			],
			default: [],
		},
		rating: {
			type: [
				{
					userName: String,
					grade: String,
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

export default model("Manga", mangaSchema);
