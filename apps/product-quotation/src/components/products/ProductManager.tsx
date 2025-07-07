import { useState, useEffect } from 'react';
import { Table, Button, Modal, Typography, Space, Tag, message, Popconfirm, Alert, Card, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { apiClient, Product, CreateProductDto, Category, Brand, Manufacturer } from '../../services/api-client';
import ProductForm from './ProductForm';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { Search } = Input;

const ProductManager = () => {
  const { t } = useTranslation();
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
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setBrands(Array.isArray(brandsData) ? brandsData : []);
      setManufacturers(Array.isArray(manufacturersData) ? manufacturersData : []);
    } catch (error) {
      console.error('Failed to fetch master data:', error);
      setCategories([]);
      setBrands([]);
      setManufacturers([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setApiError(null);
    
    try {
      const result = await apiClient.getProducts(searchTerm || undefined);
      setProducts(Array.isArray(result) ? result : []);
    } catch (error: unknown) {
      console.error('Failed to fetch products:', error);
      setProducts([]); // Set to empty array on error
      if (error instanceof Error && (error.message?.includes('fetch') || error.message?.includes('API Error: 404'))) {
        setApiError(t('products.apiNotImplementedMessage'));
      } else {
        setApiError(`${t('products.fetchError')}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      message.error(t('products.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
    fetchProducts();
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (formData: CreateProductDto) => {
    try {
      const newProduct = await apiClient.createProduct(formData);
      setProducts(prev => [...prev, newProduct]);
      setIsModalVisible(false);
      message.success(t('products.createSuccess'));
    } catch (error: unknown) {
      console.error('Failed to create product:', error);
      if (error instanceof Error && (error.message?.includes('fetch') || error.message?.includes('API Error: 404'))) {
        message.error(t('products.apiNotImplemented'));
      } else {
        message.error(t('products.createError'));
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
      message.success(t('products.updateSuccess'));
    } catch (error: unknown) {
      console.error('Failed to update product:', error);
      if (error instanceof Error && (error.message?.includes('fetch') || error.message?.includes('API Error: 404'))) {
        message.error(t('products.apiNotImplemented'));
      } else {
        message.error(t('products.updateError'));
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
      message.success(t('products.deleteSuccess'));
    } catch (error: unknown) {
      console.error('Failed to delete product:', error);
      if (error instanceof Error && (error.message?.includes('fetch') || error.message?.includes('API Error: 404'))) {
        message.error(t('products.apiNotImplemented'));
      } else {
        message.error(t('products.deleteError'));
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
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
    },
    {
      title: t('common.code'),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: t('common.sku'),
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: t('common.category'),
      dataIndex: ['category', 'name'],
      key: 'category',
      render: (text: string) => text || t('common.noData'),
    },
    {
      title: t('common.brand'),
      dataIndex: ['brand', 'name'],
      key: 'brand',
      render: (text: string) => text || t('common.noData'),
    },
    {
      title: t('common.price'),
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: (price: number) => `$${price?.toFixed(2) || '0.00'}`,
      sorter: (a: Product, b: Product) => (a.basePrice || 0) - (b.basePrice || 0),
    },
    {
      title: t('common.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? t('common.active') : t('common.inactive')}
        </Tag>
      ),
      filters: [
        { text: t('common.active'), value: true },
        { text: t('common.inactive'), value: false },
      ],
      onFilter: (value: boolean | React.Key, record: Product) => record.isActive === value,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
            size="small"
            disabled={!!apiError}
          >
            {t('common.edit')}
          </Button>
          <Popconfirm
            title={t('confirmations.deleteProduct')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
            disabled={!!apiError}
          >
            <Button
              icon={<DeleteOutlined />}
              type="link"
              size="small"
              danger
              disabled={!!apiError}
            >
              {t('common.delete')}
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
          <Title level={2}>{t('products.management')}</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            disabled
          >
            {t('products.addProduct')}
          </Button>
        </div>
        
        <Alert
          message={t('products.apiNotImplemented')}
          description={apiError}
          type="warning"
          icon={<ExclamationCircleOutlined />}
          showIcon
          action={
            <Button size="small" onClick={fetchProducts}>
              {t('common.retry')}
            </Button>
          }
        />

        <Card style={{ marginTop: 16 }}>
          <Title level={4}>{t('products.whatsAvailable')}</Title>
          <p>{t('products.availableFeatures')}</p>
          <ul>
            <li><strong>{t('masterData.categories')}:</strong> {t('products.categoriesFeature')}</li>
            <li><strong>{t('masterData.brands')}:</strong> {t('products.brandsFeature')}</li>
            <li><strong>{t('masterData.manufacturers')}:</strong> {t('products.manufacturersFeature')}</li>
            <li><strong>{t('masterData.materials')}:</strong> {t('products.otherMasterDataFeature')}</li>
          </ul>
          <p>{t('products.futureMessage')}</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>{t('products.management')}</Title>
        <Space>
          <Search
            placeholder={t('products.searchPlaceholder')}
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
            {t('products.addProduct')}
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
          showTotal: (total, range) => `${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('common.items')}`,
        }}
        scroll={{ x: 'max-content' }}
      />
      
      <Modal 
        title={editingProduct ? t('products.editProduct') : t('products.addProduct')} 
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