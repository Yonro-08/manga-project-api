import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import mangaRouter from "./routes/manga.routes.js";
import userRouter from "./routes/user.routes.js";

const PORT = process.env.PORT || 8080;
const mongoURL =
	"mongodb+srv://yonro:24081999Yonro@yonro.lab1pb4.mongodb.net/Remanga?retryWrites=true&w=majority";

const app = express();

// Connect mongoose
mongoose
	.connect(mongoURL)
	.then(() => {
		console.log("MongoDB has been connected...");
	})
	.catch((err) => console.log(err));

// App
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Create api
app.use("/api", userRouter);
app.use("/api", mangaRouter);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
