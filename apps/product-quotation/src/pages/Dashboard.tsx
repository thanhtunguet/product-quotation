import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography, Spin, Alert } from 'antd';
import {
  FileTextOutlined,
  ProductOutlined,
  SettingOutlined,
  UserOutlined,
  ShoppingOutlined,
  TeamOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Column, Pie, Line } from '@ant-design/charts';
import { useTranslation } from 'react-i18next';
import { apiClient, QuotationStatus } from '../services/api-client';

const { Title, Paragraph } = Typography;

interface DashboardStats {
  totalProducts: number;
  activeQuotations: number;
  totalQuotations: number;
  categories: number;
  brands: number;
  manufacturers: number;
  totalQuotationValue: number;
  quotationsByStatus: Array<{ status: string; count: number }>;
  productsByCategory: Array<{ category: string; count: number }>;
  quotationTrends: Array<{ date: string; count: number; value: number }>;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeQuotations: 0,
    totalQuotations: 0,
    categories: 0,
    brands: 0,
    manufacturers: 0,
    totalQuotationValue: 0,
    quotationsByStatus: [],
    productsByCategory: [],
    quotationTrends: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [
          products,
          quotations,
          categories,
          brands,
          manufacturers,
        ] = await Promise.allSettled([
          apiClient.getProducts().catch(() => []),
          apiClient.getQuotations().catch(() => []),
          apiClient.getCategories().catch(() => []),
          apiClient.brands.getAll().catch(() => []),
          apiClient.manufacturers.getAll().catch(() => []),
        ]);

        // Process products data
        const productsData = products.status === 'fulfilled' && Array.isArray(products.value) ? products.value : [];
        const quotationsData = quotations.status === 'fulfilled' && Array.isArray(quotations.value) ? quotations.value : [];
        const categoriesData = categories.status === 'fulfilled' && Array.isArray(categories.value) ? categories.value : [];
        const brandsData = brands.status === 'fulfilled' && Array.isArray(brands.value) ? brands.value : [];
        const manufacturersData = manufacturers.status === 'fulfilled' && Array.isArray(manufacturers.value) ? manufacturers.value : [];

        // Calculate statistics
        const activeQuotations = quotationsData.filter((q) => {
          // Exclude rejected and expired quotations
          if (q.status === QuotationStatus.REJECTED || q.status === QuotationStatus.EXPIRED) {
            return false;
          }
          
          // Check if quotation has not expired based on validUntil date
          if (q.validUntil) {
            const validUntilDate = new Date(q.validUntil);
            const currentDate = new Date();
            if (currentDate > validUntilDate) {
              return false; // Quotation has expired
            }
          }
          
          return true;
        });

        const totalQuotationValue = quotationsData.reduce((sum, q) => sum + (q.totalAmount || 0), 0);

        // Group quotations by status
        const quotationsByStatus = Object.values(QuotationStatus).map(status => ({
          status: status.charAt(0) + status.slice(1).toLowerCase(),
          count: quotationsData.filter(q => q.status === status).length,
        })).filter(item => item.count > 0);

        // Group products by category
        const categoryMap = new Map<string, number>();
        productsData.forEach(product => {
          const categoryName = product.category?.name || 'Uncategorized';
          categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1);
        });

        const productsByCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({
          category,
          count,
        }));

        // Generate quotation trends (last 30 days)
        const quotationTrends = generateQuotationTrends(quotationsData);

        const newStats: DashboardStats = {
          totalProducts: productsData.length,
          activeQuotations: activeQuotations.length,
          totalQuotations: quotationsData.length,
          categories: categoriesData.length,
          brands: brandsData.length,
          manufacturers: manufacturersData.length,
          totalQuotationValue,
          quotationsByStatus,
          productsByCategory,
          quotationTrends,
        };

        setStats(newStats);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const generateQuotationTrends = (quotationsData: any[]) => {
    const trendsMap = new Map<string, { count: number; value: number }>();
    const today = new Date();
    
    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trendsMap.set(dateStr, { count: 0, value: 0 });
    }

    // Fill with actual data
    quotationsData.forEach(quotation => {
      if (quotation.quotationDate) {
        const dateStr = quotation.quotationDate.split('T')[0];
        if (trendsMap.has(dateStr)) {
          const existing = trendsMap.get(dateStr)!;
          existing.count += 1;
          existing.value += quotation.totalAmount || 0;
        }
      }
    });

    return Array.from(trendsMap.entries()).map(([date, data]) => ({
      date,
      count: data.count,
      value: data.value,
    }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error loading dashboard"
        description={error}
        type="error"
        showIcon
        style={{ margin: '20px 0' }}
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>{t('dashboard.title')}</Title>
      <Paragraph style={{ marginBottom: '32px' }}>{t('dashboard.welcome')}</Paragraph>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.totalProducts')}
              value={stats.totalProducts}
              prefix={<ProductOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.activeQuotations')}
              value={stats.activeQuotations}
              prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.totalQuotations')}
              value={stats.totalQuotations}
              prefix={<ShoppingOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.totalValue')}
              value={stats.totalQuotationValue}
              prefix={<DollarOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d' }}
              precision={0}
              suffix="₫"
            />
          </Card>
        </Col>
      </Row>

      {/* Secondary Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title={t('dashboard.categories')}
              value={stats.categories}
              prefix={<SettingOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title={t('dashboard.brands')}
              value={stats.brands}
              prefix={<UserOutlined style={{ color: '#13c2c2' }} />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title={t('dashboard.manufacturers')}
              value={stats.manufacturers}
              prefix={<TeamOutlined style={{ color: '#eb2f96' }} />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        {/* Quotation Trends Chart */}
        <Col xs={24} lg={12}>
          <Card title={t('dashboard.quotationTrends')} style={{ height: '400px' }}>
            <Line
              data={stats.quotationTrends}
              xField="date"
              yField="count"
              point={{ size: 3 }}
              smooth={true}
              color="#1890ff"
              height={300}
              xAxis={{
                type: 'time',
                mask: 'MM-DD',
              }}
              yAxis={{
                title: {
                  text: t('dashboard.quotationCount'),
                },
              }}
            />
          </Card>
        </Col>

        {/* Quotations by Status Chart */}
        <Col xs={24} lg={12}>
          <Card title={t('dashboard.quotationsByStatus')} style={{ height: '400px' }}>
            <Pie
              data={stats.quotationsByStatus}
              angleField="count"
              colorField="status"
              radius={0.8}
              height={300}
              label={{
                type: 'outer',
                content: '{name}: {value}',
              }}
              interactions={[{ type: 'element-active' }]}
            />
          </Card>
        </Col>

        {/* Products by Category Chart */}
        <Col xs={24}>
          <Card title={t('dashboard.productsByCategory')} style={{ marginTop: '16px' }}>
            <Column
              data={stats.productsByCategory}
              xField="category"
              yField="count"
              height={300}
              color="#52c41a"
              columnStyle={{
                radius: [4, 4, 0, 0],
              }}
              xAxis={{
                label: {
                  autoRotate: true,
                },
              }}
              yAxis={{
                title: {
                  text: t('dashboard.productCount'),
                },
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;