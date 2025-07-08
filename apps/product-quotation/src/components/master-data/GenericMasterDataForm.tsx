import React, { useEffect } from 'react';
import { Button, Form, Input, Space, Switch } from 'antd';
import {
  Color,
  CreateMasterDataDto,
  MasterDataEntity,
  UpdateMasterDataDto,
} from '../../services/api-client';

interface GenericMasterDataFormProps {
  onSubmit: (data: CreateMasterDataDto | UpdateMasterDataDto) => void;
  initialData?: MasterDataEntity | null;
  hasHexCode?: boolean;
  entityName: string;
}

const GenericMasterDataForm: React.FC<GenericMasterDataFormProps> = ({
  onSubmit,
  initialData,
  hasHexCode = false,
  entityName,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      const formValues: any = {
        name: initialData.name,
        code: initialData.code,
        description: initialData.description,
        isActive: initialData.isActive,
      };

      // Add hexCode for colors
      if (hasHexCode && 'hexCode' in initialData) {
        formValues.hexCode = (initialData as Color).hexCode;
      }

      form.setFieldsValue(formValues);
    }
  }, [initialData, form, hasHexCode]);

  const handleSubmit = (values: any) => {
    const data: CreateMasterDataDto | UpdateMasterDataDto = {
      name: values.name,
      code: values.code,
      description: values.description,
      isActive: values.isActive,
    };

    // Add hexCode for colors
    if (hasHexCode && values.hexCode) {
      (data as any).hexCode = values.hexCode;
    }

    onSubmit(data);
  };

  const capitalizedEntityName =
    entityName.charAt(0).toUpperCase() + entityName.slice(1);

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
        <Input placeholder={`Enter ${entityName} name`} />
      </Form.Item>

      <Form.Item
        name="code"
        label="Code"
        rules={[{ required: true, message: 'Code is required' }]}
      >
        <Input placeholder={`Enter ${entityName} code`} />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea
          placeholder={`Enter ${entityName} description`}
          rows={3}
        />
      </Form.Item>

      {hasHexCode && (
        <Form.Item
          name="hexCode"
          label="Hex Color Code"
          rules={[
            {
              pattern: /^#([0-9A-F]{3}){1,2}$/i,
              message: 'Please enter a valid hex color code (e.g., #FF0000)',
            },
          ]}
        >
          <Input
            placeholder="#FF0000"
            addonBefore={
              <div
                className="w-5 h-5 border border-gray-300 rounded-sm"
                style={{
                  backgroundColor: Form.useWatch('hexCode', form) || '#ccc',
                }}
              />
            }
          />
        </Form.Item>
      )}

      <Form.Item name="isActive" label="Status" valuePropName="checked">
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {initialData ? 'Update' : 'Create'} {capitalizedEntityName}
          </Button>
          <Button onClick={() => form.resetFields()}>Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default GenericMasterDataForm;
