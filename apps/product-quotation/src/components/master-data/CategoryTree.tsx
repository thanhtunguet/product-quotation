import { message, Tree } from 'antd';
import { useEffect, useState } from 'react';
import { apiClient, Category } from '../../services/api-client';

const CategoryTree = () => {
  const [treeData, setTreeData] = useState<Category[]>([]);

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const data = await apiClient.getCategoryTree();
        setTreeData(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error('Failed to fetch category tree:', error);
        setTreeData([]);
        message.error(
          `Failed to fetch categories: ${error.message || 'Unknown error'}`
        );
      }
    };

    fetchTreeData();
  }, []);

  const transformToAntdTree = (categories: Category[]): any[] => {
    return categories.map((cat) => ({
      title: cat.name,
      key: cat.id,
      children: transformToAntdTree(cat.children || []),
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
