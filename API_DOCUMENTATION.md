# Product Quotation API Documentation

## Base URL
```
http://localhost:3000/api
```

## API Endpoints Overview

### 1. Categories API
Categories support hierarchical tree structure with parent-child relationships.

#### Endpoints:
- `GET /categories` - Get all categories
- `GET /categories/tree` - Get category tree structure  
- `GET /categories/{id}` - Get category by ID
- `POST /categories` - Create new category
- `PATCH /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category (soft delete)

#### Category Data Structure:
```typescript
interface Category {
  id: number;
  name: string;
  code: string;
  description?: string;
  parentId?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  parent?: Category;
  children: Category[];
}

interface CreateCategoryDto {
  name: string;           // required, max 255 chars
  code: string;           // required, max 100 chars, unique
  description?: string;
  parentId?: number;      // optional for root categories
  isActive?: boolean;     // default: true
}
```

### 2. Master Data APIs (Brands, Manufacturers, Materials, etc.)
All master data entities follow the same pattern:

#### Common Endpoints:
- `GET /{entity}` - Get all entities
- `GET /{entity}/{id}` - Get entity by ID  
- `POST /{entity}` - Create new entity
- `PATCH /{entity}/{id}` - Update entity
- `DELETE /{entity}/{id}` - Delete entity (soft delete)

#### Available Master Data Entities:
- `/brands`
- `/manufacturers` 
- `/materials`
- `/manufacturing-methods`
- `/colors` (has additional `hexCode` field)
- `/sizes`
- `/product-types`
- `/packaging-types`

#### Master Data Structure:
```typescript
interface MasterDataEntity {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateMasterDataDto {
  name: string;           // required, max 255 chars
  code: string;           // required, max 100 chars, unique
  description?: string;
  isActive?: boolean;     // default: true
}

// Special case for Colors
interface Color extends MasterDataEntity {
  hexCode?: string;       // optional hex color code like #FF0000
}
```

### 3. Product Attributes API (Dynamic Attributes System)

#### Endpoints:
- `GET /product-attributes` - Get all attributes
- `GET /product-attributes/{id}` - Get attribute by ID
- `POST /product-attributes` - Create new attribute
- `PATCH /product-attributes/{id}` - Update attribute
- `DELETE /product-attributes/{id}` - Delete attribute
- `GET /product-attributes/{id}/values` - Get attribute values

#### Product Attribute Structure:
```typescript
enum AttributeDataType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER'
}

interface ProductAttribute {
  id: number;
  name: string;
  code: string;
  dataType: AttributeDataType;
  description?: string;
  isRequired: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  values: ProductAttributeValue[];
}

interface ProductAttributeValue {
  id: number;
  attributeId: number;
  value: string;
  displayOrder: number;
  isActive: boolean;
}
```

### 4. Products API

#### Endpoints:
- `GET /products` - Get all products with relationships
- `GET /products/{id}` - Get product by ID
- `POST /products` - Create new product
- `PATCH /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product
- `POST /products/import` - Bulk import products from Excel

#### Product Structure:
```typescript
interface Product {
  id: number;
  name: string;
  code: string;
  sku?: string;
  categoryId: number;
  brandId?: number;
  manufacturerId?: number;
  materialId?: number;
  manufacturingMethodId?: number;
  colorId?: number;
  sizeId?: number;
  productTypeId?: number;
  packagingTypeId?: number;
  imageUrl?: string;
  description?: string;
  basePrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  category: Category;
  brand?: Brand;
  manufacturer?: Manufacturer;
  material?: Material;
  manufacturingMethod?: ManufacturingMethod;
  color?: Color;
  size?: Size;
  productType?: ProductType;
  packagingType?: PackagingType;
  dynamicAttributes: ProductDynamicAttribute[];
}

interface CreateProductDto {
  name: string;                    // required, max 255 chars
  code: string;                    // required, max 100 chars, unique
  sku?: string;                    // optional, max 100 chars, unique
  categoryId: number;              // required
  brandId?: number;
  manufacturerId?: number;
  materialId?: number;
  manufacturingMethodId?: number;
  colorId?: number;
  sizeId?: number;
  productTypeId?: number;
  packagingTypeId?: number;
  imageUrl?: string;               // max 1000 chars
  description?: string;
  basePrice?: number;              // default: 0.00
  isActive?: boolean;              // default: true
  dynamicAttributes?: ProductDynamicAttributeDto[];
}

interface ProductDynamicAttributeDto {
  attributeId: number;
  textValue?: string;              // for TEXT type attributes
  numberValue?: number;            // for NUMBER type attributes
}
```

