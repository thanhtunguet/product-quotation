import { Entity } from 'typeorm';
import { MasterDataEntity } from './master-data.entity';

@Entity('sizes')
export class Size extends MasterDataEntity {}