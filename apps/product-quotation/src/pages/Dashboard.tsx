import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import {
  FileTextOutlined,
  ProductOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../services/api-client';

const { Title, Paragraph } = Typography;

interface DashboardStats {
  totalProducts: number;
  activeQuotations: number;
  categories: number;
  brands: number;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeQuotations: 0,
    categories: 0,
    brands: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [products, quotations, categories, brands] =
          await Promise.allSettled([
            apiClient.getProducts().catch(() => []), // Products API might not be implemented yet
            apiClient.getQuotations().catch(() => []), // Quotations API might not be implemented yet
            apiClient.getCategories(),
            apiClient.brands.getAll(),
          ]);

        const newStats: DashboardStats = {
          totalProducts:
            products.status === 'fulfilled' && Array.isArray(products.value)
              ? products.value.length
              : 0,
          activeQuotations:
            quotations.status === 'fulfilled' && Array.isArray(quotations.value)
              ? quotations.value.filter(
                  (q) => q.status !== 'EXPIRED' && q.status !== 'REJECTED'
                ).length
              : 0,
          categories:
            categories.status === 'fulfilled' && Array.isArray(categories.value)
              ? categories.value.length
              : 0,
          brands:
            brands.status === 'fulfilled' && Array.isArray(brands.value)
              ? brands.value.length
              : 0,
        };

        setStats(newStats);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div>
      <Title level={2}>{t('dashboard.title')}</Title>
      <Paragraph>{t('dashboard.welcome')}</Paragraph>

      <Row gutter={16} className="mt-6">
        <Col span={6}>
          <Card>
            <Statistic
              title={t('dashboard.totalProducts')}
              value={stats.totalProducts}
              loading={loading}
              prefix={<ProductOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('dashboard.activeQuotations')}
              value={stats.activeQuotations}
              loading={loading}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('dashboard.categories')}
              value={stats.categories}
              loading={loading}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t('dashboard.brands')}
              value={stats.brands}
              loading={loading}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
