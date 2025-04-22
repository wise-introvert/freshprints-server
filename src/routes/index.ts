import { Router } from 'express'

import apparels from './apparel'

const router: Router = Router();

router.use('/apparels', apparels);

export default router;
