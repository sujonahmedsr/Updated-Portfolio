import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import QuiryBuilder from "../../QuiryBuilder/QuiryBuilder";
import { projectsInterface } from "./projectsInterface";
import { projectsModel } from "./projectsSchmeModel";
import { sanitizeRichHtml } from "../../utils/sanitizeHtml";


// create post 
const createProject = async (payload: projectsInterface) => {
    const result = await projectsModel.create({
        ...payload,
        description: sanitizeRichHtml(payload.description),
    })
    return result
}
// get all products 
const getProjects = async (query: Record<string, unknown>) => {
    const searchableFields = ['description', 'title'];
    const projectQuery = new QuiryBuilder(projectsModel.find(), query)
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

}
// get single product 
const getSingleProjects = async (id: string) => {

    const result = await projectsModel.findById(id)
    if (!result) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This projects is not found !')
    }
    return result
}
// update single projects 
const updateSingleProjects = async (id: string, body: projectsInterface) => {
    const result = await projectsModel.findByIdAndUpdate(id, {
        ...body,
        ...(typeof body.description === 'string' ? { description: sanitizeRichHtml(body.description) } : {}),
    }, { new: true, runValidators: true })
    if (!result) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This projects is not found !')
    }
    return result
}
// delete single projects 
const deleteSingleProjects = async (id: string) => {
    const result = await projectsModel.findByIdAndDelete(id)
    if (!result) {
        throw new AppError(StatusCodes.NOT_FOUND, 'This projects is not found !')
    }
    return result
}

export const projectsServices = {
    createProject,
    getProjects,
    getSingleProjects,
    updateSingleProjects,
    deleteSingleProjects
}