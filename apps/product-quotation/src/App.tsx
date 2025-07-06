
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { theme } from './theme';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import QuotationsPage from './pages/QuotationsPage';
import MasterDataPage from './pages/MasterDataPage';
import ProductForm from './components/products/ProductForm';
import QuotationForm from './components/quotations/QuotationForm';

const App = () => {
  return (
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="quotations" element={<QuotationsPage />} />
            <Route path="quotations/new" element={<QuotationForm />} />
            <Route path="quotations/:id/edit" element={<QuotationForm />} />
            <Route path="master-data" element={<MasterDataPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
