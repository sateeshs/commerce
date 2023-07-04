import { BaseEntity } from "./base-entity";

export interface ResourceEntity extends BaseEntity {
order: number;
locale: string;
resourceName: string;
resourceTitle: string;
resourceDescription: string;
groupName: string;
groupDescription: string;
isEnabled: string;
}