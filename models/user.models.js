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
	},
	{
		timestamps: true,
	}
);

export default model("User", userSchema);
