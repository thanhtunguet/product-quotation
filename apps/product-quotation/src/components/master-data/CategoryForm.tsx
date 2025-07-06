import { Button, Form, Input, Select, Space, Switch } from 'antd';
import React, { useEffect } from 'react';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../services/api-client';

interface CategoryFormProps {
  onSubmit: (data: CreateCategoryDto | UpdateCategoryDto) => void;
  initialData?: Category | null;
  categories: Category[];
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSubmit, initialData, categories }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        code: initialData.code,
        description: initialData.description,
        parentId: initialData.parentId,
        isActive: initialData.isActive,
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: any) => {
    const data = {
      ...values,
      parentId: values.parentId || undefined,
    };
    onSubmit(data);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        isActive: true,
      }}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Name is required' }]}
      >
        <Input placeholder="Enter category name" />
      </Form.Item>

      <Form.Item
        name="code"
        label="Code"
        rules={[{ required: true, message: 'Code is required' }]}
      >
        <Input placeholder="Enter category code" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
      >
        <Input.TextArea placeholder="Enter description" rows={3} />
      </Form.Item>

      <Form.Item
        name="parentId"
        label="Parent Category"
      >
        <Select
          placeholder="Select parent category (optional)"
          allowClear
        >
          <Select.Option value={undefined}>None (Root Category)</Select.Option>
          {categories
            .filter(cat => cat.id !== initialData?.id)
            .map(cat => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="isActive"
        label="Status"
        valuePropName="checked"
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {initialData ? 'Update' : 'Create'}
          </Button>
          <Button onClick={() => form.resetFields()}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;