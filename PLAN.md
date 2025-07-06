# Product Management and Quotation System - Complete Project Plan

## Project Overview

A comprehensive product management and quotation system designed to handle multi-industry products with dynamic attributes. The system allows users to manage products with flexible attributes across different industries (electronics, clothing, footwear, etc.) and generate quotations for customers.

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Ant Design (antd)
- **State Management**: React hooks (useState, useContext, useReducer)
- **HTTP Client**: Axios or Fetch API
- **Form Handling**: React Hook Form with validation

### Backend
- **Framework**: NestJS with TypeScript
- **ORM**: TypeORM
- **Authentication**: JWT tokens
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer for Excel imports

### Database
- **Primary Database**: MySQL 8.0+
- **Engine**: InnoDB (for foreign key support)
- **Indexing**: Strategic indexes for performance
- **Soft Delete**: Implemented across all tables

### Development Tools
- **Monorepo**: Nx.js workspace
- **Linting**: ESLint + Prettier
- **Version Control**: Git
- **Package Manager**: npm or yarn

## Project Structure

```
product-management-system/
├── apps/
│   ├── backend/           # NestJS API application
│   └── frontend/          # React application
├── libs/
│   └── shared-code/       # Shared types, interfaces, utilities
├── tools/
├── nx.json
├── package.json
└── tsconfig.base.json
```

## Coding Conventions

### General Rules
- **Language**: TypeScript throughout the project
- **Naming Conventions**:
  - Variables/Functions: camelCase
  - Classes/Interfaces: PascalCase
  - Constants: UPPER_SNAKE_CASE
  - Database Tables: PascalCase
  - Database Fields: camelCase
- **Code Quality**: Follow SOLID principles, DRY, and TypeScript best practices

### Frontend Specific
- React functional components with hooks
- ESLint rules: react, react-hooks plugins
- Consistent file structure and naming
- PropTypes using TypeScript interfaces

### Backend Specific
- NestJS decorators and dependency injection
- DTOs for request/response validation
- Service-Repository pattern
- Error handling with custom exceptions

## Database Design

### Core Principles
- **Normalization**: 3NF normalized structure
- **Audit Trail**: All tables include createdAt, updatedAt, createdBy, updatedBy
- **Soft Delete**: deletedAt field for logical deletion
- **Performance**: Strategic indexing on frequently queried fields
- **Integrity**: Foreign key constraints with proper cascade rules

### Master Data Tables

#### Categories (Tree Structure)
```sql
Categories {
  id: INT PRIMARY KEY AUTO_INCREMENT
  name: VARCHAR(255) NOT NULL
  code: VARCHAR(100) UNIQUE NOT NULL
  description: TEXT
  parentId: INT (self-reference)
  isActive: BOOLEAN DEFAULT TRUE
  + audit fields
}
```

#### Static Master Data Tables
All following tables share the same structure:
- **Brands**: Product brands/manufacturers
- **Manufacturers**: Manufacturing companies
- **Materials**: Product materials
- **ManufacturingMethods**: Production methods
- **Colors**: Color options (with optional hexCode)
- **Sizes**: Size specifications
- **ProductTypes**: Product classifications
- **PackagingTypes**: Packaging methods

```sql
[MasterDataTable] {
  id: INT PRIMARY KEY AUTO_INCREMENT
  name: VARCHAR(255) NOT NULL
  code: VARCHAR(100) UNIQUE NOT NULL
  description: TEXT
  isActive: BOOLEAN DEFAULT TRUE
  + audit fields
}
```

### Dynamic Attributes System

#### ProductAttributes
```sql
ProductAttributes {
  id: INT PRIMARY KEY AUTO_INCREMENT
  name: VARCHAR(255) NOT NULL
  code: VARCHAR(100) UNIQUE NOT NULL
  dataType: ENUM('TEXT', 'NUMBER')
  description: TEXT
  isRequired: BOOLEAN DEFAULT FALSE
  isActive: BOOLEAN DEFAULT TRUE
  + audit fields
}
```

#### ProductAttributeValues
```sql
ProductAttributeValues {
  id: INT PRIMARY KEY AUTO_INCREMENT
  attributeId: INT FK -> ProductAttributes.id
  value: VARCHAR(500) NOT NULL
  displayOrder: INT DEFAULT 0
  isActive: BOOLEAN DEFAULT TRUE
  + audit fields
}
```

### Product Management

