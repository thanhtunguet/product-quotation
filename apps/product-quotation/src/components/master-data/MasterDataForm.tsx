import React, { useEffect } from 'react';
import { Button, Form, Input, Space, Switch } from 'antd';
import {
  CreateMasterDataDto,
  MasterDataEntity,
  UpdateMasterDataDto,
} from '../../services/api-client';

interface MasterDataFormProps {
  onSubmit: (data: CreateMasterDataDto | UpdateMasterDataDto) => void;
  initialData?: MasterDataEntity | null;
}

const MasterDataForm: React.FC<MasterDataFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        code: initialData.code,
        description: initialData.description,
        isActive: initialData.isActive,
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: any) => {
    onSubmit(values);
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
        <Input placeholder="Enter name" />
      </Form.Item>

      <Form.Item
        name="code"
        label="Code"
        rules={[{ required: true, message: 'Code is required' }]}
      >
        <Input placeholder="Enter code" />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea placeholder="Enter description" rows={3} />
      </Form.Item>

      <Form.Item name="isActive" label="Status" valuePropName="checked">
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {initialData ? 'Update' : 'Create'}
          </Button>
          <Button onClick={() => form.resetFields()}>Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default MasterDataForm;
