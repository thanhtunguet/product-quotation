import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import { apiClient, Product } from '../../services/api-client';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    apiClient.products.getAll().then(setProducts);
  }, []);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: ['category', 'name'], key: 'category' },
    { title: 'Brand', dataIndex: ['brand', 'name'], key: 'brand' },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: Product) => (
        <span>
          <Link to={`/products/${record.id}/edit`}>Edit</Link>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Link to="/products/new">
        <Button type="primary">Add Product</Button>
      </Link>
      <Table dataSource={products} columns={columns} />
    </div>
  );
};

export default ProductList;
