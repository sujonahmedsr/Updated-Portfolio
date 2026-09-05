import { StatusCodes } from "http-status-codes";
import asyncFunc from "../../utils/asyncFunc";
import sendResponse from "../../utils/sendRespose";
import { settingsServices } from "./settingsServices";

const getSettings = asyncFunc(async (_req, res) => {
    const result = await settingsServices.getSettings();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Settings retrieved successfully",
        data: result,
    });
});

const updateSettings = asyncFunc(async (req, res) => {
    const result = await settingsServices.updateSettings(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Settings updated successfully",
        data: result,
    });
});

export const settingsController = { getSettings, updateSettings };