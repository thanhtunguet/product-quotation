import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Typography, Space, Tag, message, Popconfirm, Alert, Card, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { apiClient, Product, CreateProductDto, UpdateProductDto, Category, Brand, Manufacturer } from '../../services/api-client';
import ProductForm from './ProductForm';

const { Title } = Typography;
const { Search } = Input;

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Master data for dropdowns
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

  const fetchMasterData = async () => {
    try {
      const [categoriesData, brandsData, manufacturersData] = await Promise.all([
        apiClient.getCategories(),
        apiClient.brands.getAll(),
        apiClient.manufacturers.getAll(),
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
      setManufacturers(manufacturersData);
    } catch (error) {
      console.error('Failed to fetch master data:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setApiError(null);
    
    try {
      const result = await apiClient.getProducts(searchTerm || undefined);
      setProducts(result);
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      if (error.message?.includes('fetch') || error.message?.includes('API Error: 404')) {
        setApiError('Products API is not yet implemented in the backend. This feature will be available once the backend developer implements the products endpoints.');
      } else {
        setApiError(`Failed to fetch products: ${error.message}`);
      }
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
    fetchProducts();
  }, [searchTerm]);

  const handleCreate = async (formData: CreateProductDto) => {
    try {
      const newProduct = await apiClient.createProduct(formData);
      setProducts(prev => [...prev, newProduct]);
      setIsModalVisible(false);
      message.success('Product created successfully');
    } catch (error: any) {
      console.error('Failed to create product:', error);
      if (error.message?.includes('fetch') || error.message?.includes('API Error: 404')) {
        message.error('Products API is not yet implemented in the backend');
      } else {
        message.error('Failed to create product');
      }
    }
  };

  const handleUpdate = async (formData: Partial<CreateProductDto>) => {
    if (!editingProduct) return;
    
    try {
      const updatedProduct = await apiClient.updateProduct(editingProduct.id, formData);
      setProducts(prev => prev.map(product => 
        product.id === editingProduct.id ? updatedProduct : product
      ));
      setIsModalVisible(false);
      setEditingProduct(null);
      message.success('Product updated successfully');
    } catch (error: any) {
      console.error('Failed to update product:', error);
      if (error.message?.includes('fetch') || error.message?.includes('API Error: 404')) {
        message.error('Products API is not yet implemented in the backend');
      } else {
        message.error('Failed to update product');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
      message.success('Product deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete product:', error);
      if (error.message?.includes('fetch') || error.message?.includes('API Error: 404')) {
        message.error('Products API is not yet implemented in the backend');
      } else {
        message.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      render: (text: string) => text || 'No category',
    },
    {
      title: 'Brand',
      dataIndex: ['brand', 'name'],
      key: 'brand',
      render: (text: string) => text || 'No brand',
    },
    {
      title: 'Price',
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: (price: number) => `$${price?.toFixed(2) || '0.00'}`,
      sorter: (a: Product, b: Product) => (a.basePrice || 0) - (b.basePrice || 0),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value: any, record: Product) => record.isActive === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Product) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
            size="small"
            disabled={!!apiError}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            disabled={!!apiError}
          >
            <Button
              icon={<DeleteOutlined />}
              type="link"
              size="small"
              danger
              disabled={!!apiError}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (apiError) {
    return (
      <div>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>Product Management</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            disabled
          >
            Add Product
          </Button>
        </div>
        
        <Alert
          message="Products API Not Implemented"
          description={apiError}
          type="warning"
          icon={<ExclamationCircleOutlined />}
          showIcon
          action={
            <Button size="small" onClick={fetchProducts}>
              Retry
            </Button>
          }
        />

        <Card style={{ marginTop: 16 }}>
          <Title level={4}>What's Available</Title>
          <p>While the Products API is being implemented, you can still manage:</p>
          <ul>
            <li><strong>Categories:</strong> Create hierarchical product categories</li>
            <li><strong>Brands:</strong> Manage product brands</li>
            <li><strong>Manufacturers:</strong> Manage manufacturing partners</li>
            <li><strong>Other Master Data:</strong> Materials, Colors, Sizes, etc.</li>
          </ul>
          <p>Once the backend team implements the Products API, this page will be fully functional.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Product Management</Title>
        <Space>
          <Search
            placeholder="Search products..."
            allowClear
            style={{ width: 250 }}
            onSearch={setSearchTerm}
            onChange={(e) => !e.target.value && setSearchTerm('')}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Add Product
          </Button>
        </Space>
      </div>
      
      <Table 
        dataSource={products} 
        columns={columns} 
        loading={loading}
        rowKey="id"
        pagination={{ 
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 'max-content' }}
      />
      
      <Modal 
        title={editingProduct ? 'Edit Product' : 'Add Product'} 
        open={isModalVisible} 
        onCancel={handleModalClose} 
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <ProductForm 
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          initialData={editingProduct}
          categories={categories}
          brands={brands}
          manufacturers={manufacturers}
        />
      </Modal>
    </div>
  );
};

export default ProductManager;