
import {
  ApartmentOutlined,
  AppstoreOutlined,
  BgColorsOutlined,
  BuildOutlined,
  ExpandOutlined,
  InboxOutlined,
  ShopOutlined,
  TagOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { Tabs, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import BrandManager from '../components/master-data/BrandManager';
import CategoryManager from '../components/master-data/CategoryManager';
import GenericMasterDataManager from '../components/master-data/GenericMasterDataManager';
import ManufacturerManager from '../components/master-data/ManufacturerManager';

const { Title } = Typography;

const MasterDataPage = () => {
  const { t } = useTranslation();
  
  const items = [
    {
      key: 'brands',
      label: (
        <span>
          <TagOutlined style={{ marginRight: 8 }} />
          {t('masterData.brands')}
        </span>
      ),
      children: <BrandManager />,
    },
    {
      key: 'categories',
      label: (
        <span>
          <ApartmentOutlined style={{ marginRight: 8 }} />
          {t('masterData.categories')}
        </span>
      ),
      children: <CategoryManager />,
    },
    {
      key: 'manufacturers',
      label: (
        <span>
          <ShopOutlined style={{ marginRight: 8 }} />
          {t('masterData.manufacturers')}
        </span>
      ),
      children: <ManufacturerManager />,
    },
    {
      key: 'materials',
      label: (
        <span>
          <BuildOutlined style={{ marginRight: 8 }} />
          {t('masterData.materials')}
        </span>
      ),
      children: <GenericMasterDataManager 
        title={t('masterData.materialManagement')}
        apiEndpoint="materials"
        entityName="material"
      />,
    },
    {
      key: 'manufacturing-methods',
      label: (
        <span>
          <ToolOutlined style={{ marginRight: 8 }} />
          {t('masterData.methods')}
        </span>
      ),
      children: <GenericMasterDataManager 
        title={t('masterData.methodManagement')}
        apiEndpoint="manufacturingMethods"
        entityName="manufacturing method"
      />,
    },
    {
      key: 'colors',
      label: (
        <span>
          <BgColorsOutlined style={{ marginRight: 8 }} />
          {t('masterData.colors')}
        </span>
      ),
      children: <GenericMasterDataManager 
        title={t('masterData.colorManagement')}
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
          {t('masterData.sizes')}
        </span>
      ),
      children: <GenericMasterDataManager 
        title={t('masterData.sizeManagement')}
        apiEndpoint="sizes"
        entityName="size"
      />,
    },
    {
      key: 'product-types',
      label: (
        <span>
          <AppstoreOutlined style={{ marginRight: 8 }} />
          {t('masterData.types')}
        </span>
      ),
      children: <GenericMasterDataManager 
        title={t('masterData.typeManagement')}
        apiEndpoint="productTypes"
        entityName="product type"
      />,
    },
    {
      key: 'packaging-types',
      label: (
        <span>
          <InboxOutlined style={{ marginRight: 8 }} />
          {t('masterData.packaging')}
        </span>
      ),
      children: <GenericMasterDataManager 
        title={t('masterData.packagingManagement')}
        apiEndpoint="packagingTypes"
        entityName="packaging type"
      />,
    },
  ];

  return (
    <div>
      <Title level={2}>{t('masterData.title')}</Title>
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
