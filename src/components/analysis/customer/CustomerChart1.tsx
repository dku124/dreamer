import {Col, Row, theme, Typography} from "antd";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {Doughnut} from "react-chartjs-2";
import {useSelector} from "react-redux";
import {configSelector} from "@store/config/config.slice.ts";
import {FaUserFriends} from "react-icons/fa";
import {CustomerHelper} from "@/common/helpers/customer.helper.tsx";
import {reportSelector} from "@store/report/report.slice.ts";
import {NumberUtil} from "@utils/number.util.ts";

const { useToken } = theme;
ChartJS.register(ArcElement, Tooltip, Legend,ArcElement,ChartDataLabels);
export default function CustomerChart1()
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
				},
			},
			title:{
				display:true,
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
	
	
	const coverData = () => {
		return [
			report.reportCustomer?.newCustomer?.total || 0,
			report.reportCustomer?.oldCustomer?.total || 0,
		
		]
	}
	
	const caculatorPercent = (percent:number) => {
		const total = (report.reportCustomer?.newCustomer?.total || 0) + (report.reportCustomer?.oldCustomer?.total || 0)
		return ((percent/total)*100).toFixed(2)
	}
	
	return (
		<div style={{background:token.colorBgContainer}} className={"customBlock"}>
			<Row>
				
				<Col span={12}>
					
				</Col>
			</Row>
			<Row>
				<Col span={12}>
					<Row gutter={[32,16]}>
						<Col span={24}>
							<Typography.Title level={4} style={{color:token.colorText}}>Tổng lượng khách hàng</Typography.Title>
							<Typography.Title level={2} style={{color:token.colorText,marginTop:"10px"}}>{
								NumberUtil.toNumberMoney((report.reportCustomer?.newCustomer?.total || 0) + (report.reportCustomer?.oldCustomer?.total || 0))
							}</Typography.Title>
						</Col>
						<Col span={24}>
							<div style={{border:"2px solid #ccc",borderRadius:"10px",padding:"10px",background:token.colorBgContainer}}>
								<Row gutter={10}>
									<Col span={6}>
										<div  style={{padding:"10px",background:"#e5f1fd",width:"50px",borderRadius:"10px"}}>
											<FaUserFriends size={30} color={CustomerHelper.toCustomerType()[1]}/>
										</div>
									</Col>
									<Col span={18}>
										<div>
											<Typography.Text strong={true} >Khách hàng cũ</Typography.Text>
											<br/>
											<Typography.Text  style={{fontSize:"20px"}}>
												<Typography.Text  style={{color:CustomerHelper.toCustomerType()[1],fontSize:"20px"}}>
													{report.reportCustomer?.oldCustomer?.total} 
												</Typography.Text>
												<Typography.Text  style={{color:CustomerHelper.toCustomerType()[1],fontSize:"20px",marginLeft:"5px"}}>
													 ({caculatorPercent((report.reportCustomer?.oldCustomer?.total || 0))} %)
												</Typography.Text>
											</Typography.Text>
										</div>
									</Col>
								</Row>
							</div>
						</Col>
						<Col span={24}>
							<div style={{border:"2px solid #ccc",borderRadius:"10px",padding:"10px",background:token.colorBgContainer}}>
								<Row>
									<Col span={6}>
										<div  style={{padding:"10px",background:"#e5f8ed",width:"50px",borderRadius:"10px"}}>
											<FaUserFriends size={30} color={CustomerHelper.toCustomerType()[0]}/>
										</div>
									</Col>
									<Col span={18}>
										<div>
											<Typography.Text strong={true} >Khách hàng mới</Typography.Text>
											<br/>
											<Typography.Text  style={{fontSize:"20px"}}>
												<Typography.Text  style={{color:CustomerHelper.toCustomerType()[0],fontSize:"20px"}}>
													{report.reportCustomer?.newCustomer?.total}
												</Typography.Text>
												<Typography.Text  style={{color:CustomerHelper.toCustomerType()[0],fontSize:"20px",marginLeft:"5px"}}>
													({caculatorPercent((report.reportCustomer?.newCustomer?.total || 0))} %)
												</Typography.Text>
											</Typography.Text>
										</div>
									</Col>
								</Row>
							</div>
						</Col>
					</Row>
				</Col>
				<Col span={12}>
					<Doughnut 
						
						style={{
							width:"280px",
							height:"280px",
						}}
							  data={{
								  labels: ['Khách hàng mới', 'Khách hàng cũ'],
								  datasets: [
									  {
										  label: 'Số lượng ',
										  data: coverData(),
										  backgroundColor: [
											  ...CustomerHelper.toCustomerType(),
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
					  
		</div>
	)
}