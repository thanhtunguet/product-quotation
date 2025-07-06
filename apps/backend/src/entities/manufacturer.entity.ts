import { Entity } from 'typeorm';
import { MasterDataEntity } from './master-data.entity';

@Entity('manufacturers')
export class Manufacturer extends MasterDataEntity {}