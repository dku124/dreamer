import {Table, Tag} from "antd";
import {reportSelector} from "@store/report/report.slice.ts";
import {useSelector} from "react-redux";
import {ShipStatus} from "@/@types/order/order.type.ts";
import {ShipHelper} from "@/common/helpers/ship.helper.tsx";
import {NumberUtil} from "@utils/number.util.ts";

export function ShipTableAnalysis()
{
	const report = useSelector(reportSelector)
	
	const coverData = () => {
		const data = report.analysisOrder;
		 
		return Object.keys(ShipStatus).map((key,index) => {
			let sum = 0;
			let totalMoneyProduct  = 0;
			let totalMoneyShip = 0;
			let totalImportProduct = 0;
			if(data[key  as any])
			{
				sum = data[key  as any][0] || 0
				totalMoneyProduct = data[key  as any][1] || 0
				totalImportProduct = data[key  as any][2] || 0
				totalMoneyShip = data[key  as any][3] || 0
			}
			return {
				index: index,
				status: key,
				name: <Tag color={ShipHelper.toShipStatus(key).color}>{ShipHelper.toShipStatus(key).label}</Tag>,
				sum: sum,
				totalMoneyProduct: totalMoneyProduct,
				totalImportProduct: totalImportProduct,
				totalMoneyShip: totalMoneyShip,
				total: totalMoneyProduct - (totalMoneyShip + totalImportProduct)
			}
		})
	}
	return (
		<Table className={"table shadow border-radius" } dataSource={coverData()} pagination={false} rowKey={"index"}
			   loading={report.loadings.analysisOrder == 0}
			   summary={(data) => (
				   <Table.Summary.Row>
					   <Table.Summary.Cell index={0} align={"left"} >
						   <Tag color={"#000"}>Tổng</Tag>
					   </Table.Summary.Cell>
					   <Table.Summary.Cell index={1} align={"center"}>{NumberUtil.toNumberMoney(data.reduce((e,i)=>e+i.sum,0))}</Table.Summary.Cell>
					   <Table.Summary.Cell index={2} align={"center"}>{NumberUtil.toNumberMoney(data.reduce((e,i)=>e+i.totalMoneyShip,0))}</Table.Summary.Cell>
					   <Table.Summary.Cell index={3} align={"center"}>{NumberUtil.toNumberMoney(data.reduce((e,i)=>{
						   if (i.status === ShipStatus.RETURN || i.status === ShipStatus.RETURNED || i.status === ShipStatus.CANCELED || i.status === ShipStatus.DELIVERING_FAIL)
						   {
							   return e;
						   }
						   return e + i.totalMoneyProduct
					   },0))}</Table.Summary.Cell>
					   <Table.Summary.Cell index={4} align={"center"}>{
						   NumberUtil.toNumberMoney(data.reduce((e,i)=>{
							   if (i.status === ShipStatus.RETURN || i.status === ShipStatus.RETURNED || i.status === ShipStatus.CANCELED || i.status === ShipStatus.DELIVERING_FAIL)
							   {
								   return e;
							   }
							   return e + i.totalImportProduct
						   },0))}
					   </Table.Summary.Cell>
					   <Table.Summary.Cell index={5} align={"center"}>{
						   NumberUtil.toNumberMoney(data.reduce((e,i)=>{
							   if (i.status === ShipStatus.RETURN || i.status === ShipStatus.RETURNED || i.status === ShipStatus.CANCELED || i.status === ShipStatus.DELIVERING_FAIL)
							   {
								   return e + (i.totalMoneyShip > 0 ?i.totalMoneyShip * -1 : i.totalMoneyShip);
							   }
							   return e + i.total;
						   },0))}</Table.Summary.Cell>
				   </Table.Summary.Row>
			   )}
		
		>
			<Table.Column title={"Trạng thái"} dataIndex={"name"} key={"name"} align={"left"}/>
			<Table.Column title={"Số lượng"} dataIndex={"sum"} key={"sum"} align={"center"}  render={NumberUtil.toNumberMoney} />
			<Table.Column title={"Phí ship"} dataIndex={"totalMoneyShip"} key={"totalMoneyShip"} align={"center"} render={NumberUtil.toNumberMoney}/>
			<Table.Column title={"Doanh thu"}  align={"center"} render={(e)=>{
				// if (e.status === ShipStatus.RETURN || e.status === ShipStatus.RETURNED)
				// {
				// 	return 0
				// }
				return NumberUtil.toNumberMoney(e.totalMoneyProduct)
			}}/>
			<Table.Column title={"Tiền nhập hàng"} align={"center"} render={(e)=>{
				if (e.status === ShipStatus.RETURN || e.status === ShipStatus.RETURNED || e.status === ShipStatus.CANCELED || e.status === ShipStatus.DELIVERING_FAIL)
				{
					return 0
				}
				return NumberUtil.toNumberMoney(e.totalImportProduct)
			}}/>
			<Table.Column title={"Lợi nhuận"}  align={"center"} render={(e)=>{
				if (e.status === ShipStatus.RETURN || e.status === ShipStatus.RETURNED)
				{
					return NumberUtil.toNumberMoney(e.totalMoneyShip > 0 ?e.totalMoneyShip * -1 : e.totalMoneyShip)
				}
				return NumberUtil.toNumberMoney(e.total)
			}}/>
		</Table> 
	)
}