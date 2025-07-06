export interface MasterDataEntity {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedAt?: Date | null;
}