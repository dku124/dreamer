// @ts-ignore
import MapJson from '@assets/json/map.json';
import {MapLevel1s, MapLevel2s, MapLevel3s} from "@/@types/map/map.type.ts";


export class MapUtil
{
	private static mapJson:MapLevel1s[] = MapJson;
	private static lv1s:Map<string,MapLevel1s> = new Map();
	private static lv2s:Map<string,MapLevel2s> = new Map();
	private static lv3s:Map<string,MapLevel3s> = new Map();
	private static _mapUtil:MapUtil;
	
	public getMapLV1()
	{
		return MapUtil.lv1s;
	}
	
	public getProvince(lv1_id?:string)
	{
		return MapUtil.lv1s.get(lv1_id  || "");
	}
	
	public getDistrict(lv2_id?:string)
	{
		return MapUtil.lv2s.get(lv2_id || "");
	}
	
	public getWard(lv3_id?:string)
	{
		return MapUtil.lv3s.get(lv3_id || "");
	}
	
	
	public static gI():MapUtil
	{
		if(!this._mapUtil){
			this._mapUtil = new MapUtil();
			this.mapJson.forEach((lv1:MapLevel1s)=>
			{
				this.lv1s.set(lv1.level1_id,lv1);
				lv1.level2s.forEach((lv2:MapLevel2s)=>
				{
					this.lv2s.set(lv2.level2_id,lv2);
					lv2.level3s.forEach((lv3:MapLevel3s)=>
					{
						this.lv3s.set(lv3.level3_id,lv3);
					})
				})
			})
		}
		return this._mapUtil;
	}
	
	public getNameLevel1()
	{
		const data = []
		for (let value of MapUtil.lv1s.values()) {
			data.push({
				level2s:value.level2s,
				entity:value,
				name:value.name,
				type:value.type,
				label:value.name,
				value:value.level1_id
			});
		}
		return data;
	}
	
	public getNameLevel2(level1_id:string)
	{
		const data = []
		const level1 = MapUtil.lv1s.get(level1_id);
		if(level1){
			for (let value of level1.level2s) {
				data.push({
					level3s:value.level3s,
					entity:value,
					name:value.name,
					type:value.type,
					label:value.name,
					value:value.level2_id
				});
			}
		}
		return data;
	}
	
	
	public getNameLevel3(level2_id:string)
	{
		const level2 = MapUtil.lv2s.get(level2_id);
		const data = []
		if(level2){
			for (let value of level2.level3s) {
				data.push({
					entity:value,
					name:value.name,
					type:value.type,
					label:value.name,
					value:value.level3_id
				});
			}
		}
		return data;
	}
}