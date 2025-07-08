import React, { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  message,
  Modal,
  Progress,
  Space,
  Typography,
  Upload,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { apiClient, ExcelImportResultDto } from '../../services/api-client';

const { Title, Text } = Typography;

interface ExcelImportModalProps {
  visible: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

interface ImportState {
  uploading: boolean;
  importResult?: ExcelImportResultDto;
  showResult: boolean;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  visible,
  onClose,
  onImportSuccess,
}) => {
  const { t } = useTranslation();
  const [state, setState] = useState<ImportState>({
    uploading: false,
    showResult: false,
  });

  const handleDownloadTemplate = async () => {
    try {
      const blob = await apiClient.downloadProductTemplate();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'product-import-template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success(t('excel.templateDownloaded'));
    } catch (error) {
      console.error('Error downloading template:', error);
      message.error(t('excel.downloadError'));
    }
  };

  const handleFileUpload = async (file: File) => {
    setState((prev) => ({ ...prev, uploading: true, showResult: false }));

    try {
      const result = await apiClient.importProducts(file);
      setState((prev) => ({
        ...prev,
        uploading: false,
        importResult: result,
        showResult: true,
      }));

      if (result.errorCount === 0) {
        message.success(
          t('excel.importSuccess', { count: result.successCount })
        );
        onImportSuccess();
      } else {
        message.warning(
          t('excel.importPartialSuccess', {
            success: result.successCount,
            error: result.errorCount,
          })
        );
      }
    } catch (error) {
      setState((prev) => ({ ...prev, uploading: false }));
      console.error('Error importing products:', error);
      message.error(t('excel.importError'));
    }

    return false; // Prevent default upload behavior
  };

  const handleClose = () => {
    setState({
      uploading: false,
      showResult: false,
    });
    onClose();
  };

  const uploadProps = {
    name: 'file',
    accept: '.xlsx,.xls',
    beforeUpload: handleFileUpload,
    showUploadList: false,
    disabled: state.uploading,
  };

  const renderImportResult = () => {
    if (!state.showResult || !state.importResult) return null;

    const { importResult } = state;
    const hasErrors = importResult.errorCount > 0;

    return (
      <Card className="mt-4">
        <Title level={4}>
          <FileExcelOutlined className="mr-2" />
          {t('excel.importResults')}
        </Title>

        <Space direction="vertical" className="w-full">
          <div className="flex justify-between items-center">
            <Text>{t('excel.totalRows')}:</Text>
            <Text strong>{importResult.totalRows}</Text>
          </div>

          <div className="flex justify-between items-center">
            <Text className="text-green-600">
              <CheckCircleOutlined className="mr-1" />
              {t('excel.successCount')}:
            </Text>
            <Text strong className="text-green-600">
              {importResult.successCount}
            </Text>
          </div>

          <div className="flex justify-between items-center">
            <Text className="text-red-600">
              <CloseCircleOutlined className="mr-1" />
              {t('excel.errorCount')}:
            </Text>
            <Text strong className="text-red-600">
              {importResult.errorCount}
            </Text>
          </div>

          {hasErrors && (
            <Alert
              message={t('excel.validationErrors')}
              type="error"
              showIcon
              description={
                <div className="mt-2 max-h-60 overflow-y-auto">
                  {importResult.errors.map((error, index) => (
                    <div key={index} className="mb-1 text-sm">
                      <Text strong>Row {error.row}:</Text> {error.field} -{' '}
                      {error.message}
                      {error.value && (
                        <Text className="ml-2 text-gray-500">
                          ({error.value})
                        </Text>
                      )}
                    </div>
                  ))}
                </div>
              }
            />
          )}
        </Space>
      </Card>
    );
  };

  return (
    <Modal
      title={
        <Space>
          <FileExcelOutlined />
          {t('excel.importTitle')}
        </Space>
      }
      visible={visible}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          {t('common.close')}
        </Button>,
      ]}
      width={600}
    >
      <Space direction="vertical" className="w-full">
        {/* Download Template Section */}
        <Card>
          <Title level={5}>{t('excel.step1')}</Title>
          <Text className="text-gray-600 mb-4 block">
            {t('excel.downloadTemplateDescription')}
          </Text>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadTemplate}
            className="w-full"
          >
            {t('excel.downloadTemplate')}
          </Button>
        </Card>

        {/* Upload File Section */}
        <Card>
          <Title level={5}>{t('excel.step2')}</Title>
          <Text className="text-gray-600 mb-4 block">
            {t('excel.uploadFileDescription')}
          </Text>

          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">{t('excel.uploadText')}</p>
            <p className="ant-upload-hint">{t('excel.uploadHint')}</p>
          </Upload.Dragger>

          {state.uploading && (
            <div className="mt-4">
              <Progress percent={100} status="active" />
              <Text className="text-center block mt-2">
                {t('excel.importing')}
              </Text>
            </div>
          )}
        </Card>

        {/* Import Results */}
        {renderImportResult()}
      </Space>
    </Modal>
  );
};
