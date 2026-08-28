import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import QuiryBuilder from "../../QuiryBuilder/QuiryBuilder";
import { blogsInterface } from "./blogsInterface";
import { blogsModel } from "./blogsSchmeModel";


// create post 
const createBlog = async (payload: blogsInterface) => {
    const result = await blogsModel.create(payload)
    return result
}
// get all products 
const getBlogs = async (query: Record<string, unknown>) => {
    const searchableFields = ['description', 'title'];
    const BlogQuery = new QuiryBuilder(blogsModel.find(), query)
        .search(searchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await BlogQuery.modelQuery;
    const meta = await BlogQuery.countTotal();
    
    return {
        meta,
        result,
    };

}
// get single product 
const getSingleBlogs = async (id: string) => {

    const result = await blogsModel.findById(id)
    if (!result) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This Blogs is not found !')
    }
    return result
}
// update single Blogs 
const updateSingleBlogs = async (id: string, body: blogsInterface) => {
    const result = await blogsModel.findByIdAndUpdate(id, body, { new: true })
    if (!result) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This Blogs is not found !')
    }
    return result
}
// delete single Blogs 
const deleteSingleBlogs = async (id: string) => {
    const result = await blogsModel.findByIdAndDelete(id)
    if (!result) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This Blogs is not found !')
    }
    return result
}

export const BlogsServices = {
    createBlog,
    getBlogs,
    getSingleBlogs,
    updateSingleBlogs,
    deleteSingleBlogs
}