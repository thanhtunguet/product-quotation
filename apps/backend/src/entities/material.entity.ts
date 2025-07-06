import { Entity } from 'typeorm';
import { MasterDataEntity } from './master-data.entity';

@Entity('materials')
export class Material extends MasterDataEntity {}