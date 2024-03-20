import {Order} from "@/@types/order/order.type.ts";
import {Typography} from "antd";

export default function OrderDescription(props?:{
	order?:Partial<Order>
}) 
{
	return(
		<div>
			<Typography.Title style={{marginTop:"10px"}} level={4}>Thông tin đơn: </Typography.Title>
			<div>
				{
					props?.order?.addOnInfo && (
						<div>
							{
								props?.order?.addOnInfo?.link && <div>
									<Typography.Text strong={true}>Link:  <a href={props?.order?.addOnInfo?.link} target={"_blank"} >Nhấp vào đây</a></Typography.Text>
								</div>
							}
							{
								props?.order.addOnInfo?.quantity && <div>
									<Typography.Text strong={true}>Số lượng: {props?.order.addOnInfo?.quantity}</Typography.Text>
								</div>
							}
							{
								props?.order.addOnInfo?.option && props?.order.addOnInfo?.option!="option" && <div>
									<Typography.Text strong={true}>Màu sắc: {props?.order.addOnInfo?.option}</Typography.Text>
								</div>
							}
							{
								props?.order.addOnInfo?.size &&props?.order.addOnInfo?.size!="size" && <div>
									<Typography.Text strong={true}>Kích thước: {props?.order.addOnInfo?.size}</Typography.Text>
								</div>
							}
							{
								props?.order.addOnInfo?.note && <Typography.Text strong={true}>Ghi chú: {props?.order.addOnInfo?.note}</Typography.Text>
							}
							<Typography.Text></Typography.Text>
						</div>
					)
				}
			</div>
		</div>
	)
}