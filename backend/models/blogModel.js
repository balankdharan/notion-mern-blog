import { Schema, model } from "mongoose";

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    coverImage: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create slug from title
BlogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

export default model("Blog", BlogSchema);
