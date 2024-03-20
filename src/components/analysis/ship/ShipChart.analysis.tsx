import React from 'react';
import {ArcElement, Chart as ChartJS, Chart, Legend, Tooltip} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import {ShipStatus} from "@/@types/order/order.type.ts";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {reportSelector} from "@store/report/report.slice.ts";
import {useSelector} from "react-redux";
import {Col, Row, Typography} from "antd";
import {FaDotCircle} from "react-icons/fa";
import {userSelector} from "@store/user/user.slice.ts";
import {ShipHelper} from "@/common/helpers/ship.helper.tsx";
import {configSelector} from "@store/config/config.slice.ts";

ChartJS.register(ArcElement, Tooltip, Legend,ArcElement,ChartDataLabels);







export default function ShipChartAnalysis() {

	const report = useSelector(reportSelector)
	const config = useSelector(configSelector)
	const user = useSelector(userSelector)
	const getData = () => {
		let deliver = 0;
		let cancel = 0;
		let success = 0;
		let returns = 0;
		for (let i = 0; i < report.shipGroupByStatus.length; i++) {
			const item = report.shipGroupByStatus[i];
			switch (item.state)
			{
				case ShipStatus.NOT_CREATED:
				case ShipStatus.DELIVERED:
				case ShipStatus.PENDING:
				case ShipStatus.CONFIRMED:
					deliver += item.count;
					break;
				case ShipStatus.DELIVERING:
					success += item.count;
					break;
				case ShipStatus.CANCELED:
					cancel += item.count;
					break;
				default:
					returns += item.count;
					break;
			}
		}
		return [success,deliver,cancel,returns];
	}

	function getPersent(value:any,total:any,flag?:boolean) {
		if(flag)
		{
			const data = getData()
			const sum = data.reduce((a:any, b:any) => a + b, 0);
			const success = Number(((data[0]/sum)*100).toFixed(2));
			const deliver = Number(((data[1]/sum)*100).toFixed(2));
			const cancel = Number(((data[2]/sum)*100).toFixed(2));
			return  100 - success - deliver - cancel;
		}
		return (value/total)*100;
	}

	const total = (index:number) =>{
		const data = getData();
		
		const sum =  data[0] + data[1] + data[2] + data[3];
		
		if(index === 3)
		{
			const data = getData()
			const sum = data.reduce((a:any, b:any) => a + b, 0);
			if (sum === 0) return "0"
			const success = Number(((data[0]/sum)*100).toFixed(2));
			const deliver = Number(((data[1]/sum)*100).toFixed(2));
			const cancel = Number(((data[2]/sum)*100).toFixed(2));
			return  (100 - success - deliver - cancel).toFixed(2);
		}
		if (sum === 0) return "0"
		return (data[index]/sum * 100).toFixed(2);
	}

	const options = {
		plugins: {
			legend: {
				display: false,
				position: 'right',
				labels: {
					usePointStyle: true,
					pointStyle: 'circle',
					padding: 20,
				}
			},
			title:{
				display:true,
				text:'Total Feedback',
				fontSize:30,
				fontColor:'white',
			},
			datalabels: {
				color: config.darkMode ? '#fff' : '#000',
				// display: true,
				renderer: 'percentage',
				formatter: function(value:any, context:any) {
					const label = context.chart.data.labels[context.dataIndex]
					const total = context.dataset.data.reduce((a:any, b:any) => a + b, 0);
					switch (label)
					{
						case 'Giao thành công':
							return getPersent(value,total).toFixed(2) + '%';
						case 'Đang giao':
							return getPersent(value,total).toFixed(2) + '%';
						case 'Đã hủy':
							return getPersent(value,total).toFixed(2) + '%';
						case 'Trả hàng':
							return getPersent(value,total,true).toFixed(2) + '%';
						default:
							return getPersent(value,total).toFixed(2) + '%';
					}
				}
			},

		},
	}
	
	const isRender = () => {
		return report.shipGroupByStatus.length > 0;
	}
	
	
	
	// @ts-ignore
	return (
		<Row gutter={[16,16]} style={{height:"100%",alignItems:"center",display:"flex"}}>
			<Col span={24} >
				<div style={{height:"340px",display:"flex",justifyContent:"space-around"}}>
					{(report.orderGroupByStatus.length > 0 && isRender()) ? <Doughnut id={"shipChart"}
						data={{
							labels: ['Giao thành công', 'Đang giao', 'Đã hủy', 'Trả hàng'],
							datasets: [
								{
									label: 'Số lượng đơn hàng',
									data: [...getData()],
									backgroundColor: [
										ShipHelper.toShipStatus(ShipStatus.CONFIRMED).color,
										ShipHelper.toShipStatus(ShipStatus.DELIVERING).color,
										ShipHelper.toShipStatus(ShipStatus.CANCELED).color,
										ShipHelper.toShipStatus(ShipStatus.RETURN).color,
									],
									borderWidth: 0,
								},
							],
						}}
						plugins={[{
							id: 'textCenter',
							afterDatasetsDraw(chart: Chart<any>): boolean | void {
								const { ctx, chartArea } = chart;
								ctx.save();
								//ctx.clearRect(0, 0, chart.width, chart.height); // Xóa toàn bộ nội dung để vẽ lại

								// get chart data
								// @ts-ignore
								const data = chart.data.datasets[0].data || [];

								const total = data.reduce((a:any, b:any) => a + b, 0);


								ctx.font = "30px Arial";
								ctx.textAlign = 'center';
								ctx.textBaseline = 'middle';
								ctx.fillStyle = config.darkMode ? '#fff' : '#000';
								const centerX = (chartArea.left + chartArea.right) / 2;
								const centerY = (chartArea.top + chartArea.bottom) / 2;
								ctx.fillText((total).toString(), centerX, centerY);
								ctx.restore();
							}
							// @ts-ignore
						},ChartDataLabels]}
						// @ts-ignore
						options={options}
					/> : <div/>}
				</div>
			</Col>
			<Col span={24}>
				<div className={"info labelList"} style={{width:"max-content",padding:"15px",borderRadius:"10px"}}>
					<div>
						<FaDotCircle className={"labelList-item"} color={ShipHelper.toShipStatus(ShipStatus.CONFIRMED).color}/> 
						<Typography.Text >Giao thành công ({total(0)}%)</Typography.Text>
					</div>
					<div>
						<FaDotCircle className={"labelList-item"} color={ShipHelper.toShipStatus(ShipStatus.DELIVERING).color}/> 
						<Typography.Text>Đang giao ({total(1)}%)</Typography.Text>
					</div>
					<div>
						<FaDotCircle className={"labelList-item"} color={ShipHelper.toShipStatus(ShipStatus.CANCELED).color}/>
						<Typography.Text>Hủy đơn ({total(2)}%)</Typography.Text>
					</div>
					<div>
						<FaDotCircle className={"labelList-item"} color={ShipHelper.toShipStatus(ShipStatus.RETURN).color}/>
						<Typography.Text>Hoàn hàng ({total(3)}%)</Typography.Text>
					</div>
				</div>
			</Col>
		</Row>
	)
}
