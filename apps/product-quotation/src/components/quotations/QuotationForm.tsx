
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, DatePicker, Card, Row, Col, Table, Select, InputNumber, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { CreateQuotationDto, Quotation, QuotationItemDto, Product, apiClient } from '../../services/api-client';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

interface QuotationFormProps {
  onSubmit: (data: CreateQuotationDto) => void;
  initialData?: Quotation | null;
}

const QuotationForm: React.FC<QuotationFormProps> = ({ onSubmit, initialData }) => {
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
      message.error('Please select a product and enter valid quantity and price');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) {
      message.error('Selected product not found');
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
        message.error('Please add at least one item to the quotation');
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
      title: 'Product',
      dataIndex: 'productId',
      key: 'productId',
      render: (productId: number) => {
        const product = products.find(p => p.id === productId);
        return product ? `${product.name} (${product.code})` : `Product ID: ${productId}`;
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Total',
      key: 'total',
      width: 120,
      render: (_: any, record: QuotationItemDto) => `$${(record.quantity * record.unitPrice).toFixed(2)}`,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string, _: any, index: number) => (
        <Input.TextArea
          value={notes}
          onChange={(e) => updateItemNotes(index, e.target.value)}
          placeholder="Item notes..."
          rows={1}
          style={{ minWidth: 150 }}
        />
      ),
    },
    {
      title: 'Actions',
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
      <Card title="Customer Information" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="customerName"
              label="Customer Name"
              rules={[{ required: true, message: 'Customer name is required' }]}
            >
              <Input placeholder="Enter customer name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="companyName"
              label="Company Name"
            >
              <Input placeholder="Enter company name (optional)" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: 'Phone number is required' }]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="quotationDate"
              label="Quotation Date"
              rules={[{ required: true, message: 'Quotation date is required' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="validUntil"
              label="Valid Until"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <TextArea placeholder="Enter quotation notes" rows={3} />
        </Form.Item>
      </Card>

      <Card title="Quotation Items" style={{ marginBottom: 16 }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            No products available. The Products API needs to be implemented first.
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <Row gutter={16} align="middle">
              <Col span={8}>
                <Select
                  placeholder="Select product"
                  value={selectedProduct}
                  onChange={setSelectedProduct}
                  style={{ width: '100%' }}
                  showSearch
                  filterOption={(input, option) =>
                    option?.children?.toString().toLowerCase().includes(input.toLowerCase())
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
                  placeholder="Qty"
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  placeholder="Unit Price"
                  value={unitPrice}
                  onChange={setUnitPrice}
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
                  Add Item
                </Button>
              </Col>
            </Row>
          </div>
        )}

        <Table
          dataSource={quotationItems}
          columns={itemColumns}
          pagination={false}
          rowKey={(_, index) => index?.toString() || '0'}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <strong>Total</strong>
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
            Reset
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialData ? 'Update Quotation' : 'Create Quotation'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default QuotationForm;
