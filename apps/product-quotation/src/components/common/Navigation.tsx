
import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <Menu mode="horizontal">
      <Menu.Item key="dashboard">
        <Link to="/">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="products">
        <Link to="/products">Products</Link>
      </Menu.Item>
      <Menu.Item key="quotations">
        <Link to="/quotations">Quotations</Link>
      </Menu.Item>
      <Menu.Item key="master-data">
        <Link to="/master-data">Master Data</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Navigation;
