
import React from 'react';
import { Form, Input, Button, InputNumber } from 'antd';
import { apiClient, CreateQuotationDto } from '../../services/api-client';

const QuotationForm = () => {
  const onFinish = async (values: CreateQuotationDto) => {
    try {
      await apiClient.quotations.create(values);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item name="quotationNumber" label="Quotation Number" rules={[{ required: true, message: 'Please input quotation number!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="customerName" label="Customer Name" rules={[{ required: true, message: 'Please input customer name!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="totalAmount" label="Total Amount" rules={[{ required: true, message: 'Please input total amount!' }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default QuotationForm;
