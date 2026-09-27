import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import QuiryBuilder from "../../QuiryBuilder/QuiryBuilder";
import { IShopifyProject } from "./shopifyProjectsInterface";
import { shopifyProjectsModel } from "./shopifyProjectsModel";
import { sanitizeRichHtml } from "../../utils/sanitizeHtml";

// Create shopify project
const createShopifyProject = async (payload: IShopifyProject) => {
  const result = await shopifyProjectsModel.create({
    ...payload,
    description: sanitizeRichHtml(payload.description),
  });
  return result;
};

// Get all shopify projects
const getShopifyProjects = async (query: Record<string, unknown>) => {
  const searchableFields = ["description", "title", "clientName", "category", "theme"];
  const projectQuery = new QuiryBuilder(shopifyProjectsModel.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await projectQuery.modelQuery;
  const meta = await projectQuery.countTotal();

  return {
    meta,
    result,
  };
};

// Get single shopify project
const getSingleShopifyProject = async (id: string) => {
  const result = await shopifyProjectsModel.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Shopify project not found!");
  }
  return result;
};

// Update single shopify project
const updateSingleShopifyProject = async (
  id: string,
  body: Partial<IShopifyProject>
) => {
  const result = await shopifyProjectsModel.findByIdAndUpdate(
    id,
    {
      ...body,
      ...(typeof body.description === "string"
        ? { description: sanitizeRichHtml(body.description) }
        : {}),
    },
    { new: true, runValidators: true }
  );
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Shopify project not found!");
  }
  return result;
};

// Delete single shopify project
const deleteSingleShopifyProject = async (id: string) => {
  const result = await shopifyProjectsModel.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Shopify project not found!");
  }
  return result;
};

export const shopifyProjectsServices = {
  createShopifyProject,
  getShopifyProjects,
  getSingleShopifyProject,
  updateSingleShopifyProject,
  deleteSingleShopifyProject,
};
