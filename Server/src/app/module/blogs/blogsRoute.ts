import { Router } from "express";
import { BlogsController } from "./blogsController";

const blogsRouter = Router()

blogsRouter.post('/create', BlogsController.createConBlogs)
blogsRouter.get('/',  BlogsController.getConBlogs)
blogsRouter.get('/:id',  BlogsController.getSingleConBlogs)
blogsRouter.patch('/:id',  BlogsController.updateSingleConBlogs)
blogsRouter.delete('/:id',   BlogsController.deleteSingleConBlogs)

export default blogsRouter