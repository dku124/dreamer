import {Camp, CampStatus, CampType} from "@/@types/camp/camp.type.ts";
import {Tag} from "antd";
import {Ad} from "@/@types/camp/ad.type.ts";
import {NumberUtil} from "@utils/number.util.ts";
import {store} from "@store/store.ts";

export class CampHelper
{
	static toStatus(status:string)
	{
		switch (status) {
			case CampStatus.ACTIVE:
				return <Tag style={{minWidth:"100px",textAlign:"center"}} color={"#00FF99"}>Hoạt động</Tag>
			case CampStatus.INACTIVE:
				return <Tag style={{minWidth:"100px",textAlign:"center"}} color={"#CCCCCC"}>Ngưng hoạt động</Tag>
			default:
				return <Tag style={{minWidth:"100px",textAlign:"center"}} color={"#800080"}>Tất cả</Tag>
		}
	}
	
	static  toListType()
	{
		return Object.keys(CampType).map((e:any) => {
			return {
				label:CampHelper.toType(e),
				value:e
			}
		})
	}
	
	static toListStatus()
	{
		return Object.keys(CampStatus).map((e:any) => {
			return {
				label:CampHelper.toStatus(e),
				value:e
			}	
		})
	}
	
	static toCurrency(ad:Ad)
	{
		
		return <Tag style={{minWidth:"100px",textAlign:"center"}} color={"#800080"}>{ad.account_currency}</Tag>
	}
	
	
	static toType(type:string)
	{
		switch (type) {
			case CampType.MAIN:
				return <Tag style={{minWidth:"100px",textAlign:"center"}} color={"#10cf83"}>Chạy chính</Tag>
			case CampType.STOP:
				return <Tag style={{minWidth:"100px",textAlign:"center"}} color={"#FF0000"}>Dừng</Tag>
			case CampType.TEST:
				return <Tag style={{minWidth:"100px",textAlign:"center"}} color={"#c9ad19"}>Chạy test</Tag>
			default:
				return <Tag style={{minWidth:"100px",textAlign:"center"}} color={"#800080"}>Tất cả</Tag>
		}
	}
	
	static toTotalCPC(ads:Array<Ad>)
	{
		let total = 0;
		ads?.forEach(e => {
			total += e.cpc * CampHelper.toUnitPrice(e.account_currency);
		})
		if (total === 0) return "0"
		let click = ads.reduce((a,b)=>a+b.clicks,0)
		if (click === 0) return "0"
		
		return  NumberUtil.toNumberMoney(NumberUtil.toInt(total))
	}
	
	static toTotalCPM(ads:Array<Ad>)
	{
		let total = 0;
		ads?.forEach(e => {
			total += e.cpm * CampHelper.toUnitPrice(e.account_currency);
		})
		if (total === 0) return "0"
		return NumberUtil.toNumberMoney(NumberUtil.toInt(total/ads.length))
	}
	
	static toUnitPrice(name:string)
	{
		
		if (!store.getState()?.setting && !store.getState()?.setting?.configUnit?.list){
			return 1;
		}
		const value = store.getState()?.setting?.configUnit?.list?.find(e => e.key === name)?.value
		return value ? value : 1;
	}
	
	static toTotalSpend(ads:Array<Ad>)
	{
		let total = 0;
		ads?.forEach(e => {
			total += e.adsSpend * CampHelper.toUnitPrice(e.account_currency);
		})
		return NumberUtil.toNumberMoney(NumberUtil.toInt(total))
	}
	
	
	static toTotalClick(ads:Array<Ad>)
	{
		let total = 0;
		ads?.forEach(e => {
			total += e.clicks;
		})
		return NumberUtil.toNumberMoney(total)
	}

	static toCD(camp:Camp): string
	{
		const total = camp.ads?.reduce((a,b)=>a+(b.adsSpend * CampHelper.toUnitPrice(b.account_currency))  ,0)
		if (camp.totalWebcake === 0) return "0"
		return NumberUtil.toFloatMoney(NumberUtil.toInt(total / camp.totalWebcake))
	}
	
	static toCDAllow(camp:Camp): string
	{
		if (camp.priceAllow === 0) return "Chưa cấu hình"
		const total =camp?.ads?.reduce((a,b)=>a+b.adsSpend,0) / camp.totalWebcake
		const result = (total / camp.priceAllow) * 100
		if(isNaN(result)) return "0"
		return result.toFixed(2) + "%"
	}
	
	static toSpend(ad:Ad): string
	{
		const total = ad.adsSpend * CampHelper.toUnitPrice(ad.account_currency)
		return NumberUtil.toNumberMoney(NumberUtil.toInt(total))
	}
	
	static toCPC(ad:Ad): string
	{
		const total = ad.cpc * CampHelper.toUnitPrice(ad.account_currency)
		return NumberUtil.toNumberMoney(NumberUtil.toInt(total))
	}
	
	static toCPM(ad:Ad): string
	{
		const total = ad.cpm * CampHelper.toUnitPrice(ad.account_currency)
		return NumberUtil.toNumberMoney(NumberUtil.toInt(total))
	}
}