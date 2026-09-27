import { Router } from "express";
import { ShopifyProjectsController } from "./shopifyProjectsController";

const shopifyProjectsRouter = Router();

shopifyProjectsRouter.post("/create", ShopifyProjectsController.createConShopifyProjects);
shopifyProjectsRouter.post("/", ShopifyProjectsController.createConShopifyProjects);
shopifyProjectsRouter.get("/", ShopifyProjectsController.getConShopifyProjects);
shopifyProjectsRouter.get("/:id", ShopifyProjectsController.getSingleConShopifyProjects);
shopifyProjectsRouter.patch("/:id", ShopifyProjectsController.updateSingleConShopifyProjects);
shopifyProjectsRouter.put("/:id", ShopifyProjectsController.updateSingleConShopifyProjects);
shopifyProjectsRouter.delete("/:id", ShopifyProjectsController.deleteSingleConShopifyProjects);

export default shopifyProjectsRouter;
