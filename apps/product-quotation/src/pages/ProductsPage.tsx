
import React from 'react';
import { Typography, Button, Result } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ProductsPage = () => {
  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Products</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
        >
          Add Product
        </Button>
      </div>
      
      <Result
        title="Products Management"
        subTitle="Product management functionality will be implemented next. The backend APIs are ready and waiting for frontend integration."
        extra={
          <Button type="primary">
            View API Documentation
          </Button>
        }
      />
    </div>
  );
};

export default ProductsPage;
