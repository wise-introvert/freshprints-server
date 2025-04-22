import express, { Request, Response } from 'express';

import {
  UpdateSingleStockRequest,
  UpdateBatchStockRequest,
  CheckOrderRequest,
  CheckOrderResponse,
  GetOrderCostRequest,
  GetOrderCostResponse,
  Product,
  Data
} from '../utils';
import { db } from '../db'

const router = express.Router();
let inventory: Record<string, Record<string, { quantity: number; price: number }>> = {};

router.get('/', async (_: Request, res: Response<Data>): Promise<void> => {
    const products: Product[] = db.data.products

    res.status(200).json({
        products
    }).end();
})

router.post(
  '/stock/update',
  (req: Request<{}, {}, UpdateSingleStockRequest>, res: Response) => {
    const { code, size, quantity, price } = req.body;

    if (!inventory[code]) inventory[code] = {};
    inventory[code][size] = { quantity, price };

    return res.status(200).json({ message: 'Stock updated' });
  }
);

router.post(
  '/stock/update-batch',
  (req: Request<{}, {}, UpdateBatchStockRequest>, res: Response) => {
    const { updates } = req.body;

    for (const update of updates) {
      const { code, size, quantity, price } = update;
      if (!inventory[code]) inventory[code] = {};
      inventory[code][size] = { quantity, price };
    }

    return res.status(200).json({ message: 'Batch stock update complete' });
  }
);

router.post(
  '/order/can-fulfill',
  (req: Request<{}, {}, CheckOrderRequest>, res: Response<CheckOrderResponse>) => {
    const { items } = req.body;

    const unavailableItems = items
      .map(({ code, size, quantity }) => {
        const entry = inventory[code]?.[size];
        if (!entry || entry.quantity < quantity) {
          return {
            code,
            size,
            availableQuantity: entry?.quantity ?? 0,
            requestedQuantity: quantity,
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return res.status(200).json({
      canFulfill: unavailableItems.length === 0,
      ...(unavailableItems.length > 0 && { unavailableItems }),
    });
  }
);

router.post(
  '/order/cost',
  (req: Request<{}, {}, GetOrderCostRequest>, res: Response<GetOrderCostResponse>) => {
    const { items } = req.body;

    let totalCost = 0;
    const breakdown: GetOrderCostResponse['breakdown'] = [];

    for (const { code, size, quantity } of items) {
      const entry = inventory[code]?.[size];
      if (!entry || entry.quantity < quantity) {
        return res.status(400).json({
          totalCost: 0,
          breakdown: [],
        });
      }

      const unitPrice = entry.price;
      const totalPrice = unitPrice * quantity;
      totalCost += totalPrice;

      breakdown.push({ code, size, quantity, unitPrice, totalPrice });
    }

    return res.status(200).json({ totalCost, breakdown });
  }
);

export default router
