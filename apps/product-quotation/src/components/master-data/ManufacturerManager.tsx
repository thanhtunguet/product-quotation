
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'antd';
import { apiClient, Manufacturer, CreateMasterDataDto } from '../../services/api-client';
import MasterDataForm from './MasterDataForm';

const ManufacturerManager = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    apiClient.manufacturers.getAll().then(setManufacturers);
  }, []);

  const handleCreate = async (data: CreateMasterDataDto) => {
    const newManufacturer = await apiClient.manufacturers.create(data);
    setManufacturers(prev => [...prev, newManufacturer]);
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Active', dataIndex: 'isActive', key: 'isActive' },
  ];

  return (
    <div>
      <Button onClick={() => setIsModalVisible(true)}>Add Manufacturer</Button>
      <Table dataSource={manufacturers} columns={columns} />
      <Modal title="Add Manufacturer" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <MasterDataForm onSubmit={handleCreate} />
      </Modal>
    </div>
  );
};

export default ManufacturerManager;
