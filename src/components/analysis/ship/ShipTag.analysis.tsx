import {Card, Col, Row, Statistic, Tag} from "antd";
import {ShipStatus} from "@/@types/order/order.type.ts";
import {reportSelector} from "@store/report/report.slice.ts";
import {useSelector} from "react-redux";
import {ShipHelper} from "@/common/helpers/ship.helper.tsx";

export default function ShipTagAnalysis() {
	const report = useSelector(reportSelector)
	const getVale = (key:string) =>
	{
		for (let i of report.shipGroupByStatus)
		{
			if (i?.state===key)
			{
				return i.count
			}
		}
		return 0
	}

	return (
		<div id={"OrderTagAnalysis"} style={{marginBottom:"10px"}}>
			<Row gutter={[32,16]}>
				{
					Object.keys(ShipStatus).map((key:string,index)=>{
						return (<Col key={index} span={4}>
							<Card bordered={false}>
								<Statistic
									style={{minWidth:"170px"}}
									title={<Tag color={ShipHelper.toShipStatus(key).color}>{ShipHelper.toShipStatus(key).label}</Tag>}
									value={getVale(key)}
									valueStyle={{ color: ShipHelper.toShipStatus(key).color }}
								/>
							</Card>
						</Col>)
					})
				}
			</Row>
		</div>
	)
}