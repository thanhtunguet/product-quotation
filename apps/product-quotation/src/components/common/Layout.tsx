
import React from 'react';
import { Layout as AntdLayout, Space } from 'antd';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import LanguageSwitcher from './LanguageSwitcher';

const { Header, Content } = AntdLayout;

const Layout = () => {
  return (
    <AntdLayout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Navigation />
        </div>
        <LanguageSwitcher />
      </Header>
      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
          <Outlet />
        </div>
      </Content>
    </AntdLayout>
  );
};

export default Layout;
