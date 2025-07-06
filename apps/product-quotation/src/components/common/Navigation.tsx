
import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, ProductOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';

const Navigation = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: 'products',
      icon: <ProductOutlined />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: 'quotations',
      icon: <FileTextOutlined />,
      label: <Link to="/quotations">Quotations</Link>,
    },
    {
      key: 'master-data',
      icon: <SettingOutlined />,
      label: <Link to="/master-data">Master Data</Link>,
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
