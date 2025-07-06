
import React, { useState, useEffect } from 'react';
import { Tree } from 'antd';
import { apiClient, Category } from '../../services/api-client';

const CategoryTree = () => {
  const [treeData, setTreeData] = useState<Category[]>([]);

  useEffect(() => {
    apiClient.getCategoryTree().then(setTreeData);
  }, []);

  const transformToAntdTree = (categories: Category[]) => {
    return categories.map(cat => ({
      title: cat.name,
      key: cat.id,
      children: transformToAntdTree(cat.children || [])
    }));
  };

  return (
    <Tree
      treeData={transformToAntdTree(treeData)}
      onSelect={(keys) => console.log('Selected:', keys)}
    />
  );
};

export default CategoryTree;
