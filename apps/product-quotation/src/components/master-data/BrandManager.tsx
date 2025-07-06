
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Typography, Space, Tag, message, Spin, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { apiClient, Brand, CreateMasterDataDto, UpdateMasterDataDto } from '../../services/api-client';
import MasterDataForm from './MasterDataForm';

const { Title } = Typography;

const BrandManager = () => {
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
      message.error('Failed to fetch brands');
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
      setBrands(prev => [...prev, newBrand]);
      setIsModalVisible(false);
      message.success('Brand created successfully');
    } catch (error) {
      message.error('Failed to create brand');
    }
  };

  const handleUpdate = async (data: UpdateMasterDataDto) => {
    if (!editingBrand) return;
    
    try {
      const updatedBrand = await apiClient.brands.update(editingBrand.id, data);
      setBrands(prev => prev.map(brand => 
        brand.id === editingBrand.id ? updatedBrand : brand
      ));
      setIsModalVisible(false);
      setEditingBrand(null);
      message.success('Brand updated successfully');
    } catch (error) {
      message.error('Failed to update brand');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.brands.delete(id);
      setBrands(prev => prev.filter(brand => brand.id !== id));
      message.success('Brand deleted successfully');
    } catch (error) {
      message.error('Failed to delete brand');
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
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Brand) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this brand?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              type="link"
              size="small"
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3}>Brand Management</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Brand
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
        title={editingBrand ? 'Edit Brand' : 'Add Brand'} 
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
