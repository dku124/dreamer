import {reportSelector, resetAnalysisCamp, resetAnalysisOrder} from "@store/report/report.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/store.ts";
import { Affix, Button, Col, DatePicker, Row, Space } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DateUtil } from "@/common/utils/date.util";
import ReportThunk from "@/common/store/report/report.thunk";
import CampChartAnalysis from "@/components/analysis/campaign/campChart.analysis";
import { CampTableAnalysis } from "@/components/analysis/campaign/campTable.analysis";
import useInterval from "@/common/hooks/interval.hook";

export default function CampaignAnalysis() {

	const dispatch = useDispatch<AppDispatch>()
	const report = useSelector(reportSelector)	
	const [query, setQuery] = useState<Record<string, any>>({
		from: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
		to: DateUtil.getNowDateByFormat(DateUtil.dateFormat),
	})
	const fetch = () => {
		if (report.loadings.analysisOrderLoading == false)
		{
			dispatch(ReportThunk.reportCampaign(query))
		}
	}

	useInterval(() => {
		dispatch(ReportThunk.reportCampaign(query))
	}, 5000);

	useEffect(() => {
		fetch()
		return () => {
			dispatch(resetAnalysisCamp())
		}
	}, [query]);
	
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	
	return (
		<div id={"CampaignAnalysis"}>
			<Affix target={() => container}>
				<div style={{marginBottom: "10px"}}>
					<DatePicker.RangePicker
						value={[
							dayjs(query.from, DateUtil.dateFormat),
							dayjs(query.to, DateUtil.dateFormat)
						]}
						onChange={(_, e: Array<string>) => {
							dispatch(resetAnalysisCamp())
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
				</div>
			</Affix>
			<div className={"chart"} style={{marginTop:40}}>
				<Row gutter={32}>
					<Col span={12}>
						<div className={"chart-camp"}>
							<CampChartAnalysis/>
						</div>
					</Col>
					<Col span={12}>
						<div className={"realtime"}>
							<CampTableAnalysis/>
						</div>
					</Col>
				</Row>
			</div>
		</div> 
		
	)
}