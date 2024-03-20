import {User} from "@/@types/user.type.ts";
import {Timeline} from "@/@types/order/timeline.type.ts";
import {ShipStatus} from "@/@types/order/order.type.ts";

export type ShipInfo = {
	fullName?: string;
	phone?: string;
	address?: string;
	district?: string;
	province?: string;
	ward?: string;
	street?: string;
};
export type AddOnInfo = {
	originalId?: string;
	itemCode?: string;
}


export enum ShipSession {
	MORNING = 'MORNING',
	AFTERNOON = 'AFTERNOON',
	EVENING = 'EVENING',
}




export enum ShipType {
	GHN = 'GHN',
	GHTK = 'GHTK',
	VIETTEL_POST = 'VIETTEL_POST',
	VNPOST = 'VNPOST',
	UNKNOWN = 'UNKNOWN',
}

export type Shipping =BaseEntity & {
	to: ShipInfo;
	addOnInfo:AddOnInfo;
	code: string;
	packer:User;
	fee: number;
	timePacket: Date;
	pickUpDate: Date;
	pickSession: ShipSession;
	shiftSession: ShipSession;
	type: ShipType;
	status: ShipStatus;
	weight: number;
	timelines: Timeline[];
	note?: string;
	freeShip?: boolean;
}