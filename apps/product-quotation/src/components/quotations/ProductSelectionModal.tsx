import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  InputNumber,
  message,
  Modal,
  Space,
  Table,
  Tag,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  apiClient,
  Product,
  QuotationItemDto,
} from '../../services/api-client';

const { Search } = Input;

interface ProductSelectionItem extends Product {
  selected: boolean;
  quantity: number;
  unitPrice: number;
}

interface ProductSelectionModalProps {
  visible: boolean;
  onCancel: () => void;
  onAddProducts: (items: QuotationItemDto[]) => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  visible,
  onCancel,
  onAddProducts,
}) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<ProductSelectionItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<
    ProductSelectionItem[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (visible) {
      loadProducts();
      setCurrentPage(1);
      setSelectedRowKeys([]);
      setSearchText('');
    }
  }, [visible]);

  useEffect(() => {
    // Filter products based on search text
    if (searchText.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchText.toLowerCase()) ||
          product.code.toLowerCase().includes(searchText.toLowerCase()) ||
          product.category?.name
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          product.brand?.name?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchText, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await apiClient.getProducts();

      if (Array.isArray(productsData)) {
        const productsWithSelection: ProductSelectionItem[] = productsData.map(
          (product) => ({
            ...product,
            selected: false,
            quantity: 1,
            unitPrice: parseFloat(product.basePrice || '0'),
          })
        );
        setProducts(productsWithSelection);
        setFilteredProducts(productsWithSelection);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      message.error(
        'Failed to load products. Products API might not be implemented yet.'
      );
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, quantity: quantity || 1 }
        : product
    );
    setProducts(updatedProducts);
  };

  const updateProductPrice = (productId: number, unitPrice: number) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, unitPrice: unitPrice || 0 }
        : product
    );
    setProducts(updatedProducts);
  };

  const handleAddSelectedProducts = () => {
    const selectedProducts = filteredProducts.filter((product) =>
      selectedRowKeys.includes(product.id)
    );

    if (selectedProducts.length === 0) {
      message.warning('Please select at least one product.');
      return;
    }

    const quotationItems: QuotationItemDto[] = selectedProducts.map(
      (product) => ({
        productId: product.id,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        notes: '',
      })
    );

    onAddProducts(quotationItems);
    onCancel();

    // Reset selection
    setSelectedRowKeys([]);
    setSearchText('');
  };

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const columns = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record: ProductSelectionItem) => (
        <div>
          <div className="font-bold">{name}</div>
          <div className="text-xs text-gray-600">{record.code}</div>
        </div>
      ),
    },
    {
      title: t('common.category'),
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: any) => category?.name || '-',
    },
    {
      title: t('common.brand'),
      dataIndex: 'brand',
      key: 'brand',
      width: 100,
      render: (brand: any) => brand?.name || '-',
    },
    {
      title: t('common.basePrice'),
      dataIndex: 'basePrice',
      key: 'basePrice',
      width: 100,
      render: (price: string) => `$${parseFloat(price || '0').toFixed(2)}`,
    },
    {
      title: t('common.quantity'),
      key: 'quantity',
      width: 100,
      render: (_: any, record: ProductSelectionItem) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => updateProductQuantity(record.id, value || 1)}
          className="w-full"
          disabled={!selectedRowKeys.includes(record.id)}
        />
      ),
    },
    {
      title: t('common.unitPrice'),
      key: 'unitPrice',
      width: 120,
      render: (_: any, record: ProductSelectionItem) => (
        <InputNumber
          min={0}
          step={0.01}
          precision={2}
          value={record.unitPrice}
          onChange={(value) => updateProductPrice(record.id, value || 0)}
          className="w-full"
          addonBefore="$"
          disabled={!selectedRowKeys.includes(record.id)}
        />
      ),
    },
    {
      title: t('common.total'),
      key: 'total',
      width: 100,
      render: (_: any, record: ProductSelectionItem) => {
        const total = record.quantity * record.unitPrice;
        return (
          <Tag color={selectedRowKeys.includes(record.id) ? 'blue' : 'default'}>
            ${total.toFixed(2)}
          </Tag>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    onSelect: (record: ProductSelectionItem, selected: boolean) => {
      if (selected) {
        // When selecting, set default values if needed
        updateProductQuantity(record.id, record.quantity || 1);
        updateProductPrice(
          record.id,
          record.unitPrice || parseFloat(record.basePrice || '0')
        );
      }
    },
  };

  const selectedTotal = filteredProducts
    .filter((product) => selectedRowKeys.includes(product.id))
    .reduce(
      (total, product) => total + product.quantity * product.unitPrice,
      0
    );

  return (
    <Modal
      title={
        <Space>
          <PlusOutlined />
          {t('forms.selectProduct')}
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t('common.cancel')}
        </Button>,
        <Button
          key="add"
          type="primary"
          onClick={handleAddSelectedProducts}
          disabled={selectedRowKeys.length === 0}
        >
          {t('forms.addItem')} ({selectedRowKeys.length})
          {selectedRowKeys.length > 0 && ` - $${selectedTotal.toFixed(2)}`}
        </Button>,
      ]}
    >
      <div className="mb-4">
        <Search
          placeholder="Search products by name, code, category, or brand..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full"
          allowClear
        />
      </div>

      {products.length === 0 && !loading ? (
        <div className="text-center p-10 text-gray-400">
          <div>{t('forms.noProductsAvailable')}</div>
          <div className="text-xs mt-2">
            The Products API needs to be implemented first.
          </div>
        </div>
      ) : (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} products`,
            onChange: handlePaginationChange,
            onShowSizeChange: handlePaginationChange,
          }}
          scroll={{ y: 400 }}
          size="small"
        />
      )}

      {selectedRowKeys.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <Space split="|">
            <span>
              <strong>Selected:</strong> {selectedRowKeys.length} product(s)
            </span>
            <span>
              <strong>Total:</strong> ${selectedTotal.toFixed(2)}
            </span>
          </Space>
        </div>
      )}
    </Modal>
  );
};

export default ProductSelectionModal;
