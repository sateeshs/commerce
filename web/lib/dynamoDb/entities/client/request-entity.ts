import { BaseEntity } from "./base-entity";

export interface RequestEntity extends BaseEntity {
order: number;
locale: string;
requestName: string;
requestTitle: string;
requestDescription: string;
isEnabled: string;
}