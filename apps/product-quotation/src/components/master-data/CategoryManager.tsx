
import { ApartmentOutlined, DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Card, message, Modal, Popconfirm, Space, Table, Tabs, Tag, Tree, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { apiClient, Category, CreateCategoryDto, UpdateCategoryDto } from '../../services/api-client';
import CategoryForm from './CategoryForm';

const { Title } = Typography;

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [treeData, setTreeData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const [flatData, treeData] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getCategoryTree()
      ]);
      setCategories(Array.isArray(flatData) ? flatData : []);
      setTreeData(Array.isArray(treeData) ? treeData : []);
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
      setTreeData([]);
      message.error(`Failed to fetch categories: ${error.message || 'Unknown error'}`);
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
    } catch (error: any) {
      console.error('Failed to create category:', error);
      message.error(`Failed to create category: ${error.message || 'Unknown error'}`);
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
    } catch (error: any) {
      console.error('Failed to update category:', error);
      message.error(`Failed to update category: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteCategory(id);
      await fetchCategories();
      message.success('Category deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      message.error(`Failed to delete category: ${error.message || 'Unknown error'}`);
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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '4px 8px',
          minHeight: '32px'
        }}>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{cat.name}</span>
          <Space size="small">
            <Tag color={cat.isActive ? 'green' : 'red'} style={{ margin: 0 }}>
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
              style={{ padding: '4px' }}
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
                style={{ padding: '4px' }}
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
      render: (_: any, record: Category) => (
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
          <ApartmentOutlined style={{ marginRight: 8 }} />
          Tree View
        </span>
      ),
      children: (
        <Card style={{ minHeight: '400px' }}>
          {treeData.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>No categories found. Click "Add Category" to create your first category.</p>
            </div>
          ) : (
            <Tree
              treeData={transformToAntdTree(treeData)}
              showLine
              defaultExpandAll
              style={{ padding: '16px 0' }}
            />
          )}
        </Card>
      ),
    },
    {
      key: 'table',
      label: (
        <span>
          <UnorderedListOutlined style={{ marginRight: 8 }} />
          Table View
        </span>
      ),
      children: (
        <Table
          dataSource={categories}
          columns={tableColumns}
          loading={loading}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
          locale={{
            emptyText: categories.length === 0 && !loading ? 
              'No categories found. Click "Add Category" to create your first category.' : 
              'No data'
          }}
          style={{ marginTop: '16px' }}
          size="middle"
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3}>Category Management</Title>
        <Space>
          <Button 
            icon={<ReloadOutlined />}
            onClick={fetchCategories}
            loading={loading}
          >
            Refresh
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Add Category
          </Button>
        </Space>
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
          onSubmit={editingCategory ? 
            (data: CreateCategoryDto | UpdateCategoryDto) => handleUpdate(data as UpdateCategoryDto) : 
            (data: CreateCategoryDto | UpdateCategoryDto) => handleCreate(data as CreateCategoryDto)
          }
          initialData={editingCategory}
          categories={categories}
        />
      </Modal>
    </div>
  );
};

export default CategoryManager;
