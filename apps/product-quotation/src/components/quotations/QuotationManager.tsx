import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  DatePicker,
  Dropdown,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import {
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  ImportOutlined,
  PlusOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  CreateQuotationDto,
  Quotation,
  QuotationStatus,
} from '../../services/api-client';
import { enhancedApiClient } from '../../services/enhanced-api-client';
import QuotationForm from './QuotationForm';
import QuotationPDF from './QuotationPDF';
import PDFGenerator from '../../utils/pdfGenerator';
import ExcelExporter from '../../utils/excelExporter';
import { addDemoDataToLocalStorage } from '../../utils/demoData';
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
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(
    null
  );
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [selectedQuotationForPdf, setSelectedQuotationForPdf] =
    useState<Quotation | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const pdfRef = useRef<HTMLDivElement>(null);

  const fetchQuotations = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const result = await enhancedApiClient.getQuotations(
        searchTerm || undefined
      );
      setQuotations(Array.isArray(result) ? result : []);
    } catch (error: any) {
      console.error('Failed to fetch quotations:', error);
      setQuotations([]); // Set to empty array on error
      setApiError(`${t('quotations.fetchError')}: ${error.message}`);
      message.error(t('quotations.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add demo data if no quotations exist
    addDemoDataToLocalStorage();
    fetchQuotations();
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm]);

  const handleCreate = async (formData: CreateQuotationDto) => {
    try {
      const newQuotation = await enhancedApiClient.createQuotation(formData);
      setQuotations((prev) => [...prev, newQuotation]);
      setIsModalVisible(false);
      message.success(t('quotations.createSuccess'));
    } catch (error: any) {
      console.error('Failed to create quotation:', error);
      message.error(t('quotations.createError'));
    }
  };

  const handleUpdate = async (formData: Partial<CreateQuotationDto>) => {
    if (!editingQuotation) return;

    try {
      const updatedQuotation = await enhancedApiClient.updateQuotation(
        editingQuotation.id,
        formData
      );
      setQuotations((prev) =>
        prev.map((quotation) =>
          quotation.id === editingQuotation.id ? updatedQuotation : quotation
        )
      );
      setIsModalVisible(false);
      setEditingQuotation(null);
      message.success(t('quotations.updateSuccess'));
    } catch (error: any) {
      console.error('Failed to update quotation:', error);
      message.error(t('quotations.updateError'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await enhancedApiClient.deleteQuotation(id);
      setQuotations((prev) => prev.filter((quotation) => quotation.id !== id));
      message.success(t('quotations.deleteSuccess'));
    } catch (error: any) {
      console.error('Failed to delete quotation:', error);
      message.error(t('quotations.deleteError'));
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

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handlePdfPreview = (quotation: Quotation) => {
    setSelectedQuotationForPdf(quotation);
    setPdfModalVisible(true);
  };

  const handlePdfDownload = async (quotation: Quotation) => {
    if (!pdfRef.current) {
      message.error('PDF component not ready');
      return;
    }

    try {
      setGeneratingPdf(true);
      await PDFGenerator.generateQuotationPDF(pdfRef.current, quotation, {
        filename: `quotation-${quotation.quotationNumber}.pdf`,
        quality: 1.0,
      });
      message.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      message.error('Failed to generate PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handlePdfOpenInNewTab = async (quotation: Quotation) => {
    if (!pdfRef.current) {
      message.error('PDF component not ready');
      return;
    }

    try {
      setGeneratingPdf(true);
      await PDFGenerator.previewQuotationPDF(pdfRef.current, quotation, {
        quality: 1.0,
      });
    } catch (error) {
      console.error('PDF preview error:', error);
      message.error('Failed to preview PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handlePdfAction = async (
    action: 'preview' | 'download' | 'open',
    quotation: Quotation
  ) => {
    // First, open the modal to render the PDF component
    setSelectedQuotationForPdf(quotation);
    setPdfModalVisible(true);

    // Wait for the component to render
    setTimeout(async () => {
      if (action === 'preview') {
        // Modal is already open, just keep it open
        return;
      } else if (action === 'download') {
        await handlePdfDownload(quotation);
        setPdfModalVisible(false);
      } else if (action === 'open') {
        await handlePdfOpenInNewTab(quotation);
        setPdfModalVisible(false);
      }
    }, 100);
  };

  const handleExportData = () => {
    try {
      const data = enhancedApiClient.exportLocalData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quotations-export-${
        new Date().toISOString().split('T')[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success('Data exported successfully');
    } catch (error) {
      message.error('Failed to export data');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            const success = enhancedApiClient.importLocalData(data);
            if (success) {
              message.success('Data imported successfully');
              fetchQuotations(); // Refresh the list
            } else {
              message.error('Invalid data format');
            }
          } catch (error) {
            message.error('Failed to import data');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSyncData = async () => {
    try {
      setLoading(true);
      const result = await enhancedApiClient.syncLocalDataToBackend();
      message.success(
        `Sync completed: ${result.success} successful, ${result.failed} failed`
      );
      if (result.errors.length > 0) {
        console.log('Sync errors:', result.errors);
      }
      fetchQuotations(); // Refresh from backend
    } catch (error) {
      message.error('Sync failed: Backend not available');
    } finally {
      setLoading(false);
    }
  };

  const handleExcelExport = async (quotation: Quotation) => {
    try {
      setGeneratingPdf(true); // Reuse loading state
      await ExcelExporter.exportQuotation(quotation, {
        filename: `quotation-${quotation.quotationNumber}.xlsx`,
        includeFormulas: true,
        vietnameseLabels: true,
      });
      message.success('Excel file exported successfully');
    } catch (error) {
      console.error('Excel export error:', error);
      message.error('Failed to export Excel file');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleExportAllQuotations = async () => {
    try {
      setLoading(true);
      if (quotations.length === 0) {
        message.warning('No quotations to export');
        return;
      }

      await ExcelExporter.exportQuotationsSummary(quotations, {
        filename: `quotations-summary-${moment().format('YYYY-MM-DD')}.xlsx`,
        includeFormulas: true,
        vietnameseLabels: true,
      });
      message.success('Quotations summary exported successfully');
    } catch (error) {
      console.error('Excel export error:', error);
      message.error('Failed to export quotations summary');
    } finally {
      setLoading(false);
    }
  };

  const handleExportMultipleQuotations = async () => {
    try {
      setLoading(true);
      if (quotations.length === 0) {
        message.warning('No quotations to export');
        return;
      }

      await ExcelExporter.exportMultipleQuotations(quotations, {
        filename: `quotations-detailed-${moment().format('YYYY-MM-DD')}.xlsx`,
        includeFormulas: true,
        vietnameseLabels: true,
      });
      message.success('Detailed quotations exported successfully');
    } catch (error) {
      console.error('Excel export error:', error);
      message.error('Failed to export detailed quotations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: QuotationStatus) => {
    switch (status) {
      case QuotationStatus.DRAFT:
        return 'default';
      case QuotationStatus.SENT:
        return 'processing';
      case QuotationStatus.ACCEPTED:
        return 'success';
      case QuotationStatus.REJECTED:
        return 'error';
      case QuotationStatus.EXPIRED:
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: t('quotations.quotationNumber'),
      dataIndex: 'quotationNumber',
      key: 'quotationNumber',
      sorter: (a: Quotation, b: Quotation) =>
        a.quotationNumber.localeCompare(b.quotationNumber),
    },
    {
      title: t('quotations.customer'),
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a: Quotation, b: Quotation) =>
        a.customerName.localeCompare(b.customerName),
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
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
      sorter: (a: Quotation, b: Quotation) =>
        moment(a.quotationDate).unix() - moment(b.quotationDate).unix(),
    },
    {
      title: t('quotations.validUntil'),
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (date: string) =>
        date ? moment(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: t('quotations.totalAmount'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number | string) => {
        const numAmount =
          typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          currencyDisplay: 'symbol',
        }).format(numAmount || 0);
      },
      sorter: (a: Quotation, b: Quotation) => {
        const aAmount =
          typeof a.totalAmount === 'string'
            ? parseFloat(a.totalAmount)
            : a.totalAmount;
        const bAmount =
          typeof b.totalAmount === 'string'
            ? parseFloat(b.totalAmount)
            : b.totalAmount;
        return (aAmount || 0) - (bAmount || 0);
      },
    },
    {
      title: t('quotations.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: QuotationStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      filters: Object.values(QuotationStatus).map((status) => ({
        text: status,
        value: status,
      })),
      onFilter: (value: any, record: Quotation) => record.status === value,
    },
    {
      title: t('quotations.items'),
      dataIndex: 'quotationItems',
      key: 'quotationItems',
      render: (quotationItems: any[]) =>
        `${quotationItems?.length || 0} ${t('quotations.itemsCount')}`,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      render: (_, record: Quotation) => {
        const exportMenuItems = [
          {
            key: 'pdf-preview',
            label: 'Preview PDF',
            icon: <EyeOutlined />,
            onClick: () => handlePdfAction('preview', record),
          },
          {
            key: 'pdf-download',
            label: 'Download PDF',
            icon: <FilePdfOutlined />,
            onClick: () => handlePdfAction('download', record),
          },
          {
            key: 'pdf-open',
            label: 'Open PDF in New Tab',
            icon: <DownloadOutlined />,
            onClick: () => handlePdfAction('open', record),
          },
          {
            type: 'divider',
          },
          {
            key: 'excel-export',
            label: 'Export to Excel',
            icon: <FileExcelOutlined />,
            onClick: () => handleExcelExport(record),
          },
        ];

        return (
          <Space>
            <Dropdown
              menu={{ items: exportMenuItems }}
              trigger={['click']}
              disabled={generatingPdf}
            >
              <Button
                icon={<ExportOutlined />}
                type="link"
                size="small"
                disabled={generatingPdf}
                loading={
                  generatingPdf && selectedQuotationForPdf?.id === record.id
                }
              />
            </Dropdown>
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="link"
              size="small"
              disabled={false}
            />
            <Popconfirm
              title={t('confirmations.deleteQuotation')}
              onConfirm={() => handleDelete(record.id)}
              okText={t('common.yes')}
              cancelText={t('common.no')}
              disabled={false}
            >
              <Button
                icon={<DeleteOutlined />}
                type="link"
                size="small"
                danger
                disabled={false}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // Show a simple warning if there are API errors, but still allow functionality
  const showApiWarning = apiError && quotations.length === 0;

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Title level={2}>{t('quotations.management')}</Title>
        <Space>
          <Search
            placeholder={t('quotations.searchPlaceholder')}
            allowClear
            className="w-64"
            onSearch={setSearchTerm}
            onChange={(e) => !e.target.value && setSearchTerm('')}
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: 'excel-summary',
                  label: 'Export Summary to Excel',
                  icon: <FileExcelOutlined />,
                  onClick: handleExportAllQuotations,
                  disabled: loading || quotations.length === 0,
                },
                {
                  key: 'excel-detailed',
                  label: 'Export Detailed to Excel',
                  icon: <FileExcelOutlined />,
                  onClick: handleExportMultipleQuotations,
                  disabled: loading || quotations.length === 0,
                },
                {
                  type: 'divider',
                },
                {
                  key: 'export',
                  label: 'Export JSON Data',
                  icon: <ExportOutlined />,
                  onClick: handleExportData,
                },
                {
                  key: 'import',
                  label: 'Import JSON Data',
                  icon: <ImportOutlined />,
                  onClick: handleImportData,
                },
                {
                  type: 'divider',
                },
                {
                  key: 'sync',
                  label: 'Sync to Backend',
                  icon: <SyncOutlined />,
                  onClick: handleSyncData,
                  disabled: loading,
                },
              ],
            }}
            trigger={['click']}
          >
            <Button icon={<DownOutlined />}>Data Management</Button>
          </Dropdown>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            {t('quotations.create')}
          </Button>
        </Space>
      </div>

      {showApiWarning && (
        <Alert
          message="Backend Unavailable - Using Local Storage"
          description="Data is being saved locally and will sync when the backend is available."
          type="info"
          icon={<ExclamationCircleOutlined />}
          showIcon
          closable
          className="mb-4"
          action={
            <Button size="small" onClick={fetchQuotations}>
              Retry Connection
            </Button>
          }
        />
      )}

      <Table
        dataSource={quotations}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} ${t('common.of')} ${total} ${t(
              'common.items'
            )}`,
          onChange: handlePaginationChange,
          onShowSizeChange: handlePaginationChange,
        }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={editingQuotation ? t('quotations.edit') : t('quotations.create')}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={900}
        className="top-5"
      >
        <QuotationForm
          onSubmit={editingQuotation ? handleUpdate : handleCreate}
          initialData={editingQuotation}
        />
      </Modal>

      {/* PDF Preview Modal */}
      <Modal
        title={
          <Space>
            <FilePdfOutlined />
            PDF Preview - {selectedQuotationForPdf?.quotationNumber}
          </Space>
        }
        open={pdfModalVisible}
        onCancel={() => setPdfModalVisible(false)}
        width={1200}
        className="top-5"
        footer={[
          <Button key="close" onClick={() => setPdfModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() =>
              selectedQuotationForPdf &&
              handlePdfDownload(selectedQuotationForPdf)
            }
            loading={generatingPdf}
          >
            Download PDF
          </Button>,
          <Button
            key="open"
            icon={<FilePdfOutlined />}
            onClick={() =>
              selectedQuotationForPdf &&
              handlePdfOpenInNewTab(selectedQuotationForPdf)
            }
            loading={generatingPdf}
          >
            Open in New Tab
          </Button>,
        ]}
      >
        {selectedQuotationForPdf && (
          <div className="max-h-[70vh] overflow-auto border border-gray-300 rounded-md">
            <QuotationPDF
              quotation={selectedQuotationForPdf}
              onRef={(ref) => {
                if (ref) pdfRef.current = ref;
              }}
            />
          </div>
        )}
      </Modal>

      {/* Hidden PDF Component for Generation */}
      {selectedQuotationForPdf && !pdfModalVisible && (
        <div className="absolute -left-[9999px] -top-[9999px]">
          <QuotationPDF
            quotation={selectedQuotationForPdf}
            onRef={(ref) => {
              if (ref) pdfRef.current = ref;
            }}
          />
        </div>
      )}
    </div>
  );
};

export default QuotationManager;
