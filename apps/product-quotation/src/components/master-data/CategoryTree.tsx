
import React, { useState, useEffect } from 'react';
import { Tree, message } from 'antd';
import { apiClient, Category } from '../../services/api-client';

const CategoryTree = () => {
  const [treeData, setTreeData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTreeData = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getCategoryTree();
        setTreeData(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error('Failed to fetch category tree:', error);
        setTreeData([]);
        message.error(`Failed to fetch categories: ${error.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTreeData();
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
      loading={loading}
    />
  );
};

export default CategoryTree;
