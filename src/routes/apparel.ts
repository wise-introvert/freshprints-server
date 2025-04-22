import { Router, type Request, type Response } from 'express'

import { db } from '../db'
import { Product, Data } from '../utils'

const router: Router = Router();

router.get('/', async (_: Request, res: Response<Data>): Promise<void> => {
    const products: Product[] = db.data.products

    res.status(200).json({
        products
    }).end();
})

export default router
