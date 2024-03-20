import {Modal, ModalProps, Table} from "antd";
import {MapUtil} from "@utils/map.util.ts";
import {ColorUtil} from "@utils/color.util.ts";
import {reportSelector} from "@store/report/report.slice.ts";
import {useSelector} from "react-redux";
import {NumberUtil} from "@utils/number.util.ts";


export function ShipDetailProvice(props:ModalProps)
{
	const report = useSelector(reportSelector)
	const coverData=() => {

		const sortData = report.reportOrderByProvince
			.filter((item) =>  item.province&&item.count > 0)
			.sort((a, b) => {
				return Number(b.province) - Number(a.province)
			})
		const total = sortData.reduce((a, b) => a + b.count, 0);

		const data = [];

		for (let i = 0; i < sortData.length; i++) {
			const item = sortData[i];
			if (item.count > 0 && item.province) {
				data.push({
					province: item.province,
					item: MapUtil.gI().getProvince(item.province)?.name,
					count: item.count,
					color: ColorUtil.generateColor(MapUtil.gI().getProvince(item.province)?.name || "").p1,
					percent: item.count / total,
				})
			}
		}
		return data.filter(e=>e.percent <= 0.03).sort((a, b) => b.count - a.count);
	}
	return (
		<div>
			<Modal {...props}>
				<Table 
					rowKey={"province"}
					dataSource={coverData()} pagination={{
					showSizeChanger: true,
				}}>
					<Table.Column title={"STT"}  align={"center"} width={70} render={NumberUtil.toIndex}  />
					<Table.Column title={"Tỉnh thành"} dataIndex={"item"} align={"center"} width={150} />
					<Table.Column title={"Tỉ lệ"} dataIndex={"percent"} align={"center"} width={150} render={(e:number)=> (e*100).toFixed(2)+"%"} />
					<Table.Column title={"Số đơn"} dataIndex={"count"} align={"center"} width={150} />
				</Table>
			</Modal>
		</div>
	)
}