### 5. Quotations API

#### Endpoints:
- `GET /quotations` - Get all quotations
- `GET /quotations/{id}` - Get quotation by ID
- `POST /quotations` - Create new quotation
- `PATCH /quotations/{id}` - Update quotation
- `DELETE /quotations/{id}` - Delete quotation
- `GET /quotations/{id}/pdf` - Generate PDF (future implementation)

#### Quotation Structure:
```typescript
enum QuotationStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT', 
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

interface Quotation {
  id: number;
  quotationNumber: string;         // auto-generated, unique
  customerName: string;
  companyName?: string;
  phoneNumber: string;
  quotationDate: Date;
  validUntil?: Date;
  status: QuotationStatus;
  totalAmount: number;             // calculated from items
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  items: QuotationItem[];
}

interface QuotationItem {
  id: number;
  quotationId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;              // quantity * unitPrice
  notes?: string;
  product: Product;
}

interface CreateQuotationDto {
  customerName: string;            // required, max 255 chars
  companyName?: string;            // optional, max 255 chars
  phoneNumber: string;             // required, max 50 chars
  quotationDate: string;           // required, ISO date string
  validUntil?: string;             // optional, ISO date string
  notes?: string;
  items: QuotationItemDto[];       // required, at least 1 item
}

interface QuotationItemDto {
  productId: number;               // required
  quantity: number;                // required, min 1
  unitPrice: number;               // required
  notes?: string;
}
```

## Common Query Parameters

### Search
Most GET endpoints support search:
```
GET /categories?search=electronics
GET /products?search=laptop
```

### Filtering (Future Enhancement)
```
GET /products?category=1&brand=2&isActive=true
GET /quotations?status=DRAFT&customerName=John
```

### Pagination (Future Enhancement)
```
GET /products?page=1&limit=10
```

## Response Format

### Success Response
```json
{
  "id": 1,
  "name": "Electronics",
  "code": "ELEC",
  "description": "Electronic products",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "statusCode": 404,
  "message": "Entity with ID 999 not found",
  "error": "Not Found"
}
```

### Validation Error Response
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "code should not be empty"
  ],
  "error": "Bad Request"
}
```

## Frontend Implementation Guidelines

### 1. Master Data Management
- Create reusable components for CRUD operations
- Implement search functionality
- Use consistent form validation
- Support bulk operations where applicable

### 2. Category Tree Management
- Use tree components (Antd Tree)
- Support drag-and-drop for reordering
- Implement breadcrumb navigation
- Show parent-child relationships clearly

### 3. Product Management
- Dynamic form fields based on selected category
- Support for multiple images
- Dynamic attributes rendering based on attribute type
- Excel import/export functionality

### 4. Quotation Management  
- Multi-step form for quotation creation
- Product selection with search/filter
- Automatic calculation of totals
- Status workflow management
- PDF generation and preview

### 5. Common UI Patterns
- Use Antd components consistently
- Implement responsive design
- Add loading states and error handling
- Use consistent color scheme and typography
- Support internationalization (i18n) if needed

## Database Setup Requirements

Before running the backend, ensure MySQL is running with:
- Database: `product_quotation`
- User: `root` (or configure in .env)
- Password: `password` (or configure in .env)
- Port: 3306

The backend will automatically create tables using TypeORM synchronization in development mode.