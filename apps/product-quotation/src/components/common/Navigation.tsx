
import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, ProductOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const location = useLocation();
  const { t } = useTranslation();

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
      label: <Link to="/master-data">{t('navigation.masterData')}</Link>,
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/products')) return 'products';
    if (path.startsWith('/quotations')) return 'quotations';
    if (path.startsWith('/master-data')) return 'master-data';
    return 'dashboard';
  };

  return (
    <Menu 
      mode="horizontal" 
      items={menuItems}
      selectedKeys={[getSelectedKey()]}
      style={{ border: 'none', background: 'transparent' }}
    />
  );
};

export default Navigation;
