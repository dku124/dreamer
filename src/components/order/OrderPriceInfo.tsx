import {Button, Descriptions, Divider, FormInstance, Spin, Typography} from "antd";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {orderSelector, setReload} from "@store/order/order.slice.ts";
import {AppDispatch} from "@store/store.ts";
import {NumberUtil} from "@utils/number.util.ts";
import {ShipType} from "@/@types/order/ship.type.ts";
import {MapUtil} from "@utils/map.util.ts";
import ShipService from "@/services/order/ship.service.ts";
import {AlertUtil} from "@utils/alert.util.ts";

type OrderPriceInfoProps = {
	form:FormInstance
}

export function OrderPriceInfo(props?:OrderPriceInfoProps) 
{
	const order = useSelector(orderSelector)
	const [shipFee,setShipFee] = useState<number>(0)
	const [loading,setLoading] = useState<boolean>(false)
	const dispatch = useDispatch<AppDispatch>()
	useEffect(() => {
		if (order.reloading)
		{
			//caculatorShip()
			dispatch(setReload(false))
		}
	}, [order.reloading]);
	
	// tiền hàng
	function totalProductPrice()
	{
		const details = props?.form.getFieldValue("details");
		let total = 0;
		details?.forEach((item:any) => {
			total += (item?.price || 0)
		})
		return total;
	}
	
	
	function totalMoney()
	{
		const productPrices = totalProductPrice();
		const discount = parseInt(props?.form.getFieldValue("discount"));
		if (isNaN(discount))
		{
			return productPrices;
		}
		return productPrices - discount > 0 ? (productPrices - discount) + (shipFee ?? 0) : 0;
	}
	
	function caculatorShip()
	{
		const province = props?.form.getFieldValue(["ship","to","province"]);
		const district = props?.form.getFieldValue(["ship","to","district"]);
		const ward = props?.form.getFieldValue(["ship","to","ward"]);
		const details = props?.form.getFieldValue("details");
		const shipType = props?.form.getFieldValue(["ship","shipType"]);
		const address = props?.form.getFieldValue(["ship","to","address"]);
		
		if (!province || !district || !ward || !address){
			AlertUtil.Error("Vui lòng điền đầy đủ thông tin giao hàng")
			return;
		}
		if (!shipType){
			AlertUtil.Error("Vui lòng chọn hình thức giao hàng")
			return;
		}
		if (shipType === ShipType.UNKNOWN)
		{
			AlertUtil.Error("Hình thức giao hàng không hợp lệ")
			return;
		}
		
		if (details.length === 0)
		{
			AlertUtil.Error("Vui lòng chọn sản phẩm")
			return;
		}
		
		// if (province && district && ward && details && shipType && address)
		if(province && district && ward && details && shipType && address)
		{
			const items:any = [];
			details.forEach((item:any) => {
				if(item?.entity && item.selectSku && item?.colorSelect)
				{
					items.push({
						"name": item?.entity?.name,
						"quantity": item?.quantity,
						"weight": (item.sizeSelect.weight) * item?.quantity,
						"height": 10,
						"width": 5,
						"length": 15
					})
				}
			})
			
			const json = {
				"province": MapUtil.gI().getProvince(province)?.name,
				"district": MapUtil.gI().getDistrict(district)?.name,
				"ward": MapUtil.gI().getWard(ward)?.name,
				"address": address,
				"items": items,
			}
			setLoading(true)
			ShipService.caculatorShipping(shipType,json)
				.then((res:any) => {
					setShipFee(res.fee)
					setLoading(false)
				})
				.catch((err:any) => {
					AlertUtil.Error("Có lỗi xảy ra khi tính phí ship")
					setLoading(false)
				})
			
		}
	}
	
	return(
		<div>
			<Divider orientation={"center"} dashed={false} >Thông tin giá</Divider>
			<div>
				<Descriptions bordered size={"small"} column={12}>
					
					<Descriptions.Item span={12} label={<Typography.Text style={{fontWeight:"bold"}}>Tiền hàng</Typography.Text>} >
						{NumberUtil.toMoney().fromNumber(totalProductPrice())}
					</Descriptions.Item>
					<Descriptions.Item span={8} label={<Typography.Text style={{fontWeight:"bold"}}>Phí ship (Tạm tính)</Typography.Text>} >
						<Spin spinning={loading}>
							{NumberUtil.toMoney().fromNumber(shipFee)}
						</Spin>
					</Descriptions.Item >
					
					<Descriptions.Item span={4} >
						<Button onClick={caculatorShip} type={"primary"} >Tính thử</Button>
					</Descriptions.Item >
					<Descriptions.Item span={12} label={<Typography.Text style={{fontWeight:"bold"}}>Giảm giá</Typography.Text>} >
					{
						NumberUtil.toNumberMoney(props?.form.getFieldValue("discount") || 0)
					}
					</Descriptions.Item>
					<Descriptions.Item span={12} label={<Typography.Text style={{fontWeight:"bold"}}>Tổng tiền</Typography.Text>}  labelStyle={{width:"200px"}}>
					{
						NumberUtil.toMoney().fromNumber(totalMoney())
					}
					</Descriptions.Item>
				</Descriptions>
			</div>
		</div>
	)
}