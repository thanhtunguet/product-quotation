
import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { apiClient, Quotation } from '../../services/api-client';
import { Link } from 'react-router-dom';

const QuotationList = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    apiClient.quotations.getAll().then(setQuotations);
  }, []);

  const columns = [
    { title: 'Quotation Number', dataIndex: 'quotationNumber', key: 'quotationNumber' },
    { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Total Amount', dataIndex: 'totalAmount', key: 'totalAmount' },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Quotation) => (
        <span>
          <Link to={`/quotations/${record.id}/edit`}>Edit</Link>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Link to="/quotations/new">
        <Button type="primary">Create Quotation</Button>
      </Link>
      <Table dataSource={quotations} columns={columns} />
    </div>
  );
};

export default QuotationList;
