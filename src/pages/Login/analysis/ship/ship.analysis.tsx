import useInterval from "@hooks/interval.hook.ts";
import {reportSelector, resetAnalysisOrder} from "@store/report/report.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import ReportThunk from "@store/report/report.thunk.ts";

import {useEffect, useState} from "react";
import {Button, Col, DatePicker, Divider, Row, Segmented, Space, Table, Typography} from "antd";
import {DateUtil} from "@utils/date.util.tsx";
import dayjs from "dayjs";
import ShipTagAnalysis from "@components/analysis/ship/ShipTag.analysis.tsx";
import ShipChartAnalysis from "@components/analysis/ship/ShipChart.analysis.tsx";
import {ShipTableAnalysis} from "@components/analysis/ship/ShipTable.analysis.tsx";
import ShipChartByProvince from "@components/analysis/ship/ShipChartByProvince.tsx";
import {ShipStatus} from "@/@types/order/order.type.ts";
import {MapUtil} from "@utils/map.util.ts";
import {ColorUtil} from "@utils/color.util.ts";
import {ShipHelper} from "@/common/helpers/ship.helper.tsx";
import {ShipDetailProvice} from "@/modals/analysis/ship/shipDetailProvice.tsx";

export default function ShipAnalysis() {

	const dispatch = useDispatch<AppDispatch>()
	const report = useSelector(reportSelector)
	const [query, setQuery] = useState<Record<string, any>>({
		from: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
		to: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
		status: "",
	})
	const [configModal, setConfigModal] = useState<Record<string, boolean>>({
		detailByProvince: false,
	})

	const fetch = () => {
		dispatch(ReportThunk.groupOrderByStatus(query))
		dispatch(ReportThunk.totalOrderShip(query))
		if (report.loadings.analysisOrderLoading == false)
		{
			dispatch(ReportThunk.analysisOrder(query))
		}
		dispatch(ReportThunk.reportOrderByProvince(query))
	}
	useInterval(fetch, 5000);
	useEffect(() => {
		fetch()
		return () => {
			dispatch(resetAnalysisOrder())
		}
	}, [query]);



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
		return data.sort((a, b) => b.count - a.count);
	}

	const toggleModal = (modal: string) => {
		return () => {
			setConfigModal({...configModal, [modal]: !configModal[modal]})
		}
	}
	
	
	return (
		<div id={"OverviewAnalysis"}>
			{
				configModal.detailByProvince && (<ShipDetailProvice open={configModal.detailByProvince} onCancel={toggleModal("detailByProvince")} />)
			}
			<div style={{marginBottom: "10px"}}>
				<DatePicker.RangePicker
					value={[
						dayjs(query.from, DateUtil.dateFormat),
						dayjs(query.to, DateUtil.dateFormat)
					]}
					onChange={(_, e: Array<string>) => {
						dispatch(resetAnalysisOrder())
						if (_)
						{
							setQuery({
								...query,
								from:e[0],
								to:e[1],
							})
						}
						else
						{
							setQuery({
								...query,
								from:"20/11/2002",
								to:"20/11/2222",
							})
						}
					}}
					format={DateUtil.dateFormat}
					renderExtraFooter={() => {
						return DateUtil.DatePickerFooter(setQuery)
					}}
				/>
				<Space.Compact style={{marginLeft: "10px"}}>

					<Button type={"primary"}
							loading={report.loadings.dowloadExcelShip}
							onClick={() => dispatch(ReportThunk.dowloadExcelShip(query))}
					>Xuất báo cáo vận đơn</Button>
					
				</Space.Compact>
			</div>
			<ShipTagAnalysis/>
			<div className={"chart"}>
				<Row gutter={32}>
					<Col span={8}>
						<div className={"chart-order"} style={{maxWidth: "100%", maxHeight: "100%"}}>
							{
								report.orderGroupByStatus.length > 0 && <ShipChartAnalysis/>
							}
						</div>
					</Col>
					<Col span={16}>
						<div className={"realtime"}>
							<ShipTableAnalysis/>
						</div>
					</Col>
				</Row>
			</div>
			<Divider/>
			<div className={"chart"}>
				<div style={{textAlign: "center", marginBottom: "15px", marginTop: "15px"}}>
					<Typography.Title level={3}>Thống kê vận đơn theo tỉnh thành</Typography.Title>
				</div>
				<Row gutter={32}>
					<Col span={12}>
						
						<div className={"chart-order-byProvince"} style={{maxWidth: "100%", maxHeight: "100%"}}>
							{
								report.orderGroupByStatus.length > 0 && <ShipChartByProvince/>
							}
							<Button type={"primary"} onClick={toggleModal("detailByProvince")}>Chi tiết Khác</Button>
						</div>
						
					</Col>
					<Col span={12}>
						<div className={"chart-order-byProvince"}>
							<Segmented
								onChange={e=>setQuery({...query,state:e})}
								defaultValue={" "}
								options={[
									{ label: ShipHelper.toTagStatus(""), value: ' ' },
									{ label: ShipHelper.toTagStatus(ShipStatus.PENDING), value: ShipStatus.PENDING },
									{ label: ShipHelper.toTagStatus(ShipStatus.DELIVERED), value: ShipStatus.DELIVERED },
									{ label: ShipHelper.toTagStatus(ShipStatus.RETURN), value: ShipStatus.RETURNED },
									{ label: ShipHelper.toTagStatus(ShipStatus.CANCELED), value: ShipStatus.CANCELED },
								]}
							/>
							<Table
								dataSource={coverData()}
								rowKey={e=>e.province}
								pagination={{pageSize:7}}

							>
								<Table.Column  title={"Tỉnh thành"} dataIndex={"province"} render={(value,record:any)=>{
									return MapUtil.gI().getProvince(record.province)?.name || ""
								}} />
								<Table.Column  title={"Số đơn"} dataIndex={"count"} />

							</Table>
						</div>
					</Col>
				</Row>
			</div>
		</div>
	)
}