
import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { ProductOutlined, FileTextOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  return (
    <div>
      <Title level={2}>Product Quotation Dashboard</Title>
      <Paragraph>
        Welcome to the Product Quotation Management System. Use the navigation menu to manage your products, quotations, and master data.
      </Paragraph>
      
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={0}
              prefix={<ProductOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Quotations"
              value={0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Categories"
              value={0}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Brands"
              value={0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
