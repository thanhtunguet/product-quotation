
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Typography, Space, Tag, message, Spin, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { apiClient, Manufacturer, CreateMasterDataDto, UpdateMasterDataDto } from '../../services/api-client';
import MasterDataForm from './MasterDataForm';

const { Title } = Typography;

const ManufacturerManager = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);

  const fetchManufacturers = async () => {
    setLoading(true);
    try {
      const data = await apiClient.manufacturers.getAll();
      setManufacturers(data);
    } catch (error) {
      message.error('Failed to fetch manufacturers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const handleCreate = async (data: CreateMasterDataDto) => {
    try {
      const newManufacturer = await apiClient.manufacturers.create(data);
      setManufacturers(prev => [...prev, newManufacturer]);
      setIsModalVisible(false);
      message.success('Manufacturer created successfully');
    } catch (error) {
      message.error('Failed to create manufacturer');
    }
  };

  const handleUpdate = async (data: UpdateMasterDataDto) => {
    if (!editingManufacturer) return;
    
    try {
      const updatedManufacturer = await apiClient.manufacturers.update(editingManufacturer.id, data);
      setManufacturers(prev => prev.map(manufacturer => 
        manufacturer.id === editingManufacturer.id ? updatedManufacturer : manufacturer
      ));
      setIsModalVisible(false);
      setEditingManufacturer(null);
      message.success('Manufacturer updated successfully');
    } catch (error) {
      message.error('Failed to update manufacturer');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.manufacturers.delete(id);
      setManufacturers(prev => prev.filter(manufacturer => manufacturer.id !== id));
      message.success('Manufacturer deleted successfully');
    } catch (error) {
      message.error('Failed to delete manufacturer');
    }
  };

  const handleEdit = (manufacturer: Manufacturer) => {
    setEditingManufacturer(manufacturer);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingManufacturer(null);
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
      render: (_, record: Manufacturer) => (
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
            title="Are you sure you want to delete this manufacturer?"
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
        <Title level={3}>Manufacturer Management</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Manufacturer
        </Button>
      </div>
      
      <Table 
        dataSource={manufacturers} 
        columns={columns} 
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      
      <Modal 
        title={editingManufacturer ? 'Edit Manufacturer' : 'Add Manufacturer'} 
        open={isModalVisible} 
        onCancel={handleModalClose} 
        footer={null}
        width={600}
      >
        <MasterDataForm 
          onSubmit={editingManufacturer ? handleUpdate : handleCreate}
          initialData={editingManufacturer}
        />
      </Modal>
    </div>
  );
};

export default ManufacturerManager;
