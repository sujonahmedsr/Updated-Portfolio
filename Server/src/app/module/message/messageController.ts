import { StatusCodes } from "http-status-codes";
import asyncFunc from "../../utils/asyncFunc";
import sendResponse from "../../utils/sendRespose";
import { messageServices } from "./messageServices";

const createMassage = asyncFunc(async(req, res) => {
    const body = req.body
    const result = await messageServices.creacteMessage(body)
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: 'Message send successfully',
        data: result,
    })
})
const getAllMassage = asyncFunc(async(req, res) => {
    const result = await messageServices.allMessage()
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Message retrive successfully',
        data: result,
    })
})

const deleteMassage = asyncFunc(async(req, res) => {
    const { id } = req.params;
    const result = await messageServices.deleteMessage(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: 'Message deleted successfully',
        data: result,
    });
});

export const messageController = {
    createMassage,
    getAllMassage,
    deleteMassage
}