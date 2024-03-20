export enum ProductUnitStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export type ProductUnit = BaseEntity & {
	name:string;
	status: ProductUnitStatus;
}