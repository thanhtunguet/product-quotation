import { message, Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import { apiClient, Category } from '../../services/api-client';

const CategoryTree = () => {
  const [treeData, setTreeData] = useState<Category[]>([]);

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const data = await apiClient.getCategoryTree();
        setTreeData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch category tree:', error);
        setTreeData([]);
        message.error(
          `Failed to fetch categories: ${
            (error as Error).message || 'Unknown error'
          }`
        );
      }
    };

    fetchTreeData();
  }, []);

  interface TreeNode {
    title: string;
    key: number;
    children: TreeNode[];
  }

  const transformToAntdTree = (categories: Category[]): TreeNode[] => {
    return categories.map((cat) => ({
      title: cat.name,
      key: cat.id,
      children: transformToAntdTree(cat.children || []),
    }));
  };

  return (
    <Tree
      treeData={transformToAntdTree(treeData)}
      onSelect={(keys: React.Key[]) => console.log('Selected:', keys)}
    />
  );
};

export default CategoryTree;
