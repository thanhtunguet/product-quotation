
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'antd';
import { apiClient, Brand, CreateMasterDataDto } from '../../services/api-client';
import MasterDataForm from './MasterDataForm';

const BrandManager = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    apiClient.brands.getAll().then(setBrands);
  }, []);

  const handleCreate = async (data: CreateMasterDataDto) => {
    const newBrand = await apiClient.brands.create(data);
    setBrands(prev => [...prev, newBrand]);
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Active', dataIndex: 'isActive', key: 'isActive' },
  ];

  return (
    <div>
      <Button onClick={() => setIsModalVisible(true)}>Add Brand</Button>
      <Table dataSource={brands} columns={columns} />
      <Modal title="Add Brand" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <MasterDataForm onSubmit={handleCreate} />
      </Modal>
    </div>
  );
};

export default BrandManager;