#### Products (Main Entity)
```sql
Products {
  id: INT PRIMARY KEY AUTO_INCREMENT
  name: VARCHAR(255) NOT NULL
  code: VARCHAR(100) UNIQUE NOT NULL
  sku: VARCHAR(100) UNIQUE
  categoryId: INT FK -> Categories.id
  brandId: INT FK -> Brands.id
  manufacturerId: INT FK -> Manufacturers.id
  materialId: INT FK -> Materials.id
  manufacturingMethodId: INT FK -> ManufacturingMethods.id
  colorId: INT FK -> Colors.id
  sizeId: INT FK -> Sizes.id
  productTypeId: INT FK -> ProductTypes.id
  packagingTypeId: INT FK -> PackagingTypes.id
  imageUrl: VARCHAR(1000)
  description: TEXT
  basePrice: DECIMAL(15,2) NOT NULL DEFAULT 0.00
  isActive: BOOLEAN DEFAULT TRUE
  + audit fields
}
```

#### ProductDynamicAttributes
```sql
ProductDynamicAttributes {
  id: INT PRIMARY KEY AUTO_INCREMENT
  productId: INT FK -> Products.id
  attributeId: INT FK -> ProductAttributes.id
  textValue: TEXT
  numberValue: DECIMAL(15,4)
  + audit fields
}
```

### Quotation System

#### Quotations
```sql
Quotations {
  id: INT PRIMARY KEY AUTO_INCREMENT
  quotationNumber: VARCHAR(100) UNIQUE NOT NULL
  customerName: VARCHAR(255) NOT NULL
  companyName: VARCHAR(255) [OPTIONAL]
  phoneNumber: VARCHAR(50) NOT NULL
  quotationDate: DATE NOT NULL
  validUntil: DATE
  status: ENUM('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED')
  totalAmount: DECIMAL(15,2) DEFAULT 0.00
  notes: TEXT
  + audit fields
}
```

#### QuotationItems
```sql
QuotationItems {
  id: INT PRIMARY KEY AUTO_INCREMENT
  quotationId: INT FK -> Quotations.id
  productId: INT FK -> Products.id
  quantity: INT NOT NULL DEFAULT 1
  unitPrice: DECIMAL(15,2) NOT NULL
  totalPrice: DECIMAL(15,2) NOT NULL
  notes: TEXT
  + audit fields
}
```

## Functional Requirements

### 1. Product Management

#### Core Product Features
- **Product CRUD Operations**
  - Create, Read, Update, Delete products
  - Bulk import via Excel files
  - Product code uniqueness validation
  - SKU management (manual input)
  - Image upload and management

#### Master Data Management
- **Static Attributes**: Category, Brand, Manufacturer, Material, Manufacturing Method, Color, Size, Product Type, Packaging Type
- **Category Hierarchy**: Tree structure with parent-child relationships
- **Master Data CRUD**: Full management of all master data entities

#### Dynamic Attributes System
- **Flexible Attributes**: Users can create custom attributes for different industries
- **Data Types**: Support for TEXT and NUMBER data types
- **Attribute Values**: Predefined values for dropdown selections
- **Product Assignment**: Multiple dynamic attributes per product
- **Industry Examples**:
  - Clothing: Size (S, M, L, XL), Material Type, Season
  - Electronics: CPU Type (i3, i5, i7), RAM Size (8GB, 16GB), Storage (256GB, 512GB)
  - Footwear: Shoe Size (39, 40, 41), Width, Style

### 2. Quotation Management

#### Quotation Features
- **Customer Information**: Name, Company (optional), Phone number
- **Quotation Details**: Auto-generated quotation number, date, validity period
- **Product Selection**: Add multiple products with quantities and pricing
- **Status Management**: Draft, Sent, Accepted, Rejected, Expired
- **Total Calculation**: Automatic calculation of line totals and grand total

#### Quotation Workflow
1. Create new quotation with customer details
2. Add products with quantities and unit prices
3. Review and adjust pricing
4. Generate and send quotation
5. Track status and follow up

### 3. Pricing Management

#### Simple Pricing Model
- **Base Price**: Each product has a base price
- **Quotation Pricing**: Prices can be adjusted per quotation item
- **Currency**: Single currency system (configurable)

### 4. Data Import/Export

#### Excel Import
- **Product Import**: Bulk product creation/update via Excel
- **Template Provided**: Standard Excel template with required columns
- **Validation**: Data validation during import process
- **Error Reporting**: Clear error messages for invalid data

#### Export Features
- **Product Export**: Export product lists to Excel
- **Quotation Export**: Export quotations to PDF/Excel

## Technical Specifications

### API Design

