// Frontend API Client Interfaces and Types
// Copy this to your frontend project and adapt as needed

// Base API configuration
export const API_BASE_URL = 'http://localhost:3000/api';

// Common interfaces
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

// Master Data Types
export interface MasterDataEntity extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export interface CreateMasterDataDto {
  name: string;
  code: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateMasterDataDto {
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}

// Category Types
export interface Category extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  parentId?: number;
  isActive: boolean;
  parent?: Category;
  children: Category[];
}

export interface CreateCategoryDto {
  name: string;
  code: string;
  description?: string;
  parentId?: number;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  code?: string;
  description?: string;
  parentId?: number;
  isActive?: boolean;
}

// Specific Master Data Types
export type Brand = MasterDataEntity;
export type Manufacturer = MasterDataEntity;
export type Material = MasterDataEntity;
export type ManufacturingMethod = MasterDataEntity;
export type Size = MasterDataEntity;
export type ProductType = MasterDataEntity;
export type PackagingType = MasterDataEntity;

export interface Color extends MasterDataEntity {
  hexCode?: string;
}

// Product Attribute Types
export enum AttributeDataType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
}

export interface ProductAttribute extends BaseEntity {
  name: string;
  code: string;
  dataType: AttributeDataType;
  description?: string;
  isRequired: boolean;
  isActive: boolean;
  values: ProductAttributeValue[];
}

export interface ProductAttributeValue extends BaseEntity {
  attributeId: number;
  value: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CreateProductAttributeDto {
  name: string;
  code: string;
  dataType: AttributeDataType;
  description?: string;
  isRequired?: boolean;
  isActive?: boolean;
}

// Product Types
export interface ProductDynamicAttributeDto {
  attributeId: number;
  textValue?: string;
  numberValue?: number;
}

export interface Product extends BaseEntity {
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

export interface ProductDynamicAttribute extends BaseEntity {
  productId: number;
  attributeId: number;
  textValue?: string;
  numberValue?: number;
  attribute: ProductAttribute;
}

export interface CreateProductDto {
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
  basePrice?: number;
  isActive?: boolean;
  dynamicAttributes?: ProductDynamicAttributeDto[];
}

// Quotation Types
export enum QuotationStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export interface QuotationItem extends BaseEntity {
  quotationId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  product: Product;
}

export interface Quotation extends BaseEntity {
  quotationNumber: string;
  customerName: string;
  companyName?: string;
  phoneNumber: string;
  quotationDate: string;
  validUntil?: string;
  status: QuotationStatus;
  totalAmount: number;
  notes?: string;
  items: QuotationItem[];
}

export interface QuotationItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface CreateQuotationDto {
  customerName: string;
  companyName?: string;
  phoneNumber: string;
  quotationDate: string;
  validUntil?: string;
  notes?: string;
  items: QuotationItemDto[];
}

// API Client Class
export class ProductQuotationApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Categories API
  async getCategories(search?: string): Promise<Category[]> {
    const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/categories${queryParam}`);
  }

  async getCategoryTree(): Promise<Category[]> {
    return this.request('/categories/tree');
  }

  async getCategory(id: number): Promise<Category> {
    return this.request(`/categories/${id}`);
  }

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: number, data: UpdateCategoryDto): Promise<Category> {
    return this.request(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: number): Promise<void> {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Generic Master Data API methods
  private createMasterDataMethods<T extends MasterDataEntity>(endpoint: string) {
    return {
      getAll: async (search?: string): Promise<T[]> => {
        const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
        return this.request(`/${endpoint}${queryParam}`);
      },
      getById: async (id: number): Promise<T> => {
        return this.request(`/${endpoint}/${id}`);
      },
      create: async (data: CreateMasterDataDto): Promise<T> => {
        return this.request(`/${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },
      update: async (id: number, data: UpdateMasterDataDto): Promise<T> => {
        return this.request(`/${endpoint}/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
      },
      delete: async (id: number): Promise<void> => {
        return this.request(`/${endpoint}/${id}`, {
          method: 'DELETE',
        });
      },
    };
  }

  // Master Data APIs
  brands = this.createMasterDataMethods<Brand>('brands');
  manufacturers = this.createMasterDataMethods<Manufacturer>('manufacturers');
  materials = this.createMasterDataMethods<Material>('materials');
  manufacturingMethods = this.createMasterDataMethods<ManufacturingMethod>('manufacturing-methods');
  colors = this.createMasterDataMethods<Color>('colors');
  sizes = this.createMasterDataMethods<Size>('sizes');
  productTypes = this.createMasterDataMethods<ProductType>('product-types');
  packagingTypes = this.createMasterDataMethods<PackagingType>('packaging-types');

  // Products API
  async getProducts(search?: string): Promise<Product[]> {
    const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/products${queryParam}`);
  }

  async getProduct(id: number): Promise<Product> {
    return this.request(`/products/${id}`);
  }

  async createProduct(data: CreateProductDto): Promise<Product> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: number, data: Partial<CreateProductDto>): Promise<Product> {
    return this.request(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: number): Promise<void> {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Quotations API
  async getQuotations(search?: string): Promise<Quotation[]> {
    const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/quotations${queryParam}`);
  }

  async getQuotation(id: number): Promise<Quotation> {
    return this.request(`/quotations/${id}`);
  }

  async createQuotation(data: CreateQuotationDto): Promise<Quotation> {
    return this.request('/quotations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateQuotation(id: number, data: Partial<CreateQuotationDto>): Promise<Quotation> {
    return this.request(`/quotations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteQuotation(id: number): Promise<void> {
    return this.request(`/quotations/${id}`, {
      method: 'DELETE',
    });
  }

  // Product Attributes API
  async getProductAttributes(search?: string): Promise<ProductAttribute[]> {
    const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/product-attributes${queryParam}`);
  }

  async getProductAttribute(id: number): Promise<ProductAttribute> {
    return this.request(`/product-attributes/${id}`);
  }

  async createProductAttribute(data: CreateProductAttributeDto): Promise<ProductAttribute> {
    return this.request('/product-attributes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProductAttributeValues(attributeId: number): Promise<ProductAttributeValue[]> {
    return this.request(`/product-attributes/${attributeId}/values`);
  }
}

// Export default instance
export const apiClient = new ProductQuotationApiClient();

// Example usage in React components:
/*
import { apiClient, Category, CreateCategoryDto } from './api-client';

// In a React component
const [categories, setCategories] = useState<Category[]>([]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };
  
  fetchCategories();
}, []);

const handleCreateCategory = async (categoryData: CreateCategoryDto) => {
  try {
    const newCategory = await apiClient.createCategory(categoryData);
    setCategories(prev => [...prev, newCategory]);
  } catch (error) {
    console.error('Failed to create category:', error);
  }
};
*/