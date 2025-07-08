import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
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
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  apiClient,
  Color,
  CreateMasterDataDto,
  MasterDataEntity,
  UpdateMasterDataDto,
} from '../../services/api-client';
import GenericMasterDataForm from './GenericMasterDataForm';

const { Title } = Typography;

interface GenericMasterDataManagerProps {
  title: string;
  apiEndpoint: keyof typeof apiClient;
  entityName: string;
  hasHexCode?: boolean;
}

const GenericMasterDataManager: React.FC<GenericMasterDataManagerProps> = ({
  title,
  apiEndpoint,
  entityName,
  hasHexCode = false,
}) => {
  const [data, setData] = useState<MasterDataEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterDataEntity | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getApiMethods = () => {
    const api = apiClient[apiEndpoint];
    if (api && typeof api === 'object' && 'getAll' in api) {
      return api as {
        getAll: (search?: string) => Promise<MasterDataEntity[]>;
        getById: (id: number) => Promise<MasterDataEntity>;
        create: (data: CreateMasterDataDto) => Promise<MasterDataEntity>;
        update: (
          id: number,
          data: UpdateMasterDataDto
        ) => Promise<MasterDataEntity>;
        delete: (id: number) => Promise<void>;
      };
    }
    return null;
  };

  const fetchData = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const api = getApiMethods();
      if (!api) {
        throw new Error(`API methods not found for ${apiEndpoint}`);
      }

      const result = await api.getAll();
      setData(result);
    } catch (error: any) {
      console.error(`Failed to fetch ${entityName}s:`, error);
      if (
        error.message?.includes('fetch') ||
        error.message?.includes('API Error: 404')
      ) {
        setApiError(
          `${title} API is not yet implemented in the backend. This feature will be available once the backend developer implements the ${apiEndpoint} endpoints.`
        );
      } else {
        setApiError(`Failed to fetch ${entityName}s: ${error.message}`);
      }
      message.error(`Failed to fetch ${entityName}s`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiEndpoint]);

  const handleCreate = async (formData: CreateMasterDataDto) => {
    try {
      const api = getApiMethods();
      if (!api) {
        throw new Error(`API methods not found for ${apiEndpoint}`);
      }

      const newItem = await api.create(formData);
      setData((prev) => [...prev, newItem]);
      setIsModalVisible(false);
      message.success(`${entityName} created successfully`);
    } catch (error: any) {
      console.error(`Failed to create ${entityName}:`, error);
      if (
        error.message?.includes('fetch') ||
        error.message?.includes('API Error: 404')
      ) {
        message.error(`${title} API is not yet implemented in the backend`);
      } else {
        message.error(`Failed to create ${entityName}`);
      }
    }
  };

  const handleUpdate = async (formData: UpdateMasterDataDto) => {
    if (!editingItem) return;

    try {
      const api = getApiMethods();
      if (!api) {
        throw new Error(`API methods not found for ${apiEndpoint}`);
      }

      const updatedItem = await api.update(editingItem.id, formData);
      setData((prev) =>
        prev.map((item) => (item.id === editingItem.id ? updatedItem : item))
      );
      setIsModalVisible(false);
      setEditingItem(null);
      message.success(`${entityName} updated successfully`);
    } catch (error: any) {
      console.error(`Failed to update ${entityName}:`, error);
      if (
        error.message?.includes('fetch') ||
        error.message?.includes('API Error: 404')
      ) {
        message.error(`${title} API is not yet implemented in the backend`);
      } else {
        message.error(`Failed to update ${entityName}`);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const api = getApiMethods();
      if (!api) {
        throw new Error(`API methods not found for ${apiEndpoint}`);
      }

      await api.delete(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success(`${entityName} deleted successfully`);
    } catch (error: any) {
      console.error(`Failed to delete ${entityName}:`, error);
      if (
        error.message?.includes('fetch') ||
        error.message?.includes('API Error: 404')
      ) {
        message.error(`${title} API is not yet implemented in the backend`);
      } else {
        message.error(`Failed to delete ${entityName}`);
      }
    }
  };

  const handleEdit = (item: MasterDataEntity) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingItem(null);
  };

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const baseColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const hexCodeColumn = hasHexCode
    ? [
        {
          title: 'Color',
          dataIndex: 'hexCode',
          key: 'hexCode',
          render: (hexCode: string, record: Color) => (
            <Space>
              {hexCode && (
                <div
                  className="w-5 h-5 border border-gray-300 rounded"
                  style={{ backgroundColor: hexCode }}
                />
              )}
              <span>{hexCode || 'No color'}</span>
            </Space>
          ),
        },
      ]
    : [];

  const statusColumn = {
    title: 'Status',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (isActive: boolean) => (
      <Tag color={isActive ? 'green' : 'red'}>
        {isActive ? 'Active' : 'Inactive'}
      </Tag>
    ),
  };

  const actionsColumn = {
    title: 'Actions',
    key: 'actions',
    render: (_, record: MasterDataEntity) => (
      <Space>
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
          title={`Are you sure you want to delete this ${entityName}?`}
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
  };

  const columns = [
    ...baseColumns,
    ...hexCodeColumn,
    statusColumn,
    actionsColumn,
  ];

  if (apiError) {
    return (
      <div>
        <div className="mb-4 flex justify-between items-center">
          <Title level={3}>{title}</Title>
          <Button type="primary" icon={<PlusOutlined />} disabled>
            Add {entityName}
          </Button>
        </div>

        <Alert
          message="API Not Implemented"
          description={apiError}
          type="warning"
          icon={<ExclamationCircleOutlined />}
          showIcon
          action={
            <Button size="small" onClick={fetchData}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Title level={3}>{title}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add {entityName}
        </Button>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: handlePaginationChange,
          onShowSizeChange: handlePaginationChange,
        }}
      />

      <Modal
        title={editingItem ? `Edit ${entityName}` : `Add ${entityName}`}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <GenericMasterDataForm
          onSubmit={editingItem ? handleUpdate : handleCreate}
          initialData={editingItem}
          hasHexCode={hasHexCode}
          entityName={entityName}
        />
      </Modal>
    </div>
  );
};

export default GenericMasterDataManager;
