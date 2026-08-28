import { Router } from "express";
import { messageController } from "./messageController";

const messageRoute = Router()

messageRoute.post('/create', messageController.createMassage)
messageRoute.get('/', messageController.getAllMassage)
messageRoute.delete('/:id', messageController.deleteMassage)

export default messageRoute