import React from 'react';
import {Chart} from "@berryv/g2-react";
import {useSelector} from "react-redux";
import {reportSelector} from "@store/report/report.slice.ts";
import {MapUtil} from "@utils/map.util.ts";
import {ColorUtil} from "@utils/color.util.ts";
import {configSelector} from "@store/config/config.slice.ts";
import {Button, Col, Row, Spin, theme, Typography} from "antd";

export default function CustomerChartProvince(props:any) {

	const { token } = theme.useToken();
	const report = useSelector(reportSelector)
	const config = useSelector(configSelector)
	const coverData=() => {
		//0.03
		if(Object.keys(report.reportCustomerByProvince).length > 0)
		{
			let totalCustomer = 0;
			Object.entries(report.reportCustomerByProvince).forEach(([key, value]) => {
				totalCustomer += value[2];
			});
			let data: { province: string; item: string | undefined; count: number; color: string; percent: number; }[] = [];
			Object.entries(report.reportCustomerByProvince).forEach(([key, value]) => {
				if (value[2] > 0) {
					data.push({
						province: key,
						item: MapUtil.gI().getProvince(key)?.name.replace("Tỉnh", "T.").replace("Thành phố", "TP."),
						count: value[2],
						color: ColorUtil.generateColor(MapUtil.gI().getProvince(key)?.name || "").p1,
						percent: value[2] / totalCustomer,
					})
				}
			});
			// gộp các tỉnh thành có số lượng đơn hàng nhỏ hơn 1.5% thành tỉnh khác
			const other = data.filter(e=>e.percent<=0.03).reduce((a,b)=>a+b.count,0)
			const newData = data.filter(e=>e.percent>=0.03)
			if (other>0)
			{
				newData.push({
					province: "other",
					item: "Khác",
					count: other,
					color: ColorUtil.generateColor("Khác").p1,
					percent: other / totalCustomer,
				})
			}
			return newData.sort((a, b) => b.count - a.count);
			
		}
		return []

	}
	
	return (
		<div style={{background:token.colorBgContainer}} className={"customBlock"}>
		 <Spin spinning={report.loadings.reportCustomerByProvince}>
			 <Row>
				 <Col span={20}>
					 <Row>
						 <Col span={22}>
							 <Typography.Title level={4} style={{color:token.colorText}}>Tỉnh thành</Typography.Title>
						 </Col>
						 <Col span={2}>
							 <Button type={"link"} onClick={props.onClick}>Chi tiết</Button>
						 </Col>
					 </Row>
				 </Col>
				 <Col span={24}>
					 <Chart
						 style={{
							 width: "100%!important",
							 height: "100%!important",

						 }}
						 options={{
							 type: "view",
							 autoFit: false,

							 coordinate: { type: "theta", outerRadius: 0.8, innerRadius: 0.5, },
							 children: [
								 {
									 type: "interval",
									 data: coverData(),
									 encode: { y: "count", color: "color" },
									 transform: [{ type: "stackY" }],
									 legend: {
										 color:false,
										 // color: { position: "bottom", layout: { justifyContent: "center" } },
									 },
									 labels: [
										 {
											 position: "outside",
											 fill: config.darkMode ? "#fff" : "#000",
											 color: config.darkMode ? "#fff" : "#000",
											 text: (data:any) => `${data.item} ${(data.percent * 100).toFixed(2)}%`,
										 },
									 ],
									 tooltip: {
										 items: [
											 (data) => ({
												 name: data.item,
												 value: `${(data.percent * 100).toFixed(2)}%`,
											 }),
										 ],
									 },
								 },
							 ],
						 }}
					 />
				 </Col>
			 </Row>
		 </Spin>
		</div>
	);
}