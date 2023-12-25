import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";

import userRouter from "./routes/user.routes.js";
import mangaRouter from "./routes/manga.routes.js";

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

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// App
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static("uploads"));
app.use(cors());

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`,
  });
});

// Create api
app.use("/api", userRouter);
app.use("/api", mangaRouter);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
