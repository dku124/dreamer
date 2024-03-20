import {Modal, ModalProps, Table} from "antd";
import {reportSelector} from "@store/report/report.slice.ts";
import {useSelector} from "react-redux";
import {NumberUtil} from "@utils/number.util.ts";
import {DateUtil} from "@utils/date.util.tsx";
import dayjs from "dayjs";

export default function CustomerReportDetailModal(props:ModalProps)
{
	const report = useSelector(reportSelector)
	return (
		<Modal title={"Thống kê khách hàng"} {...props} width={1600} cancelText={"Đóng"} okButtonProps={{style:{display:"none"}}}>
			<Table  loading={report.loadings.reportCustomerDetail}  dataSource={report.reportCustomerDetail} pagination={{showSizeChanger:true}}>
				<Table.Column title={"STT"} render={NumberUtil.toIndex} align={"center"} />
				<Table.Column title={"Tên khách hàng"} dataIndex={"name"}/>
				<Table.Column title={"Ngày mua đầu tiên"} align={"center"} dataIndex={"startDate"} render={DateUtil.toCreateAt} sorter={(a:any,b:any)=>{
					return dayjs(a?.startDate || new Date()).unix() - dayjs(b?.startDate  || new Date()).unix()
				}}  />
				<Table.Column title={"Ngày mua gần nhất"} align={"center"} dataIndex={"endDate"} render={DateUtil.toCreateAt} sorter={(a:any,b:any)=>{
					return dayjs(a?.endDate || new Date()).unix() - dayjs(b?.endDate  || new Date()).unix()
				}}/>
				<Table.Column title={"Nhân viên chốt"} dataIndex={"listName"} render={(data:Array<string>)=>data.join("/n")} />
				<Table.Column title={"Số lần mua"} dataIndex={"orderQuantity"} align={"center"} sorter={(a:any,b:any)=>(a?.orderQuantity || 0) -(b?.orderQuantity||0)} />
				<Table.Column title={"Doanh thu"} dataIndex={"totalMoney"} sorter={(a:any,b:any)=>(a?.totalMoney || 0) -(b?.totalMoney||0)} align={"center"} render={NumberUtil.toNumberMoney}  />
			</Table>
		</Modal>
	)
}