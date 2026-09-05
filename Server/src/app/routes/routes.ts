import { Router } from "express";
import projectsRouter from "../module/projects/projectsRoute";
import messageRoute from "../module/message/messageRoute";
import blogsRouter from "../module/blogs/blogsRoute";
import settingsRoute from "../module/settings/settingsRoute";
const router = Router();
const moduleRoutes = [

  {
    path: "/projects",
    route: projectsRouter,
  },
  {
    path: "/blogs",
    route: blogsRouter,
  },
  {
    path: "/message",
    route: messageRoute,
  },
  {
    path: "/settings",
    route: settingsRoute,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
