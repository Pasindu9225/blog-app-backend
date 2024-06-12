const Joi = require("joi");
const fs = require("fs");
const Blog = require("../models/blog");
const BlogDTO = require("../dto/blog");
const BlogDetailsDTO = require("../dto/blogDetails");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const BACKEND_SERVICE_PATH = "http://localhost:5002"; // Define BACKEND_SERVICE_PATH

const blogController = {
  async create(req, res, next) {
    const createBlogSchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().regex(mongodbIdPattern).required(),
      content: Joi.string().required(),
      photo: Joi.string().required(),
    });

    const { error } = createBlogSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { title, author, content, photo } = req.body;

    const buffer = Buffer.from(
      photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );

    const imagePath = `${Date.now()}-${author}.png`;

    try {
      fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
      return next(error);
    }

    let newBlog;
    try {
      newBlog = new Blog({
        title,
        author,
        content,
        photoPath: `${BACKEND_SERVICE_PATH}/storage/${imagePath}`,
      });

      await newBlog.save(); // Save the new blog to the database
    } catch (error) {
      return next(error);
    }

    const blogDto = new BlogDTO(newBlog);
    return res.status(201).json({ blog: blogDto });
  },

  async getAll(req, res, next) {
    try {
      const blogs = await Blog.find({}); // Correctly reference the Blog model
      const blogsDto = []; // Initialize blogsDto

      for (let i = 0; i < blogs.length; i++) {
        const dto = new BlogDTO(blogs[i]);
        blogsDto.push(dto);
      }

      return res.status(200).json({ blogs: blogsDto });
    } catch (error) {
      return next(error);
    }
  },

  async getById(req, res, next) {
    const getByIdSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
    });
    const { error } = getByIdSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    let blog;
    const { id } = req.params;

    try {
      blog = await Blog.findOne({ _id: id }).populate("author");
    } catch (error) {
      return next(error);
    }

    const blogDto = new BlogDetailsDTO(blog);

    return res.status(200).json({ blog: blogDto });
  },

  async update(req, res, next) {
    // To be implemented
  },

  async delete(req, res, next) {
    // To be implemented
  },
};

module.exports = blogController;
