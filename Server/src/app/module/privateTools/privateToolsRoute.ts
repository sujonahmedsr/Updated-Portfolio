import { Router } from "express";
import { privateToolsController as controller } from "./privateToolsController";

const router = Router();
router.get("/expenses", controller.getExpenses);
router.post("/expenses", controller.createExpense);
router.patch("/expenses/:id", controller.updateExpense);
router.delete("/expenses/:id", controller.hideExpense);
router.post("/expenses/:id/restore", controller.restoreExpense);
router.get("/notes", controller.getNotes);
router.post("/notes", controller.createNote);
router.patch("/notes/:id", controller.updateNote);
router.delete("/notes/:id", controller.hideNote);
router.post("/notes/:id/restore", controller.restoreNote);
router.get("/goals", controller.getGoals);
router.post("/goals", controller.createGoal);
router.patch("/goals/:id", controller.updateGoal);
router.delete("/goals/:id", controller.hideGoal);
router.post("/goals/:id/restore", controller.restoreGoal);

export default router;