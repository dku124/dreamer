import { Camp } from "./camp.type";

export type Ad = BaseEntity & {
	campaign_name: string;
	account_name: string;
	account_currency: string;
	ad_id: string;
	cpm: number;
	adsSpend: number;
	clicks: number;
	cpc: number;
	camp:string
}