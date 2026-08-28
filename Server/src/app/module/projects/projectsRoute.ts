import { Router } from "express";
import { ProjectsController } from "./projectsController";

const projectsRouter = Router()

projectsRouter.post('/create', ProjectsController.createConProjects)
projectsRouter.get('/',  ProjectsController.getConProjects)
projectsRouter.get('/:id',  ProjectsController.getSingleConProjects)
projectsRouter.patch('/:id',  ProjectsController.updateSingleConProjects)
projectsRouter.delete('/:id',   ProjectsController.deleteSingleConProjects)

export default projectsRouter