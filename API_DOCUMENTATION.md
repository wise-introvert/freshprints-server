# Apparel Inventory Management API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
Currently, the API does not require authentication.

## Data Types

### Product
```typescript
{
  code: string;      // Unique product code (auto-generated if not provided)
  sizes: Array<{
    size: string;    // Size identifier (e.g., 'S', 'M', 'L', '30', '32')
    quantity: number; // Available quantity
    price: number;   // Price per unit
  }>;
}
```

### Inventory Item
```typescript
{
  quantity: number;  // Available quantity
  price: number;    // Current price
}
```

## Endpoints

### Stock Management

#### Update Single Stock Item
Updates the quantity and price for a single product size.

**Endpoint:** `POST /stock/update`

**Request Body:**
```typescript
{
  code: string;     // Product code
  size: string;     // Size identifier
  quantity: number; // New quantity
  price: number;    // New price
}
```

**Response:**
- `200 OK`: Stock updated successfully
- `404 Not Found`: Product or size not found
- `400 Bad Request`: Invalid request body

**Example:**
```json
POST /stock/update
{
  "code": "TSHIRT001",
  "size": "M",
  "quantity": 35,
  "price": 16.99
}
```

#### Batch Update Stock
Updates multiple stock items simultaneously.

**Endpoint:** `POST /stock/update-batch`

**Request Body:**
```typescript
{
  updates: Array<{
    code: string;     // Product code
    size: string;     // Size identifier
    quantity: number; // New quantity
    price: number;    // New price
  }>;
}
```

**Response:**
- `200 OK`: All updates successful
- `400 Bad Request`: Invalid request body
- `404 Not Found`: One or more products not found

**Example:**
```json
POST /stock/update-batch
{
  "updates": [
    {
      "code": "HOODIE002",
      "size": "L",
      "quantity": 20,
      "price": 44.99
    },
    {
      "code": "PANTS003",
      "size": "30",
      "quantity": 25,
      "price": 28.99
    }
  ]
}
```

### Order Management

#### Check Order Fulfillment
Checks if an order can be fulfilled with current inventory.

**Endpoint:** `POST /order/can-fulfill`

**Request Body:**
```typescript
{
  items: Array<{
    code: string;     // Product code
    size: string;     // Size identifier
    quantity: number; // Requested quantity
  }>;
}
```

**Response:**
```typescript
{
  canFulfill: boolean;
  unavailableItems?: Array<{
    code: string;
    size: string;
    availableQuantity: number;
    requestedQuantity: number;
  }>;
}
```

**Example:**
```json
POST /order/can-fulfill
{
  "items": [
    {
      "code": "TSHIRT001",
      "size": "M",
      "quantity": 5
    },
    {
      "code": "HOODIE002",
      "size": "L",
      "quantity": 2
    }
  ]
}
```

#### Calculate Order Cost
Calculates the total cost of an order.

**Endpoint:** `POST /order/cost`

**Request Body:**
```typescript
{
  items: Array<{
    code: string;     // Product code
    size: string;     // Size identifier
    quantity: number; // Requested quantity
  }>;
}
```

**Response:**
```typescript
{
  totalCost: number;
  breakdown: Array<{
    code: string;
    size: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}
```

### Query Endpoints

#### Get All Products
Retrieves all products in the system.

**Endpoint:** `GET /query/products`

**Response:** Array of Product objects

#### Get Product by Code
Retrieves a specific product by its code.

**Endpoint:** `GET /query/products/:code`

**Response:** Product object or 404 if not found

#### Get Product Sizes
Retrieves all sizes for a specific product.

**Endpoint:** `GET /query/products/:code/sizes`

**Response:** Array of size objects for the specified product

#### Get Size Details
Retrieves details for a specific size of a product.

**Endpoint:** `GET /query/products/:code/sizes/:size`

**Response:** Size details object or 404 if not found

#### Get Complete Inventory
Retrieves the complete inventory status.

**Endpoint:** `GET /query/inventory`

**Response:** Complete inventory object mapping product codes to their size inventories

#### Get Product Inventory
Retrieves inventory for a specific product.

**Endpoint:** `GET /query/inventory/:code`

**Response:** Inventory object for the specified product or 404 if not found

#### Get Size Inventory
Retrieves inventory for a specific product size.

**Endpoint:** `GET /query/inventory/:code/:size`

**Response:** Inventory details for the specified product size or 404 if not found

#### Get Low Stock Items
Retrieves all items with low stock (quantity < 10).

**Endpoint:** `GET /query/low-stock`

**Response:**
```typescript
Array<{
  code: string;    // Product code
  size: string;    // Size identifier
  quantity: number; // Current quantity
}>;
```

## Error Handling

The API uses standard HTTP status codes:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid request body or parameters
- `404 Not Found`: Requested resource not found
- `500 Internal Server Error`: Server error

Error responses include a message field explaining the error:
```json
{
  "message": "Error description"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Current limits are:
- Maximum 100 requests per minute per IP
- Request throttling after 50 requests per minute

## Data Persistence

All data is persisted in a local JSON file and survives server restarts.

## Setup Instructions

1. Install dependencies:
```bash
yarn install
```

2. Start the server:
```bash
yarn dev
```