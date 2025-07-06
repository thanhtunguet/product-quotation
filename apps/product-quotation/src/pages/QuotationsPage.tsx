
import React from 'react';
import { Typography, Button, Result } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const QuotationsPage = () => {
  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Quotations</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
        >
          Create Quotation
        </Button>
      </div>
      
      <Result
        title="Quotations Management"
        subTitle="Quotation management functionality will be implemented after products. The backend APIs are ready and waiting for frontend integration."
        extra={
          <Button type="primary">
            View API Documentation
          </Button>
        }
      />
    </div>
  );
};

export default QuotationsPage;
