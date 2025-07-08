import { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Typography, Space, Tag, message, Popconfirm, Alert, Card, Input, Radio, List, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, FileExcelOutlined, DownloadOutlined, UnorderedListOutlined, TableOutlined } from '@ant-design/icons';
import { apiClient, Product, CreateProductDto, Category, Brand, Manufacturer } from '../../services/api-client';
import ProductForm from './ProductForm';
import { ExcelImportModal } from './ExcelImportModal';
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
  const [isExcelImportModalVisible, setIsExcelImportModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'pagination' | 'virtual'>('pagination');
  const [listHeight, setListHeight] = useState(600);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const calculateListHeight = () => {
    if (containerRef.current && viewMode === 'virtual') {
      const containerRect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const availableHeight = windowHeight - containerRect.top - 40; // 40px bottom padding
      setListHeight(Math.max(400, availableHeight)); // Minimum 400px
    }
  };

  useEffect(() => {
    fetchMasterData();
    fetchProducts();
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    calculateListHeight();
    
    const handleResize = () => {
      calculateListHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === 'virtual') {
      // Recalculate height when switching to virtual mode
      setTimeout(calculateListHeight, 100);
    }
  }, [viewMode]);

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
      render: (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return `$${(numPrice || 0).toFixed(2)}`;
      },
      sorter: (a: Product, b: Product) => {
        const priceA = typeof a.basePrice === 'string' ? parseFloat(a.basePrice) : (a.basePrice || 0);
        const priceB = typeof b.basePrice === 'string' ? parseFloat(b.basePrice) : (b.basePrice || 0);
        return priceA - priceB;
      },
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
        <div className="mb-4 flex justify-between items-center">
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

        <Card className="mt-4">
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
    <div ref={containerRef}>
      <div className="mb-4 flex justify-between items-center">
        <Title level={2}>{t('products.management')}</Title>
        <Space>
          <Search
            placeholder={t('products.searchPlaceholder')}
            allowClear
            className="w-64"
            onSearch={setSearchTerm}
            onChange={(e) => !e.target.value && setSearchTerm('')}
          />
          <Button 
            icon={<FileExcelOutlined />}
            onClick={() => setIsExcelImportModalVisible(true)}
          >
            {t('excel.importExcel')}
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            {t('products.addProduct')}
          </Button>
        </Space>
      </div>
      
      <div className="mb-4 flex justify-end">
        <Radio.Group 
          value={viewMode} 
          onChange={(e) => setViewMode(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="pagination">
            <TableOutlined /> Pagination
          </Radio.Button>
          <Radio.Button value="virtual">
            <UnorderedListOutlined /> Virtual Scroll
          </Radio.Button>
        </Radio.Group>
      </div>
      
      {viewMode === 'pagination' ? (
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
      ) : (
        <List
          loading={loading}
          dataSource={products}
          pagination={false}
          className="overflow-auto"
          style={{ height: `${listHeight}px` }}
          renderItem={(product: Product) => (
            <List.Item
              key={product.id}
              actions={[
                <Button
                  key="edit"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(product)}
                  type="link"
                  size="small"
                  disabled={!!apiError}
                >
                  {t('common.edit')}
                </Button>,
                <Popconfirm
                  key="delete"
                  title={t('confirmations.deleteProduct')}
                  onConfirm={() => handleDelete(product.id)}
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
              ]}
            >
              <List.Item.Meta
                avatar={
                  product.imageUrl ? (
                    <Avatar src={product.imageUrl} size={64} />
                  ) : (
                    <Avatar size={64} className="bg-orange-500">
                      {product.name.charAt(0).toUpperCase()}
                    </Avatar>
                  )
                }
                title={
                  <Space>
                    <span className="font-bold">{product.name}</span>
                    <Tag color={product.isActive ? 'green' : 'red'}>
                      {product.isActive ? t('common.active') : t('common.inactive')}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    <div><strong>{t('common.code')}:</strong> {product.code}</div>
                    {product.sku && <div><strong>{t('common.sku')}:</strong> {product.sku}</div>}
                    <div><strong>{t('common.category')}:</strong> {product.category?.name || t('common.noData')}</div>
                    <div><strong>{t('common.brand')}:</strong> {product.brand?.name || t('common.noData')}</div>
                    <div><strong>{t('common.price')}:</strong> ${(typeof product.basePrice === 'string' ? parseFloat(product.basePrice) : (product.basePrice || 0)).toFixed(2)}</div>
                    {product.description && <div className="mt-2 text-gray-600">{product.description}</div>}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
      
      <Modal 
        title={editingProduct ? t('products.editProduct') : t('products.addProduct')} 
        open={isModalVisible} 
        onCancel={handleModalClose} 
        footer={null}
        width={800}
        className="top-5"
      >
        <ProductForm 
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          initialData={editingProduct}
          categories={categories}
          brands={brands}
          manufacturers={manufacturers}
        />
      </Modal>

      <ExcelImportModal
        visible={isExcelImportModalVisible}
        onClose={() => setIsExcelImportModalVisible(false)}
        onImportSuccess={() => {
          setIsExcelImportModalVisible(false);
          fetchProducts();
        }}
      />
    </div>
  );
};

export default ProductManager;