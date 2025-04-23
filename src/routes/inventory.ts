import express, { Request, Response } from 'express';
import { get } from 'lodash'

import { db } from '../db';
import {
    Inventory,
    UpdateSingleStockRequest,
    UpdateBatchStockRequest,
} from '../utils';

const router = express.Router();
const inventory: Inventory = db.data.inventory;

router.post(
  '/update',
  (req: Request<{}, {}, UpdateSingleStockRequest>, res: Response) => {
    const { code, size, quantity, price } = req.body;

    if (!inventory[code]) inventory[code] = {};
    db.data.inventory![code]![size] = { quantity, price };

    db.write()
    return res.status(200).json({ message: 'Stock updated' });
  }
);

router.post(
  '/update-batch',
  (req: Request<{}, {}, UpdateBatchStockRequest>, res: Response) => {
    const { updates } = req.body;

    for (const update of updates) {
      const { code, size, quantity, price } = update;
      if (!inventory[code]) inventory[code] = {};
      db.data.inventory![code]![size] = { quantity, price };
      db.write()
    }

    return res.status(200).json({ message: 'Batch stock update complete' });
  }
);

router.get('/', (_: Request, res: Response) => {
  const inventory = db.data?.inventory || {};
  return res.status(200).json(inventory);
});

router.get('/:code', (req: Request, res: Response) => {
  const { code } = req.params;
  const productInventory = get(db, `data.inventory.${code}`);

  if (!productInventory) {
    return res.status(404).json({ message: 'Product inventory not found' });
  }

  return res.status(200).json(productInventory);
});

router.get('/:code/:size', (req: Request, res: Response) => {
  const { code, size } = req.params;
  const sizeInventory = get(db, `data.inventory.${code}.${size?.toUpperCase()}`);

  if (!sizeInventory) {
    return res.status(404).json({ message: 'Size inventory not found' });
  }

  return res.status(200).json(sizeInventory);
});

router.get('/low-stock', (_: Request, res: Response) => {
  const lowStockItems: Array<{
    code: string;
    size: string;
    quantity: number;
  }> = [];

  Object.entries(db.data?.inventory || {}).forEach(([code, sizes]) => {
    Object.entries(sizes).forEach(([size, details]) => {
      const quantity: number = get(details, 'quantity', 0);
      if (quantity < 10) {
        lowStockItems.push({
          code,
          size,
          quantity
        });
      }
    });
  });

  return res.status(200).json(lowStockItems);
});

export default router;
