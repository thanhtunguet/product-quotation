
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, DatePicker, Card, Row, Col, Table, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { CreateQuotationDto, Quotation, QuotationItemDto, Product, apiClient } from '../../services/api-client';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import ProductSelectionModal from './ProductSelectionModal';

const { TextArea } = Input;

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
  const [productModalVisible, setProductModalVisible] = useState(false);

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

  const handleAddProducts = (newItems: QuotationItemDto[]) => {
    setQuotationItems(prev => [...prev, ...newItems]);
    message.success(`${newItems.length} product(s) added to quotation`);
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
        <div style={{ marginBottom: 16 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setProductModalVisible(true)}
            size="large"
          >
            Add Products
          </Button>
        </div>

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

      <ProductSelectionModal
        visible={productModalVisible}
        onCancel={() => setProductModalVisible(false)}
        onAddProducts={handleAddProducts}
      />
    </Form>
  );
};

export default QuotationForm;
