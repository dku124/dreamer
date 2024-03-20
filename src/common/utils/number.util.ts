import {StringUtil} from "./string.util";

export class NumberUtil 
{
    fromString(value: string): number
    {
        if(value === null || value === undefined) return 0;
        value = value.toString();
        value = StringUtil.RemoveChar(value, '.');
        value = StringUtil.RemoveChar(value, ',');
        return Number(value);
    }
	
	static toIndex(value: any, record: any, index: number): number
	{
		return index + 1;
	}
	
	static toNumberMoney(value: number|bigint = 0): string
	{
		
		return  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace("₫","")
	}
	
	// giá chuyển đổi cho phép
	
	
	
	
	static toFloatMoney(value: number): string
	{
		value = Number(value.toFixed(2));
		var parts = value.toString().split(".");
		parts[0] = NumberUtil.toNumberMoney(Number(parts[0])).trim();
		return parts.join(",");
	}
	
	// hàm làm tròn số thành số nguyên
	static toInt(value: number): number
	{
		return Math.round(value);
	}
	
	static toMoney()
	{
		return {
			fromNumber:(value:number)=>
			{
				if (typeof value === "string")
				{
					value = Number(StringUtil.RemoveChar(`${value}`.trim(), '.'));
				}
				return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace("₫","").trim();
			},
			fromString:(value:string)=>
			{
				return  Number(StringUtil.RemoveChar(`${value}`.trim(), '.'));
			}
		}
	}
	
	
}