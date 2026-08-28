import { Request, Response } from "express";
import asyncFunc from "../../utils/asyncFunc";
import sendResponse from "../../utils/sendRespose";
import { StatusCodes } from "http-status-codes";
import { projectsServices } from "./projectsServices";

// create bycle Projects 
const createConProjects = asyncFunc(async (req, res) => {
    const body = req.body;
    const result = await projectsServices.createProject(body)
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: 'Project created successfully',
        data: result
    })
})

// get all bycles Projects 
const getConProjects = asyncFunc(async (req, res) => {
    const queryData = req?.query;
    const result = await projectsServices.getProjects(queryData)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Projects retrieved successfully',
        data: result,
    })
})


// get single bycle Projects 
const getSingleConProjects = asyncFunc(async (req, res) => {
    const id = req.params.id
    const result = await projectsServices.getSingleProjects(id)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Project retrieved successfully',
        data: result
    })
})

// update single bycle Projects 
const updateSingleConProjects = asyncFunc(async (req, res) => {
    const body = req.body
    const id = req.params.id
    const result = await projectsServices.updateSingleProjects(id, body)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Project updated successfully',
        data: result
    })
})

// delete single bycle 
const deleteSingleConProjects = asyncFunc(async (req, res) => {
    const id = req.params.id
    await projectsServices.deleteSingleProjects(id)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Project deleted successfully',
        data: null
    })
})

export const ProjectsController = {
    createConProjects,
    getConProjects,
    getSingleConProjects,
    updateSingleConProjects,
    deleteSingleConProjects
}