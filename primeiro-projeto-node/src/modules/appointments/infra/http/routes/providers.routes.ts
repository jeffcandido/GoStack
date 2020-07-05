import { Router } from 'express';

import ensureAuthenticated from 'modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayController from '../controllers/ProviderDayAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthController = new ProviderMonthController();
const providerDayController = new ProviderDayController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get('/:provider_id/month-availability', providerMonthController.index);
providersRouter.get('/:provider_id/day-availability', providerDayController.index);

export default providersRouter;
