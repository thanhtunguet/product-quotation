import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Typography, Space, Tag, message, Popconfirm, Alert, Card, Input, DatePicker, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined, FilePdfOutlined } from '@ant-design/icons';
import { apiClient, Quotation, CreateQuotationDto, QuotationStatus } from '../../services/api-client';
import QuotationForm from './QuotationForm';
import moment from 'moment';

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const QuotationManager = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchQuotations = async () => {
    setLoading(true);
    setApiError(null);
    
    try {
      const result = await apiClient.getQuotations(searchTerm || undefined);
      setQuotations(Array.isArray(result) ? result : []);
    } catch (error: any) {
      console.error('Failed to fetch quotations:', error);
      setQuotations([]); // Set to empty array on error
      if (error.message?.includes('fetch') || error.message?.includes('API Error: 404')) {
        setApiError('Quotations API is not yet implemented in the backend. This feature will be available once the backend developer implements the quotations endpoints.');
      } else {
        setApiError(`Failed to fetch quotations: ${error.message}`);
      }
      message.error('Failed to fetch quotations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [searchTerm]);

  const handleCreate = async (formData: CreateQuotationDto) => {
    try {
      const newQuotation = await apiClient.createQuotation(formData);
      setQuotations(prev => [...prev, newQuotation]);
      setIsModalVisible(false);
      message.success('Quotation created successfully');
    } catch (error: any) {
      console.error('Failed to create quotation:', error);
      if (error.message?.includes('fetch') || error.message?.includes('API Error: 404')) {
        message.error('Quotations API is not yet implemented in the backend');
      } else {
        message.error('Failed to create quotation');
      }
    }
  };

  const handleUpdate = async (formData: Partial<CreateQuotationDto>) => {
    if (!editingQuotation) return;
    
    try {
      const updatedQuotation = await apiClient.updateQuotation(editingQuotation.id, formData);
      setQuotations(prev => prev.map(quotation => 
        quotation.id === editingQuotation.id ? updatedQuotation : quotation
      ));
      setIsModalVisible(false);
      setEditingQuotation(null);
      message.success('Quotation updated successfully');
    } catch (error: any) {
      console.error('Failed to update quotation:', error);
      if (error.message?.includes('fetch') || error.message?.includes('API Error: 404')) {
        message.error('Quotations API is not yet implemented in the backend');
      } else {
        message.error('Failed to update quotation');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteQuotation(id);
      setQuotations(prev => prev.filter(quotation => quotation.id !== id));
      message.success('Quotation deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete quotation:', error);
      if (error.message?.includes('fetch') || error.message?.includes('API Error: 404')) {
        message.error('Quotations API is not yet implemented in the backend');
      } else {
        message.error('Failed to delete quotation');
      }
    }
  };

  const handleEdit = (quotation: Quotation) => {
    setEditingQuotation(quotation);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingQuotation(null);
  };

  const getStatusColor = (status: QuotationStatus) => {
    switch (status) {
      case QuotationStatus.DRAFT: return 'default';
      case QuotationStatus.SENT: return 'processing';
      case QuotationStatus.ACCEPTED: return 'success';
      case QuotationStatus.REJECTED: return 'error';
      case QuotationStatus.EXPIRED: return 'warning';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Quotation #',
      dataIndex: 'quotationNumber',
      key: 'quotationNumber',
      sorter: (a: Quotation, b: Quotation) => a.quotationNumber.localeCompare(b.quotationNumber),
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a: Quotation, b: Quotation) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (company: string) => company || '-',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Date',
      dataIndex: 'quotationDate',
      key: 'quotationDate',
      render: (date: string) => moment(date).format('MMM DD, YYYY'),
      sorter: (a: Quotation, b: Quotation) => 
        moment(a.quotationDate).unix() - moment(b.quotationDate).unix(),
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (date: string) => date ? moment(date).format('MMM DD, YYYY') : '-',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `$${amount?.toFixed(2) || '0.00'}`,
      sorter: (a: Quotation, b: Quotation) => (a.totalAmount || 0) - (b.totalAmount || 0),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: QuotationStatus) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
      filters: Object.values(QuotationStatus).map(status => ({
        text: status,
        value: status,
      })),
      onFilter: (value: any, record: Quotation) => record.status === value,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => `${items?.length || 0} items`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Quotation) => (
        <Space>
          <Button
            icon={<FilePdfOutlined />}
            type="link"
            size="small"
            disabled={!!apiError}
            title="Generate PDF"
          >
            PDF
          </Button>
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
            title="Are you sure you want to delete this quotation?"
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
          <Title level={2}>Quotation Management</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            disabled
          >
            Create Quotation
          </Button>
        </div>
        
        <Alert
          message="Quotations API Not Implemented"
          description={apiError}
          type="warning"
          icon={<ExclamationCircleOutlined />}
          showIcon
          action={
            <Button size="small" onClick={fetchQuotations}>
              Retry
            </Button>
          }
        />

        <Card style={{ marginTop: 16 }}>
          <Title level={4}>Quotation System Features</Title>
          <p>Once the Quotations API is implemented, this system will provide:</p>
          <ul>
            <li><strong>Quotation Management:</strong> Create, edit, and track quotations</li>
            <li><strong>Customer Information:</strong> Manage customer details and contact info</li>
            <li><strong>Product Line Items:</strong> Add products with quantities and pricing</li>
            <li><strong>Status Workflow:</strong> Draft → Sent → Accepted/Rejected/Expired</li>
            <li><strong>PDF Generation:</strong> Professional quotation documents</li>
            <li><strong>Calculations:</strong> Automatic totals and tax calculations</li>
            <li><strong>Search & Filter:</strong> Find quotations by customer, date, status</li>
          </ul>
          <p>This feature depends on the Products API being implemented first.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Quotation Management</Title>
        <Space>
          <Search
            placeholder="Search quotations..."
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
            Create Quotation
          </Button>
        </Space>
      </div>
      
      <Table 
        dataSource={quotations} 
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
        title={editingQuotation ? 'Edit Quotation' : 'Create Quotation'} 
        open={isModalVisible} 
        onCancel={handleModalClose} 
        footer={null}
        width={900}
        style={{ top: 20 }}
      >
        <QuotationForm 
          onSubmit={editingQuotation ? handleUpdate : handleCreate}
          initialData={editingQuotation}
        />
      </Modal>
    </div>
  );
};

export default QuotationManager;