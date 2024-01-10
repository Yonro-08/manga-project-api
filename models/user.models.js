import { Schema, model } from "mongoose";

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},

		avatar: {
			type: String,
			default: "",
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

export default model("User", userSchema);
