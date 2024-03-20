import {Col, Row, Spin, theme, Typography} from "antd";
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {Bar} from "react-chartjs-2";
import {useSelector} from "react-redux";
import {configSelector} from "@store/config/config.slice.ts";
import {reportSelector} from "@store/report/report.slice.ts";
import {Gender} from "@/@types/repo/customer.type.ts";

const { useToken } = theme;
ChartJS.register(BarElement, Tooltip, Legend,ArcElement,ChartDataLabels,CategoryScale,LinearScale);
export default function CustomerChartSex()
{
	const { token } = useToken();
	const config = useSelector(configSelector)
	const report = useSelector(reportSelector)
	const options = {
	
		plugins: {
			legend: {
				display: true,
				position: 'bottom',
				labels: {
					usePointStyle: true,
					pointStyle: 'circle',
					padding: 20,
					color: config.darkMode ? '#fff' : '#000',
				}
			},
			title:{
				display:false,
				text:'Total Feedback',
				fontSize:30,
				fontColor: config.darkMode ? '#fff' : '#000',
			},
			datalabels: {
				display:false,
				color: config.darkMode ? '#fff' : '#000',
				// display: true,
				renderer: 'percentage',
			},

		},
	}
	return (
		<div style={{background:token.colorBgContainer}} className={"customBlock"}>
			<Spin spinning={report.loadings.reportCustomerGender}>
				
			
			<Row >

				<Col span={20}>
					<Typography.Title level={4} style={{color:token.colorText}}>Tổng lượng khách</Typography.Title>
					<Typography.Title level={2} style={{color:token.colorText,marginTop:"10px"}}>{
						report.reportCustomerGender.reduce((a,b) => {
							return b._id != null ? a + b.count : a
						},0)
					}</Typography.Title>
				</Col>
				<Col span={24} style={{marginTop:"50px"}}>
					
					<Bar
						style={{height:"100%"}}
						data={{
							
							labels: ["Giới tính"],
							datasets: [
								{
									label: 'Nam',
									data: [report.reportCustomerGender.find(e=>e._id === Gender.MALE)?.count || 0],
									backgroundColor: [
										"#ffa542"
									],
									borderWidth: 0,

								},
								{
									label: 'Nữ',
									data: [report.reportCustomerGender.find(e=>e._id === Gender.FEMALE)?.count || 0],
									backgroundColor: [
										"#009af9"
									],
									borderWidth: 0,

								},
							],
						}}
						// @ts-ignore
						options={options}
					/>
				</Col>
			</Row>
			</Spin>
		</div>
	)
}