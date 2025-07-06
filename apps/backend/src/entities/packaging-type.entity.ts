import { Entity } from 'typeorm';
import { MasterDataEntity } from './master-data.entity';

@Entity('packaging_types')
export class PackagingType extends MasterDataEntity {}