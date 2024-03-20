import {Supplier} from "@/@types/repo/supplier.type.ts";
import {ConfigUnit} from "@/@types/config/configUnit.type.ts";
import {Product} from "@/@types/repo/product.type.ts";

export type SKU = BaseEntity & {
	supplier: Supplier;
	colors: Array<ProductColor>;
	retailPrice: number;
	price: number;
	importAddress: string;
	importDate: Date;
	priceUnit:ConfigUnit;
	note: string;
	code: string;
	state:boolean;
	product:Product;
	status: SkuStatus;
}


export type ProductColor = {
	id?: string;
	color: string;
	sizes: ProductSize[];
};

export type ProductSize = {
	code:string;
	size: string;
	quantity: number;
	reQuantity: number;
	price: number;
	weight: number;
	id?: string;
	importPrice: number;
};

export enum SkuStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

