import { Router } from 'express';
import { update_profile_controller, get_profile_controller } from '../controller/settings.controller.js';
import { isLogin } from '../middleware/islogin.middleware.js';

const settingsRouter = Router();

settingsRouter.use(isLogin);
settingsRouter.get('/', get_profile_controller);
settingsRouter.patch('/', update_profile_controller);

export { settingsRouter };
