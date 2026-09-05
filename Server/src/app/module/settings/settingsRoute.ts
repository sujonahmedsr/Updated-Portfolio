import { Router } from "express";
import { settingsController } from "./settingsController";

const settingsRoute = Router();

settingsRoute.get("/", settingsController.getSettings);
settingsRoute.patch("/", settingsController.updateSettings);

export default settingsRoute;