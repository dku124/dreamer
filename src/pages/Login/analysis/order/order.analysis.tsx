import {Line} from '@ant-design/plots';
import useInterval from "@hooks/interval.hook.ts";
import {reportSelector} from "@store/report/report.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import ReportThunk from "@store/report/report.thunk.ts";
import {ReportHelper} from "@/common/helpers/report.helper.tsx";
import {useEffect, useState} from "react";
import {OrderTagAnalysis} from "@components/analysis/order/OrderTag.analysis.tsx";
import {Button, Col, DatePicker, Row, Space} from "antd";
import OrderChartAnalysis from "@components/analysis/order/OrderChart.analysis.tsx";
import {DateUtil} from "@utils/date.util.tsx";
import dayjs from "dayjs";
import {configSelector} from "@store/config/config.slice.ts";

export default function OrderAnalysis() {

	const dispatch = useDispatch<AppDispatch>()
	const report = useSelector(reportSelector)
	const [query, setQuery] = useState<Record<string, any>>({
		from: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
		to: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
	})
	const setting = useSelector(configSelector)



	useInterval(() => {
		dispatch(ReportThunk.orderByday(query))
		dispatch(ReportThunk.groupOrderByStatus(query))
		dispatch(ReportThunk.totalOrderComfirmBySale(query))
		// dispatch(ReportThunk.analysisOrder(query))
	}, 5000);

	useEffect(() => {
		dispatch(ReportThunk.orderByday(query))
		dispatch(ReportThunk.groupOrderByStatus(query))
		dispatch(ReportThunk.totalOrderComfirmBySale(query))
		// dispatch(UserThunk.getUserByRole([UserRole.TELE_SALE]))
		// dispatch(ReportThunk.totalOrderShip(query))
		// dispatch(ReportThunk.analysisOrder(query))
	}, [query]);


	const config = {
		data: ReportHelper.orderInDay(report.orderInDay),
		xField: 'label',
		yField: 'value',
		label: {
			style: {
				fill: setting.darkMode ? "#fff" : "#000",
				fontSize: 18,
				fontWeight: 600,
				textAlign:"center"
			}
		},
	}
	return (
		<div id={"OverviewAnalysis"}>
			<div style={{marginBottom: "10px"}}>
				<DatePicker.RangePicker
					value={[
						dayjs(query.from, DateUtil.dateFormat),
						dayjs(query.to, DateUtil.dateFormat)
					]}
					onChange={(_, e: Array<string>) => {
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
					
				</Space.Compact>
			</div>
			
			<OrderTagAnalysis/>
			<div className={"chart"}>
				<Row gutter={32}>
					<Col span={8}>
						<div className={"chart-order"}>
							<OrderChartAnalysis/>
						</div>
					</Col>
					<Col span={16}>
						<div className={"realtime"}>
							<Line {...config} />
						</div>
					</Col>
				</Row>
			</div>
		</div>
	)
}