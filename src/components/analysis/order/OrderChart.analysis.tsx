import React from 'react';
import {ArcElement, Chart as ChartJS, Chart, Legend, Tooltip} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import {OrderHelper} from "@/common/helpers/order.helper.tsx";
import {OrderStatus} from "@/@types/order/order.type.ts";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {reportSelector} from "@store/report/report.slice.ts";
import {useSelector} from "react-redux";
import {Col, Row, Typography} from "antd";
import {FaDotCircle} from "react-icons/fa";
import {userSelector} from "@store/user/user.slice.ts";
import {User} from "@/@types/user.type.ts";

ChartJS.register(ArcElement, Tooltip, Legend,ArcElement,ChartDataLabels);




interface Props {
	type?:number
}


export default function OrderChartAnalysis(props:Props) {

	 const report = useSelector(reportSelector)
	 const user = useSelector(userSelector)
	const getData = () => {
		 
		 let comfirm = 0;
		 let cancel = 0;
		 let pending = 0;
		 
		 for (let i = 0; i < report.orderGroupByStatus.length; i++) {
			 const item = report.orderGroupByStatus[i];
			 if (item.status === OrderStatus.CONFIRMED) {
				 comfirm += item.count;
			 }
			 else if (item.status === OrderStatus.PENDING) {
				 pending += item.count;
			 }
			 else
			 {
				 cancel += item.count;
			 }
		 }
		 return [comfirm,pending,cancel];
	}

	function getPersent(value:any,total:any,flag?:boolean) {
		if(flag)
		{
			const data = getData();
			const percentComfirm = Number(((data[0]/total)*100).toFixed(2));
			const percentPending = Number(((data[1]/total)*100).toFixed(2)) ;
				
			return  100 - percentComfirm - percentPending;
			
		}
		return (value/total)*100;
	}
	
	const total = (index:number) =>{
		const data = getData();
		const sum =  data[0] + data[1] + data[2];
		if (sum === 0) return 0;
		if(index === 2)
		{
			const percentComfirm = Number(((data[0]/sum)*100).toFixed(2));
			const percentPending = Number(((data[1]/sum)*100).toFixed(2)) ;
			return  (100 - percentComfirm - percentPending).toFixed(2)
		}
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
			},
			datalabels: {
				color: 'white',
				// display: true,
				renderer: 'percentage',
				formatter: function(value:any, context:any) {
					const label = context.chart.data.labels[context.dataIndex]
					const total = context.dataset.data.reduce((a:any, b:any) => a + b, 0);
					switch (label) 
					{
						case 'Chốt thành công':
							return `${getPersent(value,total).toFixed(2)}%`;
						case 'Chưa xác nhận':
							return `${getPersent(value,total).toFixed(2)}%`;
						default:
							return `${getPersent(value,total,true).toFixed(2)}%`;
					}
				}
			},

		},
	}
	// @ts-ignore
	
	
	const getPersentByUser = (id:string) => {
		 const data = report.orderComfirmBySale.find(item => item.sale === id);
		 if(data)
		 {
			 
		 	return getPersent(data.confirm,data.count).toFixed(2);
		 }
		 return 0;
	}
	
	
	
	return (
		<Row gutter={[16,16]} style={{height:"100%",alignItems:"center",display:"flex"}}>
			<Col span={24} >
				<div style={{height:"340px",display:"flex",justifyContent:"space-around"}}>
					{report.orderGroupByStatus.length > 0 ? <Doughnut
						data={{
							labels: ['Chốt thành công','Chưa xác nhận', 'Hủy', ],
							datasets: [
								{
									label: 'Số lượng đơn hàng',
									data: [...getData()],
									backgroundColor: [
										OrderHelper.GetStatusColor(OrderStatus.CONFIRMED),
										OrderHelper.GetStatusColor(OrderStatus.PENDING),
										OrderHelper.GetStatusColor(OrderStatus.CANCELLED),
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
				<div className={"info labelList"}  style={{width:"max-content",padding:"15px",borderRadius:"10px"}}>
					<div >
						<FaDotCircle className={"labelList-item"} color={OrderHelper.GetStatusColor(OrderStatus.CONFIRMED)} /> 
						<Typography.Text >Tổng đơn đã xác nhận ({getData()[0]})</Typography.Text> 
					</div>
					<div > 
						<FaDotCircle className={"labelList-item"} color={OrderHelper.GetStatusColor(OrderStatus.CONFIRMED)}/>
						<Typography.Text >Tỉ lệ chốt thành công ({total(0)}%)</Typography.Text>
					</div>
					<div >
						<FaDotCircle className={"labelList-item"} color={OrderHelper.GetStatusColor(OrderStatus.PENDING)}/> 
						<Typography.Text >Tỉ lệ chờ xác nhận ({total(1)}%)</Typography.Text>
					</div>
					<div >
						<FaDotCircle className={"labelList-item"} color={OrderHelper.GetStatusColor(OrderStatus.CANCELLED)}/> 
						<Typography.Text >Tỉ lệ hủy ({total(2)}%)</Typography.Text>
					</div>
					{
						props.type !=1 && (
							user.list.map((item:User,index:number) => {
								return <div key={index} className={"labelList-item"}>
									<FaDotCircle className={"labelList-item"} color={OrderHelper.GetStatusColor(OrderStatus.CONFIRMED)}/>
									<Typography.Text >Tỉ lệ xác nhận ({item.fullName}) ({getPersentByUser(item._id)}%)</Typography.Text>
								</div>
							}))
					}
				</div>
			</Col>
		</Row>
	)
}
