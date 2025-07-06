
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Switch, Space, Select, InputNumber, TreeSelect, Tabs, Card, Row, Col } from 'antd';
import { CreateProductDto, Product, Category, Brand, Manufacturer, apiClient } from '../../services/api-client';

const { TextArea } = Input;
const { Option } = Select;

interface ProductFormProps {
  onSubmit: (data: CreateProductDto) => void;
  initialData?: Product | null;
  categories: Category[];
  brands: Brand[];
  manufacturers: Manufacturer[];
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  onSubmit, 
  initialData, 
  categories,
  brands,
  manufacturers 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // Additional master data
  const [materials, setMaterials] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [packagingTypes, setPackagingTypes] = useState<any[]>([]);
  const [manufacturingMethods, setManufacturingMethods] = useState<any[]>([]);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        code: initialData.code,
        sku: initialData.sku,
        categoryId: initialData.categoryId,
        brandId: initialData.brandId,
        manufacturerId: initialData.manufacturerId,
        materialId: initialData.materialId,
        manufacturingMethodId: initialData.manufacturingMethodId,
        colorId: initialData.colorId,
        sizeId: initialData.sizeId,
        productTypeId: initialData.productTypeId,
        packagingTypeId: initialData.packagingTypeId,
        imageUrl: initialData.imageUrl,
        description: initialData.description,
        basePrice: initialData.basePrice,
        isActive: initialData.isActive,
      });
    }
  }, [initialData, form]);

  // Load additional master data with error handling
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        // Try to load additional master data, but don't fail if APIs aren't implemented
        const promises = [
          apiClient.materials.getAll().catch(() => []),
          apiClient.colors.getAll().catch(() => []),
          apiClient.sizes.getAll().catch(() => []),
          apiClient.productTypes.getAll().catch(() => []),
          apiClient.packagingTypes.getAll().catch(() => []),
          apiClient.manufacturingMethods.getAll().catch(() => []),
        ];

        const [
          materialsData,
          colorsData,
          sizesData,
          productTypesData,
          packagingTypesData,
          manufacturingMethodsData,
        ] = await Promise.all(promises);

        setMaterials(materialsData);
        setColors(colorsData);
        setSizes(sizesData);
        setProductTypes(productTypesData);
        setPackagingTypes(packagingTypesData);
        setManufacturingMethods(manufacturingMethodsData);
      } catch (error) {
        console.error('Some master data APIs are not available:', error);
      }
    };

    loadMasterData();
  }, []);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const productData: CreateProductDto = {
        name: values.name,
        code: values.code,
        sku: values.sku,
        categoryId: values.categoryId,
        brandId: values.brandId || undefined,
        manufacturerId: values.manufacturerId || undefined,
        materialId: values.materialId || undefined,
        manufacturingMethodId: values.manufacturingMethodId || undefined,
        colorId: values.colorId || undefined,
        sizeId: values.sizeId || undefined,
        productTypeId: values.productTypeId || undefined,
        packagingTypeId: values.packagingTypeId || undefined,
        imageUrl: values.imageUrl || undefined,
        description: values.description || undefined,
        basePrice: values.basePrice || 0,
        isActive: values.isActive,
        dynamicAttributes: [], // TODO: Implement dynamic attributes
      };

      await onSubmit(productData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformCategoriesToTree = (categories: Category[]): any[] => {
    const rootCategories = categories.filter(cat => !cat.parentId);
    
    const buildTree = (parentCategories: Category[]): any[] => {
      return parentCategories.map(cat => ({
        value: cat.id,
        title: cat.name,
        key: cat.id,
        children: buildTree(categories.filter(child => child.parentId === cat.id)),
      }));
    };

    return buildTree(rootCategories);
  };

  const basicInfoTab = (
    <Card>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Product name is required' }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="code"
            label="Product Code"
            rules={[{ required: true, message: 'Product code is required' }]}
          >
            <Input placeholder="Enter product code" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="sku"
            label="SKU"
          >
            <Input placeholder="Enter SKU (optional)" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="basePrice"
            label="Base Price"
            rules={[{ required: true, message: 'Base price is required' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0.00"
              min={0}
              step={0.01}
              precision={2}
              addonBefore="$"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="description"
        label="Description"
      >
        <TextArea placeholder="Enter product description" rows={4} />
      </Form.Item>

      <Form.Item
        name="imageUrl"
        label="Image URL"
      >
        <Input placeholder="Enter image URL (optional)" />
      </Form.Item>

      <Form.Item
        name="isActive"
        label="Status"
        valuePropName="checked"
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>
    </Card>
  );

  const categorizationTab = (
    <Card>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: 'Category is required' }]}
          >
            <TreeSelect
              placeholder="Select category"
              treeData={transformCategoriesToTree(categories)}
              showSearch
              filterTreeNode={(search, node) =>
                node.title?.toLowerCase().includes(search.toLowerCase())
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="brandId"
            label="Brand"
          >
            <Select placeholder="Select brand (optional)" allowClear>
              {brands.map(brand => (
                <Option key={brand.id} value={brand.id}>{brand.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="manufacturerId"
            label="Manufacturer"
          >
            <Select placeholder="Select manufacturer (optional)" allowClear>
              {manufacturers.map(manufacturer => (
                <Option key={manufacturer.id} value={manufacturer.id}>{manufacturer.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="productTypeId"
            label="Product Type"
          >
            <Select placeholder="Select product type (optional)" allowClear>
              {productTypes.map(type => (
                <Option key={type.id} value={type.id}>{type.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  const specificationsTab = (
    <Card>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="materialId"
            label="Material"
          >
            <Select placeholder="Select material (optional)" allowClear>
              {materials.map(material => (
                <Option key={material.id} value={material.id}>{material.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="colorId"
            label="Color"
          >
            <Select placeholder="Select color (optional)" allowClear>
              {colors.map(color => (
                <Option key={color.id} value={color.id}>
                  <Space>
                    {color.hexCode && (
                      <div 
                        style={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: color.hexCode,
                          border: '1px solid #ccc',
                          borderRadius: 2,
                          display: 'inline-block'
                        }} 
                      />
                    )}
                    {color.name}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="sizeId"
            label="Size"
          >
            <Select placeholder="Select size (optional)" allowClear>
              {sizes.map(size => (
                <Option key={size.id} value={size.id}>{size.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="manufacturingMethodId"
            label="Manufacturing Method"
          >
            <Select placeholder="Select manufacturing method (optional)" allowClear>
              {manufacturingMethods.map(method => (
                <Option key={method.id} value={method.id}>{method.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="packagingTypeId"
        label="Packaging Type"
      >
        <Select placeholder="Select packaging type (optional)" allowClear style={{ width: '50%' }}>
          {packagingTypes.map(type => (
            <Option key={type.id} value={type.id}>{type.name}</Option>
          ))}
        </Select>
      </Form.Item>
    </Card>
  );

  const tabItems = [
    {
      key: 'basic',
      label: 'Basic Information',
      children: basicInfoTab,
    },
    {
      key: 'categorization',
      label: 'Categorization',
      children: categorizationTab,
    },
    {
      key: 'specifications',
      label: 'Specifications',
      children: specificationsTab,
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        isActive: true,
        basePrice: 0,
      }}
    >
      <Tabs items={tabItems} />

      <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialData ? 'Update Product' : 'Create Product'}
          </Button>
          <Button onClick={() => form.resetFields()}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
