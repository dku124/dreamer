import {Product} from "@/@types/repo/product.type.ts";
import {SKU} from "@/@types/repo/sku.type.ts";

export type OrderDetail = BaseEntity & {
	product: Product;
	price: number;
	
	sku: SKU;
	quantity: number;
	color: OrderDetailColor;
	isRetail: boolean;
}

export type OrderDetailColor = {
	id?: string;
	color: string;
	size: OrderDetailSize;
};

export type OrderDetailSize = {
	size: string;
	price: number;
	weight: number;
	id?: string;
	code:string
};