#### RESTful Endpoints
```
Products:
GET    /api/products              # List products with filtering/pagination
GET    /api/products/:id          # Get product details
POST   /api/products              # Create product
PUT    /api/products/:id          # Update product
DELETE /api/products/:id          # Soft delete product
POST   /api/products/import       # Bulk import from Excel

Master Data (example for Categories):
GET    /api/categories            # List all categories
GET    /api/categories/tree       # Get category tree structure
POST   /api/categories            # Create category
PUT    /api/categories/:id        # Update category
DELETE /api/categories/:id        # Soft delete category

Dynamic Attributes:
GET    /api/product-attributes    # List attributes
POST   /api/product-attributes    # Create attribute
GET    /api/product-attributes/:id/values  # Get attribute values

Quotations:
GET    /api/quotations            # List quotations
POST   /api/quotations            # Create quotation
PUT    /api/quotations/:id        # Update quotation
GET    /api/quotations/:id/pdf    # Generate PDF
```

### Data Transfer Objects (DTOs)

#### Product DTOs
```typescript
interface CreateProductDto {
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
  dynamicAttributes?: ProductDynamicAttributeDto[];
}

interface ProductDynamicAttributeDto {
  attributeId: number;
  textValue?: string;
  numberValue?: number;
}
```

#### Quotation DTOs
```typescript
interface CreateQuotationDto {
  customerName: string;
  companyName?: string;
  phoneNumber: string;
  quotationDate: string;
  validUntil?: string;
  notes?: string;
  items: QuotationItemDto[];
}

interface QuotationItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
  notes?: string;
}
```

### Frontend Components Structure

```
src/
├── components/
│   ├── common/              # Reusable components
│   ├── products/            # Product-related components
│   ├── quotations/          # Quotation-related components
│   └── master-data/         # Master data management
├── pages/                   # Page components
├── hooks/                   # Custom React hooks
├── services/                # API service calls
├── types/                   # TypeScript interfaces
├── utils/                   # Utility functions
└── constants/               # Application constants
```

### Key React Components
```typescript
// Product Management
<ProductList />              # Product listing with filters
<ProductForm />              # Create/Edit product form
<ProductImport />            # Excel import component
<DynamicAttributeManager />  # Dynamic attributes management

// Quotation Management
<QuotationList />            # Quotation listing
<QuotationForm />            # Create/Edit quotation
<QuotationViewer />          # View quotation details
<QuotationPDF />             # PDF generation component

// Master Data
<CategoryTree />             # Category hierarchy display
<MasterDataManager />        # Generic master data CRUD
```

## Development Guidelines

### Phase 1: Foundation (Weeks 1-2)
1. Set up Nx monorepo structure
2. Configure ESLint, Prettier
3. Set up NestJS backend with TypeORM
4. Create database schema and migrations
5. Set up React frontend with Vite
6. Implement basic authentication

### Phase 2: Master Data Management (Weeks 3-4)
1. Implement master data CRUD operations
2. Create category tree management
3. Develop dynamic attributes system
4. Build master data management UI

### Phase 3: Product Management (Weeks 5-6)
1. Implement product CRUD operations
2. Build product form with dynamic attributes
3. Implement Excel import functionality
4. Create product listing and search

### Phase 4: Quotation System (Weeks 7-8)
1. Implement quotation CRUD operations
2. Build quotation form and management UI
3. Implement PDF generation
4. Add quotation status workflow

### Phase 5: Testing and Deployment (Week 9)
1. Unit and integration testing
2. Performance optimization
3. Production deployment setup
4. Documentation and training

## Quality Assurance

### Testing Strategy
- **Unit Tests**: Jest for both frontend and backend
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Cypress for critical user flows
- **Performance Tests**: Database query optimization

### Code Quality
- **TypeScript**: Strict mode enabled
- **ESLint**: Custom rules for consistency
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for code quality

### Performance Considerations
- **Database Indexing**: Strategic indexes on frequently queried fields
- **API Pagination**: Implement pagination for large datasets
- **Frontend Optimization**: Code splitting and lazy loading
- **Caching**: Implement appropriate caching strategies

## Deployment and DevOps

### Environment Setup
- **Development**: Local development with Docker
- **Staging**: Testing environment
- **Production**: Production deployment

### CI/CD Pipeline
- **Build**: Automated build and testing
- **Deploy**: Automated deployment to staging/production
- **Monitoring**: Application and database monitoring

This comprehensive project plan provides a complete roadmap for building a robust product management and quotation system with flexible architecture for multi-industry use cases.
