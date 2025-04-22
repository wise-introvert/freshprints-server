export interface Product {
  code: string;
  sizes: Apparel[];
}

export interface Apparel {
  size: string;
  quantity: number;
  price: number;
}

export interface Data {
    products: Product[]
}

export interface UpdateSingleStockRequest {
  code: string;
  size: string;
  quantity: number;
  price: number;
}

export interface UpdateBatchStockRequest {
  updates: UpdateSingleStockRequest[];
}

export interface OrderItem {
  code: string;
  size: string;
  quantity: number;
}

export interface CheckOrderRequest {
  items: OrderItem[];
}

export interface CheckOrderResponse {
  canFulfill: boolean;
  unavailableItems?: {
    code: string;
    size: string;
    availableQuantity: number;
    requestedQuantity: number;
  }[];
}

export interface GetOrderCostRequest {
  items: OrderItem[];
}

export interface GetOrderCostResponse {
  totalCost: number;
  breakdown: {
    code: string;
    size: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}
