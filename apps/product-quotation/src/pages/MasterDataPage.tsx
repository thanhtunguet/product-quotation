
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
  InboxOutlined,
  BuildOutlined,
  ExpandOutlined 
} from '@ant-design/icons';
import BrandManager from '../components/master-data/BrandManager';
import CategoryManager from '../components/master-data/CategoryManager';
import ManufacturerManager from '../components/master-data/ManufacturerManager';
import GenericMasterDataManager from '../components/master-data/GenericMasterDataManager';

const { Title } = Typography;

const MasterDataPage = () => {
  const items = [
    {
      key: 'brands',
      label: (
        <span>
          <TagOutlined style={{ marginRight: 8 }} />
          Brands
        </span>
      ),
      children: <BrandManager />,
    },
    {
      key: 'categories',
      label: (
        <span>
          <ApartmentOutlined style={{ marginRight: 8 }} />
          Categories
        </span>
      ),
      children: <CategoryManager />,
    },
    {
      key: 'manufacturers',
      label: (
        <span>
          <ShopOutlined style={{ marginRight: 8 }} />
          Manufacturers
        </span>
      ),
      children: <ManufacturerManager />,
    },
    {
      key: 'materials',
      label: (
        <span>
          <BuildOutlined style={{ marginRight: 8 }} />
          Materials
        </span>
      ),
      children: <GenericMasterDataManager 
        title="Material Management" 
        apiEndpoint="materials"
        entityName="material"
      />,
    },
    {
      key: 'manufacturing-methods',
      label: (
        <span>
          <ToolOutlined style={{ marginRight: 8 }} />
          Methods
        </span>
      ),
      children: <GenericMasterDataManager 
        title="Manufacturing Method Management" 
        apiEndpoint="manufacturingMethods"
        entityName="manufacturing method"
      />,
    },
    {
      key: 'colors',
      label: (
        <span>
          <BgColorsOutlined style={{ marginRight: 8 }} />
          Colors
        </span>
      ),
      children: <GenericMasterDataManager 
        title="Color Management" 
        apiEndpoint="colors"
        entityName="color"
        hasHexCode={true}
      />,
    },
    {
      key: 'sizes',
      label: (
        <span>
          <ExpandOutlined style={{ marginRight: 8 }} />
          Sizes
        </span>
      ),
      children: <GenericMasterDataManager 
        title="Size Management" 
        apiEndpoint="sizes"
        entityName="size"
      />,
    },
    {
      key: 'product-types',
      label: (
        <span>
          <AppstoreOutlined style={{ marginRight: 8 }} />
          Types
        </span>
      ),
      children: <GenericMasterDataManager 
        title="Product Type Management" 
        apiEndpoint="productTypes"
        entityName="product type"
      />,
    },
    {
      key: 'packaging-types',
      label: (
        <span>
          <InboxOutlined style={{ marginRight: 8 }} />
          Packaging
        </span>
      ),
      children: <GenericMasterDataManager 
        title="Packaging Type Management" 
        apiEndpoint="packagingTypes"
        entityName="packaging type"
      />,
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
