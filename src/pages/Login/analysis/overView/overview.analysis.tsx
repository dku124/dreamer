import {Line} from '@ant-design/plots';
import useInterval from "@hooks/interval.hook.ts";
import {reportSelector, resetAnalysisOrder} from "@store/report/report.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import ReportThunk from "@store/report/report.thunk.ts";
import {ReportHelper} from "@/common/helpers/report.helper.tsx";

import {useEffect, useState} from "react";
import {OrderTagAnalysis} from "@components/analysis/order/OrderTag.analysis.tsx";
import {Affix, Button, Col, DatePicker, Divider, Row, Segmented, Space, Table, Typography} from "antd";
import OrderChartAnalysis from "@components/analysis/order/OrderChart.analysis.tsx";
import {DateUtil} from "@utils/date.util.tsx";
import UserThunk from "@store/user/user.thunk.ts";
import {UserRole} from "@/@types/user.type.ts";
import dayjs from "dayjs";
import ShipTagAnalysis from "@components/analysis/ship/ShipTag.analysis.tsx";
import ShipChartAnalysis from "@components/analysis/ship/ShipChart.analysis.tsx";
import {ShipTableAnalysis} from "@components/analysis/ship/ShipTable.analysis.tsx";
import {RepoTableAnalysis} from "@components/analysis/repo/RepoTable.analysis.tsx";
import ShipChartByProvince from "@components/analysis/ship/ShipChartByProvince.tsx";
import {ShipStatus} from "@/@types/order/order.type.ts";
import {MapUtil} from "@utils/map.util.ts";
import {ColorUtil} from "@utils/color.util.ts";
import {ShipDetailProvice} from "@/modals/analysis/ship/shipDetailProvice.tsx";
import {ShipHelper} from "@/common/helpers/ship.helper.tsx";
import {configSelector} from "@store/config/config.slice.ts";

export default function OverviewAnalysis() {

	const dispatch = useDispatch<AppDispatch>()
	const report = useSelector(reportSelector)
	const setting = useSelector(configSelector)
	const [query, setQuery] = useState<Record<string, any>>({
		from: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
		to: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
	})
	const [configModal, setConfigModal] = useState<Record<string, boolean>>({
		detailByProvince: false,
	})
	
	const toggleModal = (modal: string) => {
		return () => {
			setConfigModal({...configModal, [modal]: !configModal[modal]})
		}
	}
	
	const fetch = () => {
		dispatch(ReportThunk.orderByday(query))
		dispatch(ReportThunk.groupOrderByStatus(query))
		dispatch(ReportThunk.totalOrderComfirmBySale(query))
		dispatch(ReportThunk.totalOrderShip(query))
		dispatch(ReportThunk.reportOrderByProvince(query))
		if (report.loadings.analysisOrderLoading == false)
		{
			dispatch(ReportThunk.analysisOrder(query))
		}
	}
	useInterval(fetch, 5000);
	useEffect(() => {
		dispatch(UserThunk.getUserByRole([UserRole.TELE_SALE]))
		fetch()
		return () => {
			dispatch(resetAnalysisOrder())
		}
	}, [query]);
	
	
	const config = {
		data: ReportHelper.orderInDay(report.orderInDay),
		xField: 'label',
		yField: 'value',
		theme: setting.darkMode ? "dark" : "light",
		label: {
			style: {
				
				fontSize: 18,
				fontWeight: 600,
				textAlign:"center"
			}
		},
		
	}

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
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	
	
	
	return (
		<div id={"OverviewAnalysis"} ref={setContainer}>
			{
				configModal.detailByProvince && (<ShipDetailProvice open={configModal.detailByProvince} onCancel={toggleModal("detailByProvince")} />)
			}
			<Affix target={() => container}>
				<div style={{marginBottom: "10px"}}>
					<DatePicker.RangePicker
						// defaultValue={[
						// 	dayjs(DateUtil.getNowDateByFormat(DateUtil.dateFormat), DateUtil.dateFormat),
						// 	dayjs(DateUtil.getNowDateByFormat(DateUtil.dateFormat), DateUtil.dateFormat)
						// ]}
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
								loading={report.loadings.dowloadExcelOrder}
								onClick={() => dispatch(ReportThunk.dowloadExcelOrder(query))}
						>Xuất báo cáo đơn hàng</Button>
						<Button type={"primary"}
								loading={report.loadings.dowloadExcelShip}
								onClick={() => dispatch(ReportThunk.dowloadExcelShip(query))}
						>Xuất báo cáo vận đơn</Button>
						<Button type={"primary"}
								loading={report.loadings.dowloadExcelRepo}
								onClick={() => dispatch(ReportThunk.dowloadExcelRepo())}
						>Xuất báo cáo kho</Button>
					</Space.Compact>
				</div>
			</Affix>

			<div style={{textAlign: "center", marginBottom: "15px"}}>
				<Typography.Title level={3}>Thống kê đơn hàng</Typography.Title>
			</div>
			<OrderTagAnalysis/>
			<div className={"chart"}>
				<Row gutter={32}>
					<Col span={8}>
						<div className={"chart-order"}>
							<OrderChartAnalysis type={1}/>
						</div>
					</Col>
					<Col span={16}>
						<div className={"realtime"} >
							<Line {...config} />
						</div>
					</Col>
				</Row>
			</div>
			<Divider/>
			<div style={{textAlign: "center", marginBottom: "15px", marginTop: "15px"}}>
				<Typography.Title level={3}>Thống kê vận đơn</Typography.Title>
			</div>
			<ShipTagAnalysis/>
			<div className={"chart"} style={{marginTop: "25px"}}>
				<Row gutter={32}>
					<Col span={8}>
						<div className={"chart-order"}>
							<ShipChartAnalysis/>
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
			<div className={"chart"} style={{marginTop:"25px"}}>
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
					<Col span={12 } style={{paddingBottom:"44px"}}>
						<div className={"chart-order-byProvince"}>
							<Segmented
								style={{
									marginBottom: "7px"
								}}
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
								pagination={{
									pageSize: 6
								}}
								rowKey={e=>e.province}
								dataSource={coverData()} >
								<Table.Column  title={"Tỉnh thành"} dataIndex={"province"} render={(value,record:any)=>{
									return MapUtil.gI().getProvince(record.province)?.name || ""
								}} />
								<Table.Column  title={"Số đơn"} dataIndex={"count"} />

							</Table>
						</div>
					</Col>
				</Row>
			</div>
			<Divider/>
			<div style={{textAlign: "center", marginBottom: "15px", marginTop: "15px"}}>
				<Typography.Title level={3}>Thống kê kho</Typography.Title>
			</div>
			<div className={"chart"}>
				<Row gutter={32}>
					<Col span={24}>
						<div className={"chart-order"}>
							<RepoTableAnalysis/>
						</div>
					</Col>
				</Row>
			</div>
		</div>
	)
}