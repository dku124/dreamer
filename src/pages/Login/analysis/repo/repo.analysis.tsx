import useInterval from "@hooks/interval.hook.ts";
import {reportSelector} from "@store/report/report.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import ReportThunk from "@store/report/report.thunk.ts";
import {ReportHelper} from "@/common/helpers/report.helper.tsx";

import {useEffect, useState} from "react";
import {Button, Col, Row, Space} from "antd";
import {DateUtil} from "@utils/date.util.tsx";
import {RepoTableAnalysis} from "@components/analysis/repo/RepoTable.analysis.tsx";

export default function RepoAnalysis() {

	const dispatch = useDispatch<AppDispatch>()
	const report = useSelector(reportSelector)
	const [query, setQuery] = useState<Record<string, any>>({
		from: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
		to: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
	})



	useInterval(() => {
		dispatch(ReportThunk.productReport(query))
	}, 5000);

	useEffect(() => {
		dispatch(ReportThunk.productReport(query))
	}, [query]);


	const config = {
		data: ReportHelper.orderInDay(report.orderInDay),
		xField: 'label',
		yField: 'value',
		label: {
			style: {
				fill: '#000',
				fontSize: 18,
				fontWeight: 600,
				textAlign:"center"
			}
		},
	}
	return (
		<div id={"OverviewAnalysis"}>
			{/*<div style={{textAlign: "center", marginBottom: "15px", marginTop: "15px"}}>*/}
			{/*	<Typography.Title level={3}>Thống kê kho</Typography.Title>*/}
			{/*</div>*/}
			<Space.Compact style={{marginLeft: "10px",marginBottom:"20px"}}>
				<Button type={"primary"}
						loading={report.loadings.dowloadExcelRepo}
						onClick={() => dispatch(ReportThunk.dowloadExcelRepo())}
				>Xuất báo cáo kho</Button>
			</Space.Compact>
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