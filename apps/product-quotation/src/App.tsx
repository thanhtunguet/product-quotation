import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { theme } from './theme';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import QuotationsPage from './pages/QuotationsPage';
import MasterDataPage from './pages/MasterDataPage';
import BrandManager from './components/master-data/BrandManager';
import CategoryManager from './components/master-data/CategoryManager';
import ManufacturerManager from './components/master-data/ManufacturerManager';
import GenericMasterDataManager from './components/master-data/GenericMasterDataManager';
import { useTranslation } from 'react-i18next';
import './i18n';

const MasterDataWrapper = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">{title}</h2>
      {children}
    </div>
  );
};

const App = () => {
  const { t } = useTranslation();

  return (
    <ConfigProvider theme={theme} locale={viVN}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="quotations" element={<QuotationsPage />} />
            <Route path="master-data" element={<MasterDataPage />} />
            <Route
              path="master-data/brands"
              element={
                <MasterDataWrapper title={t('masterData.brandManagement')}>
                  <BrandManager />
                </MasterDataWrapper>
              }
            />
            <Route
              path="master-data/categories"
              element={
                <MasterDataWrapper title={t('masterData.categoryManagement')}>
                  <CategoryManager />
                </MasterDataWrapper>
              }
            />
            <Route
              path="master-data/manufacturers"
              element={
                <MasterDataWrapper
                  title={t('masterData.manufacturerManagement')}
                >
                  <ManufacturerManager />
                </MasterDataWrapper>
              }
            />
            <Route
              path="master-data/materials"
              element={
                <MasterDataWrapper title={t('masterData.materialManagement')}>
                  <GenericMasterDataManager
                    title={t('masterData.materialManagement')}
                    apiEndpoint="materials"
                    entityName="material"
                  />
                </MasterDataWrapper>
              }
            />
            <Route
              path="master-data/manufacturing-methods"
              element={
                <MasterDataWrapper title={t('masterData.methodManagement')}>
                  <GenericMasterDataManager
                    title={t('masterData.methodManagement')}
                    apiEndpoint="manufacturingMethods"
                    entityName="manufacturing method"
                  />
                </MasterDataWrapper>
              }
            />
            <Route
              path="master-data/colors"
              element={
                <MasterDataWrapper title={t('masterData.colorManagement')}>
                  <GenericMasterDataManager
                    title={t('masterData.colorManagement')}
                    apiEndpoint="colors"
                    entityName="color"
                    hasHexCode={true}
                  />
                </MasterDataWrapper>
              }
            />
            <Route
              path="master-data/sizes"
              element={
                <MasterDataWrapper title={t('masterData.sizeManagement')}>
                  <GenericMasterDataManager
                    title={t('masterData.sizeManagement')}
                    apiEndpoint="sizes"
                    entityName="size"
                  />
                </MasterDataWrapper>
              }
            />
            <Route
              path="master-data/product-types"
              element={
                <MasterDataWrapper title={t('masterData.typeManagement')}>
                  <GenericMasterDataManager
                    title={t('masterData.typeManagement')}
                    apiEndpoint="productTypes"
                    entityName="product type"
                  />
                </MasterDataWrapper>
              }
            />
            <Route
              path="master-data/packaging-types"
              element={
                <MasterDataWrapper title={t('masterData.packagingManagement')}>
                  <GenericMasterDataManager
                    title={t('masterData.packagingManagement')}
                    apiEndpoint="packagingTypes"
                    entityName="packaging type"
                  />
                </MasterDataWrapper>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
