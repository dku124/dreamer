import {ShipStatus} from "@/@types/order/order.type.ts";
import {Typography} from "antd";
import {ShipHelper} from "@/common/helpers/ship.helper.tsx";

type DataStatus = {
	_id:ShipStatus,
	total:number
}

function getTotal(data:DataStatus[],key:string)
{
	if(key === "")
	{
		return data?.reduce((acc,cur)=> {
			if (cur._id != null)
			{
				return 	acc + cur.total
			}
			return acc
		},0) || 0
	}
	return data?.find(e=>e._id === key)?.total || 0
}

function genTab(key:ShipStatus|string,data:DataStatus[])
{
	const status = ShipHelper.toShipStatus(key)
	return {
		key: key,
		label: <Typography.Text style={{color:status.color,fontWeight:"bold"}}>{status.label} ({getTotal(data,key)})</Typography.Text>,
	}
}

export function tabItemsShip(data:DataStatus[])
{
	return [
		genTab("",data),
		genTab(ShipStatus.NOT_CREATED, data),
		genTab(ShipStatus.PENDING, data),
		genTab(ShipStatus.CONFIRMED, data),
		genTab(ShipStatus.DELIVERING, data),
		genTab(ShipStatus.DELIVERING_FAIL, data),
		genTab(ShipStatus.DELIVERED, data),
		genTab(ShipStatus.RETURN, data),
		genTab(ShipStatus.RETURNED, data),
		genTab(ShipStatus.CANCELED, data),
	]
}