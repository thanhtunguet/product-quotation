import { Entity } from 'typeorm';
import { MasterDataEntity } from './master-data.entity';

@Entity('product_types')
export class ProductType extends MasterDataEntity {}