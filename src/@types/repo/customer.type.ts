import {Order} from "@/@types/order/order.type.ts";

export type Customer = BaseEntity &{
    fullName: string;
    phone: string;
    address: string;
    totalOrder: number;
    totalMoney: number;
    orders: Order[];
    product : Product[]
	preOrders: PreOrder[];
	addOnInfo:AddOnInfoCustomer
};
export enum Gender {
	MALE,
	FEMALE
}
export  enum CustomerType {
	PERSONAL ,
	BUSINESS
}
export interface AddOnInfoCustomer {
	img?: string;
	dateOfBirth?: string;
	gender?: Gender;
	type?: CustomerType;
	email?: string;
	fb?: string;
	note?: string;
}
export type PreInfo =
	{
		order:Array<PreOrder>;
	}

export type PreOrder =
	{
		id:string;
		details:Array<PreOrderDetail>;
		discount:number;
		createdAt:Date;
	}

export type PreOrderDetail =
	{
		productName:string;
		quantity:number;
		price:number;

	}



interface Address {
	address: string;
	district: string;
	province: string;
	ward: string;
	street: string;
}

interface Product {
	id: { $oid: string };
	product_id: { $oid: string };
	option_id: { $oid: string };
	weight: number;
	quantity: number;
	price: number;
	name: string;
	option_name: string;
	quantityBroken: number;
}

interface Sale {
	$oid: string;
}

interface CreatedAt {
	$date: string;
}

interface UpdatedAt {
	$date: string;
}

interface PickupDate {
	$date: string;
}
export interface DataOrderPre {
	_id: { $oid: string };
	code: string;
	ip: string;
	name: string;
	phone: string;
	shipInfo: Address;
	freeShip: boolean;
	orderInfo: string;
	shipFee: number;
	weight: number;
	products: Product[];
	sale: Sale;
	status: string;
	type: string;
	discount: number;
	shippingType: string;
	createdAt: CreatedAt;
	updatedAt: UpdatedAt;
	__v: number;
	deliverShift: number;
	pickupDate: PickupDate;
	pickupShift: number;
}
