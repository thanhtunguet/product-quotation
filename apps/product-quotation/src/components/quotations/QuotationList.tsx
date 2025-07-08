import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import { apiClient, Quotation } from '../../services/api-client';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const QuotationList = () => {
  const { t } = useTranslation();
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    apiClient.quotations.getAll().then(setQuotations);
  }, []);

  const columns = [
    {
      title: t('quotations.quotationNumber'),
      dataIndex: 'quotationNumber',
      key: 'quotationNumber',
    },
    {
      title: t('quotations.customer'),
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: t('quotations.totalAmount'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: t('common.actions'),
      key: 'action',
      render: (_: unknown, record: Quotation) => (
        <span>
          <Link to={`/quotations/${record.id}/edit`}>{t('common.edit')}</Link>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Link to="/quotations/new">
        <Button type="primary">{t('quotations.create')}</Button>
      </Link>
      <Table dataSource={quotations} columns={columns} />
    </div>
  );
};

export default QuotationList;
