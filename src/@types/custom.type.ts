import {RouteObject} from 'react-router';
import {UserRole} from './user.type';

export type RouteObjectWithRoles = RouteObject & {
	roles?: UserRole[];
	children?: RouteObjectWithRoles[];
	
}

export type OfEntity<T extends BaseEntity> = {
	[key in keyof T]: any;
} & {
	[key: string]: any;
}


export type ValueOf<T> = T[keyof T];

export type Difference<T, U> = T extends U
  ? {
      [K in keyof T]: K extends keyof U ? Difference<T[K], U[K]> : T[K];
    }
  : T;