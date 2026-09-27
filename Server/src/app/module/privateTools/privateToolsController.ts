import { Request, Response } from "express";
import asyncFunc from "../../utils/asyncFunc";
import { StatusCodes } from "http-status-codes";
import { privateToolsService } from "./privateToolsService";

const getExpenses = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.getExpenses(String(req.query.month || ""), req.query.view === "hidden");
  res.status(StatusCodes.OK).json({ success: true, data: result });
});
const createExpense = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.createExpense(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data: result });
});
const updateExpense = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.updateExpense(req.params.id, req.body);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});
const hideExpense = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.deletePermanently("expense", req.params.id);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});
const restoreExpense = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.setHidden("expense", req.params.id, false);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const getNotes = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.getNotes(String(req.query.month || ""), req.query.view === "hidden");
  res.status(StatusCodes.OK).json({ success: true, data: result });
});
const createNote = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.createNote(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data: result });
});
const updateNote = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.updateNote(req.params.id, req.body);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});
const hideNote = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.deletePermanently("note", req.params.id);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});
const restoreNote = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.setHidden("note", req.params.id, false);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const getGoals = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.getGoals(req.query.view === "hidden");
  res.status(StatusCodes.OK).json({ success: true, data: result });
});
const createGoal = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.createGoal(req.body);
  res.status(StatusCodes.CREATED).json({ success: true, data: result });
});
const updateGoal = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.updateGoal(req.params.id, req.body);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});
const hideGoal = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.deletePermanently("goal", req.params.id);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});
const restoreGoal = asyncFunc(async (req: Request, res: Response) => {
  const result = await privateToolsService.setHidden("goal", req.params.id, false);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

export const privateToolsController = {
  getExpenses, createExpense, updateExpense, hideExpense, restoreExpense,
  getNotes, createNote, updateNote, hideNote, restoreNote,
  getGoals, createGoal, updateGoal, hideGoal, restoreGoal,
};