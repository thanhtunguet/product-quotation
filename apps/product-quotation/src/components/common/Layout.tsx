import { Layout as AntdLayout } from 'antd';
import { Outlet } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import Navigation from './Navigation';

const { Header, Content } = AntdLayout;

const Layout = () => {
  return (
    <AntdLayout className="min-h-screen">
      <Header className="px-6 bg-white flex justify-between items-center">
        <div className="flex-1 flex justify-start">
          <Navigation />
        </div>
        <LanguageSwitcher />
      </Header>
      <Content className="p-6 bg-gray-100">
        <div className="bg-white p-6 rounded-lg">
          <Outlet />
        </div>
      </Content>
    </AntdLayout>
  );
};

export default Layout;
