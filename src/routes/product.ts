import express, { Request, Response } from 'express';

import { db } from '../db'

const router = express.Router();

router.get('/', (_: Request, res: Response) => {
  const products = db.data?.products || [];
  return res.status(200).json(products);
});

router.get('/:code', (req: Request, res: Response) => {
  const { code } = req.params;
  const product = db.data?.products.find(p => p.code === code);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  return res.status(200).json(product);
});

router.get('/:code/sizes', (req: Request, res: Response) => {
  const { code } = req.params;
  const product = db.data?.products.find(p => p.code === code);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  return res.status(200).json(product.sizes);
});

router.get('/:code/sizes/:size', (req: Request, res: Response) => {
  const { code, size } = req.params;
  const product = db.data?.products.find(p => p.code === code);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const sizeDetails = product.sizes.find(s => s.size === size);
  if (!sizeDetails) {
    return res.status(404).json({ message: 'Size not found for this product' });
  }

  return res.status(200).json(sizeDetails);
});

export default router;
