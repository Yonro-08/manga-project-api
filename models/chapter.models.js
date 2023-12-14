import { Schema, model } from "mongoose";

const chapterSchema = new Schema(
  {
    endpoint: String,
    chapters: [
      {
        chapterNum: String,
        chapterImage: [String],
        volume: {
          type: String,
          default: 0,
        },
        createChapter: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("chapter", chapterSchema);
