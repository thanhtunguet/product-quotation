import { Entity } from 'typeorm';
import { MasterDataEntity } from './master-data.entity';

@Entity('manufacturing_methods')
export class ManufacturingMethod extends MasterDataEntity {}