# Frontend Implementation Guidelines for Gemini

## 🎯 Backend Status & API Integration

### ✅ Backend Ready
The backend developer (Claude) has completed:
- **Complete NestJS backend** with TypeORM and MySQL
- **All database entities** with relationships and validation
- **CRUD APIs** for Categories, Brands, Manufacturers (more to be added)
- **Swagger documentation** available at `http://localhost:3000/api`
- **Type-safe DTOs** for all operations

### 📋 Available Documentation
1. **swagger-spec.json** - Complete OpenAPI specification
2. **API_DOCUMENTATION.md** - Human-readable API docs with examples
3. **FRONTEND_API_CLIENT.ts** - Ready-to-use TypeScript API client

## 🚀 Frontend Implementation Priority

### Phase 1: Foundation Setup (Start Here)
1. **Clean up existing React app** in `/apps/product-quotation/`
2. **Install API client** - Copy `FRONTEND_API_CLIENT.ts` to `src/services/`
3. **Set up basic routing** with React Router
4. **Configure Antd theme** and global styles
5. **Create layout structure** with navigation

### Phase 2: Master Data Management
1. **Categories Management** (Tree structure - most complex)
2. **Brands Management** (Simple CRUD - good starting point)
3. **Other Master Data** (Manufacturers, Materials, Colors, etc.)

### Phase 3: Product Management
4. **Product Attributes** (Dynamic attributes system)
5. **Products CRUD** (Main functionality)
6. **Product Search & Filtering**

### Phase 4: Quotation System
7. **Quotation Management**
8. **PDF Generation**
9. **Dashboard & Reports**

## 🛠️ Frontend Technology Stack

### Required Dependencies
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.29.0",
    "antd": "^5.26.3",
    "react-hook-form": "^7.60.0",
    "axios": "^1.10.0"
  }
}
```

### File Structure to Follow
```
src/
├── components/
│   ├── common/              # Reusable components
│   │   ├── Layout.tsx
│   │   ├── Navigation.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
│   ├── master-data/         # Master data components
│   │   ├── CategoryTree.tsx
│   │   ├── BrandManager.tsx
│   │   └── MasterDataForm.tsx
│   ├── products/            # Product components
│   │   ├── ProductList.tsx
│   │   ├── ProductForm.tsx
│   │   └── ProductSearch.tsx
│   └── quotations/          # Quotation components
│       ├── QuotationList.tsx
│       ├── QuotationForm.tsx
│       └── QuotationPDF.tsx
├── pages/                   # Page components
│   ├── Dashboard.tsx
│   ├── ProductsPage.tsx
│   ├── QuotationsPage.tsx
│   └── MasterDataPage.tsx
├── services/                # API services
│   ├── api-client.ts        # Copy from FRONTEND_API_CLIENT.ts
│   └── index.ts
├── hooks/                   # Custom React hooks
│   ├── useApi.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── types/                   # TypeScript interfaces
│   └── index.ts             # Export all types from api-client
├── utils/                   # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
└── App.tsx                  # Main app component
```

## 📡 API Integration Guide

### 1. Copy the API Client
```bash
cp FRONTEND_API_CLIENT.ts apps/product-quotation/src/services/api-client.ts
```

### 2. Basic Usage Pattern
```typescript
// In a React component
import { apiClient, Category } from '../services/api-client';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        <Table dataSource={categories} />
      )}
    </div>
  );
};
```

### 3. Form Handling with React Hook Form
```typescript
import { useForm } from 'react-hook-form';
import { CreateCategoryDto } from '../services/api-client';

const CategoryForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateCategoryDto>();

  const onSubmit = async (data: CreateCategoryDto) => {
    try {
      await apiClient.createCategory(data);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input 
        {...register('name', { required: 'Name is required' })}
        placeholder="Category Name"
      />
      {errors.name && <span>{errors.name.message}</span>}
      {/* Add other fields */}
    </form>
  );
};
```

## 🎨 UI/UX Guidelines

### Antd Components to Use
1. **Layout**: `Layout, Sider, Header, Content`
2. **Navigation**: `Menu, Breadcrumb`
3. **Tables**: `Table` with sorting, filtering, pagination
4. **Forms**: `Form, Input, Select, DatePicker, InputNumber`
5. **Feedback**: `Message, Notification, Modal, Spin`
6. **Data Display**: `Tree, Card, Descriptions, Tag`

### Color Scheme & Theme
```typescript
// Configure Antd theme
const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
  },
};
```

### Responsive Design
- Use Antd Grid system (`Row, Col`)
- Mobile-first approach
- Breakpoints: `xs, sm, md, lg, xl, xxl`

## 🧩 Component Implementation Strategy

### 1. Start with Brands Management (Simplest)
```typescript
// BrandManager.tsx - Template for all master data
const BrandManager = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // CRUD operations
  const handleCreate = async (data: CreateMasterDataDto) => {
    const newBrand = await apiClient.brands.create(data);
    setBrands(prev => [...prev, newBrand]);
  };

  // Table columns
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Active', dataIndex: 'isActive', key: 'isActive' },
    // Actions column
  ];

  return (
    <div>
      <Button onClick={() => setIsModalVisible(true)}>Add Brand</Button>
      <Table dataSource={brands} columns={columns} />
      <Modal visible={isModalVisible}>
        {/* Form component */}
      </Modal>
    </div>
  );
};
```

### 2. Categories with Tree Structure
```typescript
// CategoryTree.tsx - More complex tree structure
const CategoryTree = () => {
  const [treeData, setTreeData] = useState<Category[]>([]);

  useEffect(() => {
    apiClient.getCategoryTree().then(setTreeData);
  }, []);

  const transformToAntdTree = (categories: Category[]) => {
    return categories.map(cat => ({
      title: cat.name,
      key: cat.id,
      children: transformToAntdTree(cat.children || [])
    }));
  };

  return (
    <Tree
      treeData={transformToAntdTree(treeData)}
      onSelect={(keys) => console.log('Selected:', keys)}
    />
  );
};
```

### 3. Product Form with Dynamic Attributes
```typescript
// ProductForm.tsx - Complex form with relationships
const ProductForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);

  // Load all master data
  useEffect(() => {
    Promise.all([
      apiClient.getCategories(),
      apiClient.brands.getAll(),
      apiClient.getProductAttributes()
    ]).then(([cats, brds, attrs]) => {
      setCategories(cats);
      setBrands(brds);
      setAttributes(attrs);
    });
  }, []);

  return (
    <Form>
      <Form.Item name="name" rules={[{ required: true }]}>
        <Input placeholder="Product Name" />
      </Form.Item>
      
      <Form.Item name="categoryId" rules={[{ required: true }]}>
        <Select placeholder="Select Category">
          {categories.map(cat => (
            <Option key={cat.id} value={cat.id}>{cat.name}</Option>
          ))}
        </Select>
      </Form.Item>

      {/* Dynamic attributes based on selected category */}
      <DynamicAttributesSection attributes={attributes} />
    </Form>
  );
};
```

## 🔧 Custom Hooks

### API Hook Pattern
```typescript
// hooks/useApi.ts
export const useApi = <T>(apiCall: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { data, loading, error, execute };
};

// Usage
const { data: categories, loading, execute: fetchCategories } = useApi(() => 
  apiClient.getCategories()
);
```

## 🚦 Routing Structure

```typescript
// App.tsx
const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />
          <Route path="/quotations" element={<QuotationsPage />} />
          <Route path="/quotations/new" element={<QuotationForm />} />
          <Route path="/master-data/*" element={<MasterDataRoutes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

// Master data sub-routes
const MasterDataRoutes = () => {
  return (
    <Routes>
      <Route path="categories" element={<CategoryManager />} />
      <Route path="brands" element={<BrandManager />} />
      <Route path="manufacturers" element={<ManufacturerManager />} />
      {/* etc */}
    </Routes>
  );
};
```

## 📋 Testing Strategy

### Component Testing with Jest & Testing Library
```typescript
// __tests__/BrandManager.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrandManager } from '../BrandManager';

// Mock API client
jest.mock('../services/api-client');

test('renders brand list', async () => {
  render(<BrandManager />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });
});
```

## 🐛 Error Handling

### Global Error Boundary
```typescript
// components/common/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong."
          extra={<Button onClick={() => window.location.reload()}>Reload</Button>}
        />
      );
    }

    return this.props.children;
  }
}
```

## 🎯 Next Steps for Implementation

### Week 1: Foundation
1. **Clean up the existing React app**
2. **Set up routing and layout**
3. **Integrate API client**
4. **Implement Brands management** (start with simplest)

### Week 2: Master Data
1. **Complete all master data managers**
2. **Implement Categories tree management**
3. **Add search and filtering**

### Week 3: Products
1. **Product listing and search**
2. **Product form with dynamic attributes**
3. **Product image upload**

### Week 4: Quotations
1. **Quotation management**
2. **PDF generation**
3. **Dashboard and reporting**

## 🤝 Coordination with Backend Developer

### What's Ready:
- ✅ Categories API with tree structure
- ✅ Brands API (complete CRUD)
- ✅ Manufacturers API (complete CRUD)
- ✅ Database schema and entities
- ✅ Type-safe DTOs and validation

### Still Needed from Backend:
- 🔄 Product Attributes API
- 🔄 Products API with dynamic attributes
- 🔄 Quotations API
- 🔄 Remaining master data APIs (Materials, Colors, etc.)
- 🔄 Excel import/export
- 🔄 PDF generation

### Communication:
- Use the provided API documentation
- Test endpoints against `http://localhost:3000/api`
- Follow the TypeScript interfaces exactly
- Report any API issues or suggestions

The backend is well-structured and ready to support rapid frontend development. Focus on building reusable components and following the established patterns!