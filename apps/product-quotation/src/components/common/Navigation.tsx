import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  ApartmentOutlined,
  AppstoreOutlined,
  BgColorsOutlined,
  BuildOutlined,
  ExpandOutlined,
  FileTextOutlined,
  HomeOutlined,
  InboxOutlined,
  ProductOutlined,
  SettingOutlined,
  ShopOutlined,
  TagOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = React.useState<string[]>([]);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: <Link to="/">{t('navigation.dashboard')}</Link>,
    },
    {
      key: 'products',
      icon: <ProductOutlined />,
      label: <Link to="/products">{t('navigation.products')}</Link>,
    },
    {
      key: 'quotations',
      icon: <FileTextOutlined />,
      label: <Link to="/quotations">{t('navigation.quotations')}</Link>,
    },
    {
      key: 'master-data',
      icon: <SettingOutlined />,
      label: t('navigation.masterData'),
      children: [
        {
          key: 'brands',
          icon: <TagOutlined />,
          label: <Link to="/master-data/brands">{t('masterData.brands')}</Link>,
        },
        {
          key: 'categories',
          icon: <ApartmentOutlined />,
          label: (
            <Link to="/master-data/categories">
              {t('masterData.categories')}
            </Link>
          ),
        },
        {
          key: 'manufacturers',
          icon: <ShopOutlined />,
          label: (
            <Link to="/master-data/manufacturers">
              {t('masterData.manufacturers')}
            </Link>
          ),
        },
        {
          key: 'materials',
          icon: <BuildOutlined />,
          label: (
            <Link to="/master-data/materials">{t('masterData.materials')}</Link>
          ),
        },
        {
          key: 'methods',
          icon: <ToolOutlined />,
          label: (
            <Link to="/master-data/manufacturing-methods">
              {t('masterData.methods')}
            </Link>
          ),
        },
        {
          key: 'colors',
          icon: <BgColorsOutlined />,
          label: <Link to="/master-data/colors">{t('masterData.colors')}</Link>,
        },
        {
          key: 'sizes',
          icon: <ExpandOutlined />,
          label: <Link to="/master-data/sizes">{t('masterData.sizes')}</Link>,
        },
        {
          key: 'types',
          icon: <AppstoreOutlined />,
          label: (
            <Link to="/master-data/product-types">{t('masterData.types')}</Link>
          ),
        },
        {
          key: 'packaging',
          icon: <InboxOutlined />,
          label: (
            <Link to="/master-data/packaging-types">
              {t('masterData.packaging')}
            </Link>
          ),
        },
      ],
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/products')) return 'products';
    if (path.startsWith('/quotations')) return 'quotations';
    if (path.startsWith('/master-data/brands')) return 'brands';
    if (path.startsWith('/master-data/categories')) return 'categories';
    if (path.startsWith('/master-data/manufacturers')) return 'manufacturers';
    if (path.startsWith('/master-data/materials')) return 'materials';
    if (path.startsWith('/master-data/manufacturing-methods')) return 'methods';
    if (path.startsWith('/master-data/colors')) return 'colors';
    if (path.startsWith('/master-data/sizes')) return 'sizes';
    if (path.startsWith('/master-data/product-types')) return 'types';
    if (path.startsWith('/master-data/packaging-types')) return 'packaging';
    return 'dashboard';
  };

  React.useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/master-data')) {
      setOpenKeys(['master-data']);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Menu
      mode="horizontal"
      items={menuItems}
      selectedKeys={[getSelectedKey()]}
      openKeys={openKeys}
      onOpenChange={handleOpenChange}
      className="border-none bg-transparent text-left justify-start w-full"
    />
  );
};

export default Navigation;
