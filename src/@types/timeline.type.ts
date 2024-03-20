import {Shipping} from "./order/ship.type"

export type Timeline = BaseEntity & {
    shipping: Shipping;
    data : Record<string,any>;
    status: string;
}