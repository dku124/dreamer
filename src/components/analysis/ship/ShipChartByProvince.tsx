import React from 'react';
import {Chart} from "@berryv/g2-react";
import {useSelector} from "react-redux";
import {reportSelector} from "@store/report/report.slice.ts";
import {MapUtil} from "@utils/map.util.ts";
import {ColorUtil} from "@utils/color.util.ts";
import {configSelector} from "@store/config/config.slice.ts";

export default function ShipChartByProvince() {

	const report = useSelector(reportSelector)
	const config = useSelector(configSelector)
	const coverData=() => {
		
		const sortData = report.reportOrderByProvince
			.filter((item) =>  item.province&&item.count > 0)
			.sort((a, b) => {
				return Number(b.province) - Number(a.province)
			})
		const total = sortData.reduce((a, b) => a + b.count, 0);
		
		const data = [];
		
		for (let i = 0; i < sortData.length; i++) {
			const item = sortData[i];
			if (item.count > 0 && item.province) {
				data.push({
					province: item.province,
					item: MapUtil.gI().getProvince(item.province)?.name.replace("Tỉnh", "T.").replace("Thành phố", "TP."),
					count: item.count,
					color: ColorUtil.generateColor(MapUtil.gI().getProvince(item.province)?.name || "").p1,
					percent: item.count / total,
				})
			}
		}
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
				percent: other / total,
			})
		}
		return newData.sort((a, b) => b.count - a.count);
		
	}
	
	
	

	
	
	
	return (
		<Chart
			style={{
				width: "100%!important",
				height: "100%!important",
				
			}}
			options={{
				type: "view",
				autoFit: false,
				
				coordinate: { type: "theta", outerRadius: 0.8, innerRadius: 0.5 },
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
					// {
					// 	type: "text",
					// 	style: {
					// 		text: "Đ",
					// 		x: "50%",
					// 		y: "50%",
					// 		dy: -25,
					// 		fontSize: 34,
					// 		fill: "#8c8c8c",
					// 		textAlign: "center",
					// 	},
					// },
					// {
					// 	type: "text",
					// 	style: {
					// 		text: "200",
					// 		x: "50%",
					// 		y: "50%",
					// 		dx: -25,
					// 		dy: 25,
					// 		fontSize: 44,
					// 		fill: "#8c8c8c",
					// 		textAlign: "center",
					// 	},
					// },
					// {
					// 	type: "text",
					// 	style: {
					// 		text: "台",
					// 		x: "50%",
					// 		y: "50%",
					// 		dx: 35,
					// 		dy: 25,
					// 		fontSize: 34,
					// 		fill: "#8c8c8c",
					// 		textAlign: "center",
					// 	},
					// },
				],
			}}
		/>
	);
}