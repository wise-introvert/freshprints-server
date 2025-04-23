import express, { Request, Response } from 'express';

import {
  CheckOrderRequest,
  CheckOrderResponse,
  GetOrderCostRequest,
  GetOrderCostResponse,
  Inventory
} from '../utils';
import { db } from '../db'

const router = express.Router();
let inventory: Inventory = db.data.inventory;

router.post(
  '/can-fulfill',
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
  '/cost',
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
