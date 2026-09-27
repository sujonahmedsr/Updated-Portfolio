import { Request, Response } from "express";
import asyncFunc from "../../utils/asyncFunc";
import sendResponse from "../../utils/sendRespose";
import { StatusCodes } from "http-status-codes";
import { shopifyProjectsServices } from "./shopifyProjectsServices";

// Create Shopify Project
const createConShopifyProjects = asyncFunc(async (req: Request, res: Response) => {
  const body = req.body;
  const result = await shopifyProjectsServices.createShopifyProject(body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Shopify project created successfully",
    data: result,
  });
});

// Get all Shopify Projects
const getConShopifyProjects = asyncFunc(async (req: Request, res: Response) => {
  const queryData = req.query;
  const result = await shopifyProjectsServices.getShopifyProjects(queryData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Shopify projects retrieved successfully",
    data: result,
  });
});

// Get single Shopify Project
const getSingleConShopifyProjects = asyncFunc(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await shopifyProjectsServices.getSingleShopifyProject(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Shopify project retrieved successfully",
    data: result,
  });
});

// Update single Shopify Project
const updateSingleConShopifyProjects = asyncFunc(async (req: Request, res: Response) => {
  const body = req.body;
  const id = req.params.id;
  const result = await shopifyProjectsServices.updateSingleShopifyProject(id, body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Shopify project updated successfully",
    data: result,
  });
});

// Delete single Shopify Project
const deleteSingleConShopifyProjects = asyncFunc(async (req: Request, res: Response) => {
  const id = req.params.id;
  await shopifyProjectsServices.deleteSingleShopifyProject(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Shopify project deleted successfully",
    data: null,
  });
});

export const ShopifyProjectsController = {
  createConShopifyProjects,
  getConShopifyProjects,
  getSingleConShopifyProjects,
  updateSingleConShopifyProjects,
  deleteSingleConShopifyProjects,
};
