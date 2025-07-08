import {
  ApartmentOutlined,
  AppstoreOutlined,
  BgColorsOutlined,
  BuildOutlined,
  ExpandOutlined,
  InboxOutlined,
  ShopOutlined,
  TagOutlined,
  ToolOutlined,
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
          <TagOutlined className="mr-2" />
          {t('masterData.brands')}
        </span>
      ),
      children: <BrandManager />,
    },
    {
      key: 'categories',
      label: (
        <span>
          <ApartmentOutlined className="mr-2" />
          {t('masterData.categories')}
        </span>
      ),
      children: <CategoryManager />,
    },
    {
      key: 'manufacturers',
      label: (
        <span>
          <ShopOutlined className="mr-2" />
          {t('masterData.manufacturers')}
        </span>
      ),
      children: <ManufacturerManager />,
    },
    {
      key: 'materials',
      label: (
        <span>
          <BuildOutlined className="mr-2" />
          {t('masterData.materials')}
        </span>
      ),
      children: (
        <GenericMasterDataManager
          title={t('masterData.materialManagement')}
          apiEndpoint="materials"
          entityName="material"
        />
      ),
    },
    {
      key: 'manufacturing-methods',
      label: (
        <span>
          <ToolOutlined className="mr-2" />
          {t('masterData.methods')}
        </span>
      ),
      children: (
        <GenericMasterDataManager
          title={t('masterData.methodManagement')}
          apiEndpoint="manufacturingMethods"
          entityName="manufacturing method"
        />
      ),
    },
    {
      key: 'colors',
      label: (
        <span>
          <BgColorsOutlined className="mr-2" />
          {t('masterData.colors')}
        </span>
      ),
      children: (
        <GenericMasterDataManager
          title={t('masterData.colorManagement')}
          apiEndpoint="colors"
          entityName="color"
          hasHexCode={true}
        />
      ),
    },
    {
      key: 'sizes',
      label: (
        <span>
          <ExpandOutlined className="mr-2" />
          {t('masterData.sizes')}
        </span>
      ),
      children: (
        <GenericMasterDataManager
          title={t('masterData.sizeManagement')}
          apiEndpoint="sizes"
          entityName="size"
        />
      ),
    },
    {
      key: 'product-types',
      label: (
        <span>
          <AppstoreOutlined className="mr-2" />
          {t('masterData.types')}
        </span>
      ),
      children: (
        <GenericMasterDataManager
          title={t('masterData.typeManagement')}
          apiEndpoint="productTypes"
          entityName="product type"
        />
      ),
    },
    {
      key: 'packaging-types',
      label: (
        <span>
          <InboxOutlined className="mr-2" />
          {t('masterData.packaging')}
        </span>
      ),
      children: (
        <GenericMasterDataManager
          title={t('masterData.packagingManagement')}
          apiEndpoint="packagingTypes"
          entityName="packaging type"
        />
      ),
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
