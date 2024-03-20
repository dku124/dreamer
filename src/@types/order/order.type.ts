import {User} from "@/@types/user.type.ts";
import {OrderDetail} from "@/@types/order/detail.type.ts";
import {Shipping} from "@/@types/order/ship.type.ts";

export type Order = BaseEntity & {
	code:string;
	status:OrderStatus;
	state:ShipStatus;
	tag: OrderTag;
	type: OrderType;
	source: OrderSource;
	timeConfirm?: Date;
	userConfirm?: User;
	sale: User;
	addOnInfo: AddOnInfo;
	discount: number;
	details: OrderDetail[];
	ship: Shipping;
	note?: string;
	
}

export type AddOnInfo =
	{
		warning: string;
		note?: string;
		link?: string;
		ip?: string;
		quantity?: string;
		option?: string;
		size?: string;
	};

export enum OrderStatus {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	UNABLE_TO_CONTACT = 'UNABLE_TO_CONTACT',
	DUPLICATE_NUMBER = 'DUPLICATE_NUMBER',
	HAVING_MALICIOUS_INTENT = 'HAVING_MALICIOUS_INTENT',
	CANCELLED = 'CANCELLED',
}
export enum OrderTag {
	IN_STOCK = 'IN_STOCK',
	OUT_OF_STOCK = 'OUT_OF_STOCK',
	UNCATEGORIZED = 'UNCATEGORIZED',
}

export enum OrderType {
	WEBCAKE = 'WEBCAKE',
	CUSTOM = 'CUSTOM',
}

export enum OrderSource {
	VIETNAM = 'VN',
	UNKNOWN = 'NN',
}
export enum ShipStatus {
	NOT_CREATED = "NOT_CREATED",
	// Chờ xác nhận
	PENDING = 'PENDING',
	// Đã lấy hàng/Đã nhập kho
	CONFIRMED = 'CONFIRMED',
	// Đang giao hàng
	DELIVERING = 'DELIVERING',
	// Giao hàng không thành công
	DELIVERING_FAIL = 'DELIVERING_FAIL',
	// Đã giao hàng
	DELIVERED = 'DELIVERED',
	// Đã hủy
	CANCELED = 'CANCELED',
	// trả hàng
	RETURN = 'RETURN',
	// đã trả hàng
	RETURNED = 'RETURNED',
}

export enum OrderWarning {
	DUPLICATE_ORDER = 'DUPLICATE_ORDER',
}