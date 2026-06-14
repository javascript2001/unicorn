import { Router } from 'express';
import { dashboard_controller } from '../controller/dashboard.controller.js';
import { isLogin } from '../middleware/islogin.middleware.js';

const dashboardRouter = Router();

// All dashboard routes require authentication
dashboardRouter.use(isLogin);

// GET /api/v1/dashboard
// Query params:
//   ?page=1&limit=12
//   ?experience=SENIOR
//   ?mood=FREELANCE
//   ?coreSkills=Frontend,Backend
//   ?stackSkills=React,Node.js
//   ?search=juice
dashboardRouter.get('/', dashboard_controller);

export { dashboardRouter };
