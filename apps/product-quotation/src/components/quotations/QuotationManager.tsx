import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Typography, Space, Tag, message, Popconfirm, Alert, Card, Input, DatePicker, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined, FilePdfOutlined } from '@ant-design/icons';
import { apiClient, Quotation, CreateQuotationDto, QuotationStatus } from '../../services/api-client';
import QuotationForm from './QuotationForm';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const QuotationManager = () => {
  const { t } = useTranslation();
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
        setApiError(t('quotations.apiNotImplementedMessage'));
      } else {
        setApiError(`${t('quotations.fetchError')}: ${error.message}`);
      }
      message.error(t('quotations.fetchError'));
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
      message.success(t('quotations.createSuccess'));
    } catch (error: any) {
      console.error('Failed to create quotation:', error);
      if (error.message?.includes('fetch') || error.message?.includes('API Error: 404')) {
        message.error(t('quotations.apiNotImplementedMessage'));
      } else {
        message.error(t('quotations.createError'));
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
      message.success(t('quotations.updateSuccess'));
    } catch (error: any) {
      console.error('Failed to update quotation:', error);
      if (error.message?.includes('fetch') || error.message?.includes('API Error: 404')) {
        message.error(t('quotations.apiNotImplementedMessage'));
      } else {
        message.error(t('quotations.updateError'));
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteQuotation(id);
      setQuotations(prev => prev.filter(quotation => quotation.id !== id));
      message.success(t('quotations.deleteSuccess'));
    } catch (error: any) {
      console.error('Failed to delete quotation:', error);
      if (error.message?.includes('fetch') || error.message?.includes('API Error: 404')) {
        message.error(t('quotations.apiNotImplementedMessage'));
      } else {
        message.error(t('quotations.deleteError'));
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
      title: t('quotations.quotationNumber'),
      dataIndex: 'quotationNumber',
      key: 'quotationNumber',
      sorter: (a: Quotation, b: Quotation) => a.quotationNumber.localeCompare(b.quotationNumber),
    },
    {
      title: t('quotations.customer'),
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a: Quotation, b: Quotation) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: t('quotations.company'),
      dataIndex: 'companyName',
      key: 'companyName',
      render: (company: string) => company || '-',
    },
    {
      title: t('quotations.phone'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: t('quotations.date'),
      dataIndex: 'quotationDate',
      key: 'quotationDate',
      render: (date: string) => moment(date).format('MMM DD, YYYY'),
      sorter: (a: Quotation, b: Quotation) => 
        moment(a.quotationDate).unix() - moment(b.quotationDate).unix(),
    },
    {
      title: t('quotations.validUntil'),
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (date: string) => date ? moment(date).format('MMM DD, YYYY') : '-',
    },
    {
      title: t('quotations.totalAmount'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number | string) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `$${(numAmount || 0).toFixed(2)}`;
      },
      sorter: (a: Quotation, b: Quotation) => {
        const aAmount = typeof a.totalAmount === 'string' ? parseFloat(a.totalAmount) : a.totalAmount;
        const bAmount = typeof b.totalAmount === 'string' ? parseFloat(b.totalAmount) : b.totalAmount;
        return (aAmount || 0) - (bAmount || 0);
      },
    },
    {
      title: t('quotations.status'),
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
      title: t('quotations.items'),
      dataIndex: 'quotationItems',
      key: 'quotationItems',
      render: (quotationItems: any[]) => `${quotationItems?.length || 0} ${t('quotations.itemsCount')}`,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record: Quotation) => (
        <Space>
          <Button
            icon={<FilePdfOutlined />}
            type="link"
            size="small"
            disabled={!!apiError}
            title={t('common.pdf')}
          >
            {t('common.pdf')}
          </Button>
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
            title={t('confirmations.deleteQuotation')}
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
          <Title level={2}>{t('quotations.management')}</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            disabled
          >
            {t('quotations.create')}
          </Button>
        </div>
        
        <Alert
          message={t('quotations.apiNotImplemented')}
          description={apiError}
          type="warning"
          icon={<ExclamationCircleOutlined />}
          showIcon
          action={
            <Button size="small" onClick={fetchQuotations}>
              {t('common.retry')}
            </Button>
          }
        />

        <Card style={{ marginTop: 16 }}>
          <Title level={4}>{t('quotations.systemFeatures')}</Title>
          <p>{t('quotations.futureFeatures')}</p>
          <ul>
            <li><strong>{t('quotations.managementFeature')}</strong></li>
            <li><strong>{t('quotations.customerFeature')}</strong></li>
            <li><strong>{t('quotations.itemsFeature')}</strong></li>
            <li><strong>{t('quotations.workflowFeature')}</strong></li>
            <li><strong>{t('quotations.pdfFeature')}</strong></li>
            <li><strong>{t('quotations.calculationFeature')}</strong></li>
            <li><strong>{t('quotations.searchFeature')}</strong></li>
          </ul>
          <p>{t('quotations.dependencyMessage')}</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>{t('quotations.management')}</Title>
        <Space>
          <Search
            placeholder={t('quotations.searchPlaceholder')}
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
            {t('quotations.create')}
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
          showTotal: (total, range) => `${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('common.items')}`,
        }}
        scroll={{ x: 'max-content' }}
      />
      
      <Modal 
        title={editingQuotation ? t('quotations.edit') : t('quotations.create')} 
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