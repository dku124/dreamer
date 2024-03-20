import {Modal, ModalProps, Table} from "antd";
import {NumberUtil} from "@utils/number.util.ts";
import {useSelector} from "react-redux";
import {reportSelector} from "@store/report/report.slice.ts";
import {MapUtil} from "@utils/map.util.ts";
import {ColorUtil} from "@utils/color.util.ts";

export default function CustomerReportByProvinceModal(props:ModalProps)
{
	const report = useSelector(reportSelector)
	const coverData=() => {
		//0.03
		if(Object.keys(report.reportCustomerByProvince).length > 0)
		{
			let totalCustomer = 0;
			Object.entries(report.reportCustomerByProvince).forEach(([key, value]) => {
				totalCustomer += value[2];
			});
			let data: { province: string; item: string | undefined; count: number; color: string; percent: number;newCustomer:number,oldCustomer:number;total:number }[] = [];
			Object.entries(report.reportCustomerByProvince).forEach(([key, value]) => {
				if (value[2] > 0) {
					data.push({
						province: key,
						item: MapUtil.gI().getProvince(key)?.name.replace("Tỉnh", "T.").replace("Thành phố", "TP."),
						count: value[1],
						color: ColorUtil.generateColor(MapUtil.gI().getProvince(key)?.name || "").p1,
						percent: value[2] / totalCustomer,
						newCustomer: value[3],
						oldCustomer: value[4],
						total: value[0],
					})
				}
			});
			return data.sort((a, b) => b.count - a.count);

		}
		return []

	}
	return <Modal {...props}  title={"Thống kê khách hàng theo tỉnh thành"} width={1080}>
		<Table dataSource={coverData()}>
			<Table.Column title={"STT"} width={50} render={NumberUtil.toIndex} align={"center"} />
			<Table.Column  title={"Tỉnh thành"}  width={250} dataIndex={"item"}   />
			<Table.Column  title={"SL đơn hàng"}  width={150} dataIndex={"count"} align={"center"}  sorter={(a:any,b:any)=>a.count-b.count}/>
			<Table.Column  title={"Khách mới"}  width={150} dataIndex={"newCustomer"} align={"center"} sorter={(a:any,b:any)=>a.newCustomer-b.newCustomer} />
			<Table.Column  title={"Khách cũ"} width={150} dataIndex={"oldCustomer"} align={"center"} sorter={(a:any,b:any)=>a.oldCustomer-b.oldCustomer} />
			<Table.Column title={"Doanh thu"} dataIndex={"total"} align={"right"} render={NumberUtil.toNumberMoney} sorter={(a:any,b:any)=>a.total-b.total}  />
		</Table>
	</Modal>
}