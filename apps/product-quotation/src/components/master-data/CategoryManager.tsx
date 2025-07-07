
import { ApartmentOutlined, DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Card, message, Modal, Popconfirm, Space, Table, Tabs, Tag, Tree, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient, Category, CreateCategoryDto, UpdateCategoryDto } from '../../services/api-client';
import CategoryForm from './CategoryForm';

const { Title } = Typography;

const CategoryManager = () => {
  const { t } = useTranslation();
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
      message.error(`${t('categories.fetchError')}: ${error.message || 'Unknown error'}`);
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
      message.success(t('categories.createSuccess'));
    } catch (error: any) {
      console.error('Failed to create category:', error);
      message.error(`${t('categories.createError')}: ${error.message || 'Unknown error'}`);
    }
  };

  const handleUpdate = async (data: UpdateCategoryDto) => {
    if (!editingCategory) return;
    
    try {
      await apiClient.updateCategory(editingCategory.id, data);
      await fetchCategories();
      setIsModalVisible(false);
      setEditingCategory(null);
      message.success(t('categories.updateSuccess'));
    } catch (error: any) {
      console.error('Failed to update category:', error);
      message.error(`${t('categories.updateError')}: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.deleteCategory(id);
      await fetchCategories();
      message.success(t('categories.deleteSuccess'));
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      message.error(`${t('categories.deleteError')}: ${error.message || 'Unknown error'}`);
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
              {cat.isActive ? t('common.active') : t('common.inactive')}
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
              title={t('confirmations.deleteCategory')}
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDelete(cat.id);
              }}
              okText={t('common.yes')}
              cancelText={t('common.no')}
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
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('common.code'),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: t('common.description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('categories.parent'),
      dataIndex: 'parent',
      key: 'parent',
      render: (parent: Category) => parent?.name || t('categories.root'),
    },
    {
      title: t('common.status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? t('common.active') : t('common.inactive')}
        </Tag>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: any, record: Category) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
            size="small"
          >
            {t('common.edit')}
          </Button>
          <Popconfirm
            title={t('confirmations.deleteCategory')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button
              icon={<DeleteOutlined />}
              type="link"
              size="small"
              danger
            >
              {t('common.delete')}
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
          {t('categories.treeView')}
        </span>
      ),
      children: (
        <Card style={{ minHeight: '400px' }}>
          {treeData.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>{t('categories.noCategories')}</p>
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
          {t('categories.tableView')}
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
            showTotal: (total, range) => `${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('common.items')}`
          }}
          locale={{
            emptyText: categories.length === 0 && !loading ? 
              t('categories.noCategories') : 
              t('common.noData')
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
        <Title level={3}>{t('categories.management')}</Title>
        <Space>
          <Button 
            icon={<ReloadOutlined />}
            onClick={fetchCategories}
            loading={loading}
          >
            {t('common.refresh')}
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            {t('categories.add')}
          </Button>
        </Space>
      </div>
      
      <Tabs
        defaultActiveKey="tree"
        items={tabItems}
        type="card"
      />
      
      <Modal 
        title={editingCategory ? t('categories.edit') : t('categories.add')} 
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
