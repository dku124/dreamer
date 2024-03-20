import {Typography} from "antd";
import {Order, OrderStatus} from "@/@types/order/order.type.ts";
import {OrderHelper} from "@/common/helpers/order.helper.tsx";


type DataStatus = {
	_id:OrderStatus,
	total:number
}

function getTotal(data:DataStatus[],key:string)
{
	if(key === "")
	{
		return data?.reduce((acc,cur)=> acc + cur.total,0) || 0
	}
	return data?.find(e=>e._id === key)?.total || 0
}

function genTab(key:OrderStatus|string,label:string,color:string,data:DataStatus[])
{
	return {
		key: key,
		label: <Typography.Text style={{color:OrderHelper.GetStatusColor(key),fontWeight:"bold"}}>{label} ({getTotal(data,key)})</Typography.Text>,
	}
}

//Tất cả, Chờ Xác nhận, Đã xác Nhận, Ko liên lạc được, Số Trùng, Số phá hoại, Hủy đơn
export  const tabItems = (data?:Page<Order>) => {
	return [
		genTab("","Tất cả","#3498db",data?.status),
		genTab(OrderStatus.PENDING,"Chờ Xác nhận","#f39c12",data?.status),
		genTab(OrderStatus.CONFIRMED,"Đã xác Nhận","#27ae60",data?.status),
		genTab(OrderStatus.UNABLE_TO_CONTACT,"Không liên lạc được","#e74c3c",data?.status),
		genTab(OrderStatus.DUPLICATE_NUMBER,"Số Trùng","#8e44ad",data?.status),
		genTab(OrderStatus.HAVING_MALICIOUS_INTENT,"Số phá hoại","#c0392b",data?.status),
		genTab(OrderStatus.CANCELLED,"Hủy đơn","#2c3e50",data?.status),
	]
}