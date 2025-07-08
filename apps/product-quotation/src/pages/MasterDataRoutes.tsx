import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BrandManager from '../components/master-data/BrandManager';
import CategoryManager from '../components/master-data/CategoryManager';
import ManufacturerManager from '../components/master-data/ManufacturerManager';

const MasterDataRoutes = () => {
  return (
    <Routes>
      <Route path="brands" element={<BrandManager />} />
      <Route path="categories" element={<CategoryManager />} />
      <Route path="manufacturers" element={<ManufacturerManager />} />
    </Routes>
  );
};

export default MasterDataRoutes;
