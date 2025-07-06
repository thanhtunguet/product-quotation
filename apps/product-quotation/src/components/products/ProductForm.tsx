
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { apiClient, Category, Brand, CreateProductDto } from '../../services/api-client';

const { Option } = Select;

const ProductForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    Promise.all([
      apiClient.categories.getAll(),
      apiClient.brands.getAll(),
    ]).then(([cats, brds]) => {
      setCategories(cats);
      setBrands(brds);
    });
  }, []);

  const onFinish = async (values: CreateProductDto) => {
    try {
      await apiClient.products.create(values);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Please input product name!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
        <Select placeholder="Select Category">
          {categories.map(cat => (
            <Option key={cat.id} value={cat.id}>{cat.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="brandId" label="Brand" rules={[{ required: true, message: 'Please select a brand!' }]}>
        <Select placeholder="Select Brand">
          {brands.map(brand => (
            <Option key={brand.id} value={brand.id}>{brand.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
