export enum SupplierStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export type Supplier = BaseEntity &  {
	name:string
	shortName: string
	phones: Array<string>
	address: string;
	status: SupplierStatus
	email: string
	description: string
}