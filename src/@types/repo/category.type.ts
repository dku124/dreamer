import {Product} from "@/@types/repo/product.type.ts";
import {SKU} from "@/@types/repo/sku.type.ts";
import {ConfigUnit} from "@/@types/config/configUnit.type.ts";

export enum CategoryStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export type Category = BaseEntity & {
	name:string;
	status: CategoryStatus;
	products: Product[];
	skus: SKU[];
	priceUnits: ConfigUnit[];
}