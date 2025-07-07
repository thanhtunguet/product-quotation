
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, DatePicker, Card, Row, Col, Table, Select, InputNumber, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { CreateQuotationDto, Quotation, QuotationItemDto, Product, apiClient } from '../../services/api-client';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

interface QuotationFormProps {
  onSubmit: (data: CreateQuotationDto) => void;
  initialData?: Quotation | null;
}

const QuotationForm: React.FC<QuotationFormProps> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [quotationItems, setQuotationItems] = useState<QuotationItemDto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);

  useEffect(() => {
    loadProducts();
    
    if (initialData) {
      form.setFieldsValue({
        customerName: initialData.customerName,
        companyName: initialData.companyName,
        phoneNumber: initialData.phoneNumber,
        quotationDate: moment(initialData.quotationDate),
        validUntil: initialData.validUntil ? moment(initialData.validUntil) : undefined,
        notes: initialData.notes,
      });
      
      // Convert existing items to QuotationItemDto format
      const items: QuotationItemDto[] = initialData.items?.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes,
      })) || [];
      
      setQuotationItems(items);
    }
  }, [initialData, form]);

  const loadProducts = async () => {
    try {
      const productsData = await apiClient.getProducts();
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Failed to load products:', error);
      // Products API might not be implemented, show empty list
      setProducts([]);
    }
  };

  const addItem = () => {
    if (!selectedProduct || quantity <= 0 || unitPrice < 0) {
      message.error(t('forms.selectProductAndEnterDetails'));
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) {
      message.error(t('forms.selectedProductNotFound'));
      return;
    }

    const newItem: QuotationItemDto = {
      productId: selectedProduct,
      quantity,
      unitPrice,
      notes: '',
    };

    setQuotationItems(prev => [...prev, newItem]);
    setSelectedProduct(undefined);
    setQuantity(1);
    setUnitPrice(0);
  };

  const removeItem = (index: number) => {
    setQuotationItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItemNotes = (index: number, notes: string) => {
    setQuotationItems(prev => 
      prev.map((item, i) => i === index ? { ...item, notes } : item)
    );
  };

  const calculateTotal = () => {
    return quotationItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (quotationItems.length === 0) {
        message.error(t('forms.addAtLeastOneItem'));
        setLoading(false);
        return;
      }

      const quotationData: CreateQuotationDto = {
        customerName: values.customerName,
        companyName: values.companyName || undefined,
        phoneNumber: values.phoneNumber,
        quotationDate: values.quotationDate.format('YYYY-MM-DD'),
        validUntil: values.validUntil ? values.validUntil.format('YYYY-MM-DD') : undefined,
        notes: values.notes || undefined,
        items: quotationItems,
      };

      await onSubmit(quotationData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const itemColumns = [
    {
      title: t('forms.product'),
      dataIndex: 'productId',
      key: 'productId',
      render: (productId: number) => {
        const product = products.find(p => p.id === productId);
        return product ? `${product.name} (${product.code})` : `Product ID: ${productId}`;
      },
    },
    {
      title: t('common.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: t('common.unitPrice'),
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: t('common.total'),
      key: 'total',
      width: 120,
      render: (_: any, record: QuotationItemDto) => `$${(record.quantity * record.unitPrice).toFixed(2)}`,
    },
    {
      title: t('common.notes'),
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string, _: any, index: number) => (
        <Input.TextArea
          value={notes}
          onChange={(e) => updateItemNotes(index, e.target.value)}
          placeholder={t('forms.itemNotes')}
          rows={1}
          style={{ minWidth: 150 }}
        />
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => removeItem(index)}
          type="link"
          size="small"
          danger
        />
      ),
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        quotationDate: moment(),
        validUntil: moment().add(30, 'days'),
      }}
    >
      <Card title={t('sections.customerInformation')} style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="customerName"
              label={t('forms.customerName')}
              rules={[{ required: true, message: t('forms.customerNameRequired') }]}
            >
              <Input placeholder={t('forms.enterCustomerName')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="companyName"
              label={t('forms.companyName')}
            >
              <Input placeholder={t('forms.enterCompanyName')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phoneNumber"
              label={t('forms.phoneNumber')}
              rules={[{ required: true, message: t('forms.phoneRequired') }]}
            >
              <Input placeholder={t('forms.enterPhoneNumber')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="quotationDate"
              label={t('forms.quotationDate')}
              rules={[{ required: true, message: t('forms.quotationDateRequired') }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="validUntil"
              label={t('quotations.validUntil')}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notes"
          label={t('common.notes')}
        >
          <TextArea placeholder={t('forms.enterQuotationNotes')} rows={3} />
        </Form.Item>
      </Card>

      <Card title={t('sections.quotationItems')} style={{ marginBottom: 16 }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            {t('forms.noProductsAvailable')}
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <Row gutter={16} align="middle">
              <Col span={8}>
                <Select
                  placeholder={t('forms.selectProduct')}
                  value={selectedProduct}
                  onChange={setSelectedProduct}
                  style={{ width: '100%' }}
                  showSearch
                  filterOption={(input, option) =>
                    option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
                  }
                >
                  {products.map(product => (
                    <Option key={product.id} value={product.id}>
                      {product.name} - ${product.basePrice?.toFixed(2) || '0.00'}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={4}>
                <InputNumber
                  placeholder={t('forms.qty')}
                  value={quantity}
                  onChange={(value) => setQuantity(value || 1)}
                  min={1}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  placeholder={t('common.unitPrice')}
                  value={unitPrice}
                  onChange={(value) => setUnitPrice(value || 0)}
                  min={0}
                  step={0.01}
                  precision={2}
                  style={{ width: '100%' }}
                  addonBefore="$"
                />
              </Col>
              <Col span={4}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={addItem}
                  style={{ width: '100%' }}
                >
                  {t('forms.addItem')}
                </Button>
              </Col>
            </Row>
          </div>
        )}

        <Table
          dataSource={quotationItems}
          columns={itemColumns}
          pagination={false}
          rowKey={(record, index) => `${record.productId}-${index}`}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <strong>{t('common.total')}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong>${calculateTotal().toFixed(2)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} colSpan={2} />
            </Table.Summary.Row>
          )}
        />
      </Card>

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space>
          <Button onClick={() => form.resetFields()}>
            {t('common.reset')}
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialData ? t('forms.updateQuotation') : t('forms.createQuotation')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default QuotationForm;
