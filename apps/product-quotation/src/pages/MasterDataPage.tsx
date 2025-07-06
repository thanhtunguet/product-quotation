
import React from 'react';
import { Typography, Tabs } from 'antd';
import { 
  TagOutlined, 
  ApartmentOutlined, 
  ShopOutlined, 
  BgColorsOutlined,
  ToolOutlined,
  BorderOutlined,
  AppstoreOutlined,
  InboxOutlined 
} from '@ant-design/icons';
import BrandManager from '../components/master-data/BrandManager';
import CategoryManager from '../components/master-data/CategoryManager';
import ManufacturerManager from '../components/master-data/ManufacturerManager';

const { Title } = Typography;

const MasterDataPage = () => {
  const items = [
    {
      key: 'brands',
      label: (
        <span>
          <TagOutlined />
          Brands
        </span>
      ),
      children: <BrandManager />,
    },
    {
      key: 'categories',
      label: (
        <span>
          <ApartmentOutlined />
          Categories
        </span>
      ),
      children: <CategoryManager />,
    },
    {
      key: 'manufacturers',
      label: (
        <span>
          <ShopOutlined />
          Manufacturers
        </span>
      ),
      children: <ManufacturerManager />,
    },
  ];

  return (
    <div>
      <Title level={2}>Master Data Management</Title>
      <Tabs
        defaultActiveKey="brands"
        items={items}
        tabPosition="top"
        type="card"
      />
    </div>
  );
};

export default MasterDataPage;
