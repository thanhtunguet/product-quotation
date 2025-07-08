import React, { useEffect, useState } from 'react';
import {
  Button,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  apiClient,
  Brand,
  CreateMasterDataDto,
  UpdateMasterDataDto,
} from '../../services/api-client';
import MasterDataForm from './MasterDataForm';

const { Title } = Typography;

const BrandManager = () => {
  const { t } = useTranslation();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await apiClient.brands.getAll();
      setBrands(data);
    } catch (error) {
      message.error(t('brands.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreate = async (data: CreateMasterDataDto) => {
    try {
      const newBrand = await apiClient.brands.create(data);
      setBrands((prev) => [...prev, newBrand]);
      setIsModalVisible(false);
      message.success(t('brands.createSuccess'));
    } catch (error) {
      message.error(t('brands.createError'));
    }
  };

  const handleUpdate = async (data: UpdateMasterDataDto) => {
    if (!editingBrand) return;

    try {
      const updatedBrand = await apiClient.brands.update(editingBrand.id, data);
      setBrands((prev) =>
        prev.map((brand) =>
          brand.id === editingBrand.id ? updatedBrand : brand
        )
      );
      setIsModalVisible(false);
      setEditingBrand(null);
      message.success(t('brands.updateSuccess'));
    } catch (error) {
      message.error(t('brands.updateError'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.brands.delete(id);
      setBrands((prev) => prev.filter((brand) => brand.id !== id));
      message.success(t('brands.deleteSuccess'));
    } catch (error) {
      message.error(t('brands.deleteError'));
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingBrand(null);
  };

  const columns = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('common.code'),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: t('common.description'),
      dataIndex: 'description',
      key: 'description',
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
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record: Brand) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
            size="small"
          >
            {t('common.edit')}
          </Button>
          <Popconfirm
            title={t('confirmations.deleteBrand')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button icon={<DeleteOutlined />} type="link" size="small" danger>
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Title level={3}>{t('brands.management')}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          {t('brands.add')}
        </Button>
      </div>

      <Table
        dataSource={brands}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingBrand ? t('brands.edit') : t('brands.add')}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <MasterDataForm
          onSubmit={editingBrand ? handleUpdate : handleCreate}
          initialData={editingBrand}
        />
      </Modal>
    </div>
  );
};

export default BrandManager;
