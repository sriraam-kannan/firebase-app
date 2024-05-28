import express from 'express';

import reportRoutes from './appModules/reports/reportsRoutes.js';
import userRoutes from './appModules/users/userRoutes.js';

const routes = express.Router();

routes.use('/users', userRoutes());
routes.use('/reports', reportRoutes());

export default routes;
