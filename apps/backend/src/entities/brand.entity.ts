import { Entity } from 'typeorm';
import { MasterDataEntity } from './master-data.entity';

@Entity('brands')
export class Brand extends MasterDataEntity {}