export enum UserRole {
	WAREHOUSE = 'WAREHOUSE',
	TELE_SALE = 'TELE_SALE',
	ACCOUNTANT = 'ACCOUNTANT',
	ADMIN = 'ADMIN',
	LEADER = 'LEADER',
	MARKETING = 'MARKETING',
	DELIVERY = 'DELIVERY',
}
export enum UserStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}
export type User = BaseEntity & {
	username: string;
	password: string;
	fullName?: string;
	roles: UserRole[];
	status: UserStatus;
}
export type JwtResponse = {
	token:string;
	roles:UserRole[];
}