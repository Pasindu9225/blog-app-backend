const mongoose = require("mongoose");

const { Shema } = mongoose;

const blogSchema = new Shema(
  {
    title: { type: String, require: true },
    content: { type: String, require: true },
    photoPath: { type: String, require: true },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

module.exports = mongoose.module("Blog", blogSchema, "blogs");
