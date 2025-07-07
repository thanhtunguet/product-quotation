
import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { ProductOutlined, FileTextOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <Title level={2}>{t('dashboard.title')}</Title>
      <Paragraph>
        {t('dashboard.welcome')}
      </Paragraph>
      
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('dashboard.totalProducts')}
              value={0}
              prefix={<ProductOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('dashboard.activeQuotations')}
              value={0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('dashboard.categories')}
              value={0}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('dashboard.brands')}
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
