import {ProductUnit} from "@/@types/repo/product-unit.type.ts";
import {Category} from "@/@types/repo/category.type.ts";
import {SKU} from "@/@types/repo/sku.type.ts";

export type Product = BaseEntity & {
	name: string;
	code: string;
	link: string;
	size: Array<number>;
	inventory: Array<number>;
	warrantyPeriod: number;
	warrantyUnit: WarrantyUnit;
	description: string;
	img: string;
	unit: ProductUnit;
	category: Category;
	status: ProductStatus;
	skus: SKU[];
}

export enum ProductStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export enum WarrantyUnit {
	DAY = 'DAY',
	MONTH = 'MONTH',
	YEAR = 'YEAR',
}

