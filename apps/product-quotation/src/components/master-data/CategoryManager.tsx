
import React, { useState, useEffect } from 'react';
import { Tree, Table, Button, Modal, Typography, Space, Tag, message, Tabs, Card, Row, Col, Select, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ApartmentOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { apiClient, Category, CreateCategoryDto, UpdateCategoryDto } from '../../services/api-client';
import CategoryForm from './CategoryForm';

const { Title } = Typography;

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [treeData, setTreeData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const [flatData, treeData] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getCategoryTree()
      ]);
      setCategories(flatData);
      setTreeData(treeData);
    } catch (error) {
      message.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (data: CreateCategoryDto) => {
    try {
      await apiClient.createCategory(data);
      await fetchCategories();
      setIsModalVisible(false);
      message.success('Category created successfully');
    } catch (error) {
      message.error('Failed to create category');
    }
  };

  const handleUpdate = async (data: UpdateCategoryDto) => {
    if (!editingCategory) return;
    
    try {
      await apiClient.updateCategory(editingCategory.id, data);
      await fetchCategories();
      setIsModalVisible(false);
      setEditingCategory(null);
      message.success('Category updated successfully');
    } catch (error) {
      message.error('Failed to update category');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteCategory(id);
      await fetchCategories();
      message.success('Category deleted successfully');
    } catch (error) {
      message.error('Failed to delete category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
  };

  const transformToAntdTree = (categories: Category[]): any[] => {
    return categories.map(cat => ({
      title: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{cat.name}</span>
          <Space>
            <Tag color={cat.isActive ? 'green' : 'red'}>
              {cat.isActive ? 'Active' : 'Inactive'}
            </Tag>
            <Button
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(cat);
              }}
              type="link"
              size="small"
            />
            <Popconfirm
              title="Are you sure you want to delete this category?"
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDelete(cat.id);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<DeleteOutlined />}
                onClick={(e) => e.stopPropagation()}
                type="link"
                size="small"
                danger
              />
            </Popconfirm>
          </Space>
        </div>
      ),
      key: cat.id,
      children: transformToAntdTree(cat.children || [])
    }));
  };

  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Parent',
      dataIndex: 'parent',
      key: 'parent',
      render: (parent: Category) => parent?.name || 'Root',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Category) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              type="link"
              size="small"
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'tree',
      label: (
        <span>
          <ApartmentOutlined />
          Tree View
        </span>
      ),
      children: (
        <Card>
          <Tree
            treeData={transformToAntdTree(treeData)}
            showLine
            defaultExpandAll
            loading={loading}
          />
        </Card>
      ),
    },
    {
      key: 'table',
      label: (
        <span>
          <UnorderedListOutlined />
          Table View
        </span>
      ),
      children: (
        <Table
          dataSource={categories}
          columns={tableColumns}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3}>Category Management</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Category
        </Button>
      </div>
      
      <Tabs
        defaultActiveKey="tree"
        items={tabItems}
        type="card"
      />
      
      <Modal 
        title={editingCategory ? 'Edit Category' : 'Add Category'} 
        open={isModalVisible} 
        onCancel={handleModalClose} 
        footer={null}
        width={600}
      >
        <CategoryForm 
          onSubmit={editingCategory ? handleUpdate : handleCreate}
          initialData={editingCategory}
          categories={categories}
        />
      </Modal>
    </div>
  );
};

export default CategoryManager;
