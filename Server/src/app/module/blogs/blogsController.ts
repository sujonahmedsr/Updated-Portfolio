import { Request, Response } from "express";
import asyncFunc from "../../utils/asyncFunc";
import sendResponse from "../../utils/sendRespose";
import { StatusCodes } from "http-status-codes";
import { BlogsServices } from "./blogsServices";

// create bycle Blogs 
const createConBlogs = asyncFunc(async (req, res) => {
    const body = req.body;
    const result = await BlogsServices.createBlog(body)
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: 'Blog created successfully',
        data: result
    })
})

// get all bycles Blogs 
const getConBlogs = asyncFunc(async (req, res) => {
    console.log("hello gelloe");
    
    const queryData = req?.query;
    const result = await BlogsServices.getBlogs(queryData)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Blogs retrieved successfully',
        data: result,
    })
})


// get single bycle Blogs 
const getSingleConBlogs = asyncFunc(async (req, res) => {
    const id = req.params.id
    const result = await BlogsServices.getSingleBlogs(id)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Blog retrieved successfully',
        data: result
    })
})

// update single bycle Blogs 
const updateSingleConBlogs = asyncFunc(async (req, res) => {
    const body = req.body
    const id = req.params.id
    const result = await BlogsServices.updateSingleBlogs(id, body)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Blog updated successfully',
        data: result
    })
})

// delete single bycle 
const deleteSingleConBlogs = asyncFunc(async (req, res) => {
    const id = req.params.id
    await BlogsServices.deleteSingleBlogs(id)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Blog deleted successfully',
        data: null
    })
})

export const BlogsController = {
    createConBlogs,
    getConBlogs,
    getSingleConBlogs,
    updateSingleConBlogs,
    deleteSingleConBlogs
}