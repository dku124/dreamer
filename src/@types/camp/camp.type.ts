import {Product} from "@/@types/repo/product.type.ts";
import {Ad} from "@/@types/camp/ad.type.ts";

export type Camp = BaseEntity & {
	campName: string;
	typeCamp: CampType;
	priceAllow: number;
	product: Product;
	status: CampStatus;
	totalWebcake: number;
	ads: Ad[];
}

export enum CampType {
	TEST = 'TEST',
	MAIN = 'MAIN',
	STOP = 'STOP',
}
export enum CampStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}
