import {Col, DatePicker, Divider, Row, Spin} from "antd";
import dayjs from "dayjs";
import {DateUtil} from "@utils/date.util.tsx";
import {useEffect, useState} from "react";
import CustomerChart1 from "@components/analysis/customer/CustomerChart1.tsx";
import CustomerChart2 from "@components/analysis/customer/CustomerChart2.tsx";
import CustomerChartSex from "@components/analysis/customer/CustomerChartSex.tsx";
import CustomerChartProvince from "@components/analysis/customer/CustomerChartProvince.tsx";
import {reportSelector} from "@store/report/report.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import ReportThunk from "@store/report/report.thunk.ts";
import {AppDispatch} from "@store/store.ts";
import CustomerReportDetailModal from "@/modals/customer/CustomerReportDetailModal.tsx";
import CustomerReportByProvinceModal from "@/modals/customer/CustomerReportByProvinceModal.tsx";

export default function CustomerAnalysis() 
{
	const [query, setQuery] = useState<Record<string, any>>({
		...DateUtil.getDateThisMonth(),
	})
	const report = useSelector(reportSelector)
	const dispatch = useDispatch<AppDispatch>()
	const [config,setConfig] = useState<Record<string, boolean>>({
		customerDetail:false,
		customerByProvince:false,
	})
	const fetch = () => {
		dispatch(ReportThunk.reportCustomer(query))
		dispatch(ReportThunk.reportCustomerGender())
		dispatch(ReportThunk.reportCustomerByProvince(query))
	}

	useEffect(() => {
		fetch()
	}, [query]);
	
	const toggle = (key:string) => {
		return () => {
			if (config[key])
			{
				dispatch(ReportThunk.reportCustomerDetail(query))
			}
			setConfig({
				...config,
				[key]:!config[key]
			})
		}
	}
	
	return (
		<div>
			{
				config.customerDetail && <CustomerReportDetailModal
					open={config.customerDetail}
					onCancel={toggle("customerDetail")}
				/>
			}
			{
				config.customerByProvince && <CustomerReportByProvinceModal
					open={config.customerByProvince}
					onCancel={toggle("customerByProvince")}
				/>
			}
			<Row justify={"end"}>
				<Col span={4}>
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
				</Col>
			</Row>
			<Divider/>
			<Row gutter={[32,32]}>
				<Col span={12}>
					<div className={"chart"}>
						<Spin spinning={report.loadings.reportCustomer}>
							<CustomerChart1/>
						</Spin>
					</div>
				</Col>
				<Col span={12}>
					<div className={"chart"}>
						<Spin spinning={report.loadings.reportCustomer}>
							<CustomerChart2 onClick={toggle("customerDetail")}  />
						</Spin>
					</div>
				</Col>
				<Col span={10}>
					<CustomerChartSex/>
				</Col>
				<Col span={9}>
					<CustomerChartProvince onClick={toggle("customerByProvince")}/>
				</Col>
			</Row>
		</div>
	)  
}