
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button } from 'antd';
import { CreateMasterDataDto } from '../../services/api-client';

interface MasterDataFormProps {
  onSubmit: (data: CreateMasterDataDto) => void;
}

const MasterDataForm: React.FC<MasterDataFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateMasterDataDto>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input 
        {...register('name', { required: 'Name is required' })}
        placeholder="Name"
      />
      {errors.name && <span>{errors.name.message}</span>}
      <Input 
        {...register('code')}
        placeholder="Code"
      />
      <Button type="primary" htmlType="submit">Submit</Button>
    </form>
  );
};

export default MasterDataForm;
