import { Router } from 'express'

import orderRoutes from './order'
import inventoryRoutes from './inventory'
import productsRoutes from './product'

const router: Router = Router()

router.use('/order', orderRoutes)
router.use('/inventory', inventoryRoutes)
router.use('/product', productsRoutes)

export default router;
