import {Card, Col, Row, Statistic} from "antd";
import {OrderStatus} from "@/@types/order/order.type.ts";
import {OrderHelper} from "@/common/helpers/order.helper.tsx";
import {reportSelector} from "@store/report/report.slice.ts";
import {useSelector} from "react-redux";

export function OrderTagAnalysis(data:Record<string, number>) {
	const report = useSelector(reportSelector)
	
	const getVale = (key:string) =>
	{
		for (let i of report.orderGroupByStatus)
		{
			if (i?.status===key)
			{
				return i.count
			}
		}
		return 0
	}
	
	return (
		<div id={"OrderTagAnalysis"} style={{marginBottom:"10px"}}>
			<Row gutter={32}>
				{
					Object.keys(OrderStatus).map((key:string,index)=>{
						return (<Col key={index} span={4}>
							<Card bordered={false}>
								<Statistic
									title={OrderHelper.Status(key)}
									value={getVale(key)}
									valueStyle={{ color: OrderHelper.GetStatusColor(key) }}
								/>
							</Card>
						</Col>)
					})
				}
			</Row>
		</div>
	)
}