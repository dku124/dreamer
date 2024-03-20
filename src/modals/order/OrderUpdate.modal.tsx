import {Col, Form, Modal, ModalProps, Row, Spin} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {productSelector} from "@store/product/product.slice.ts";
import OrderShip from "@components/order/OrderShip.tsx";
import {OrderProduct} from "@components/order/OrderProduct.tsx";
import OrderDescription from "@components/order/OrderDescription.tsx";
import {OrderSetting} from "@components/order/OrderSetting.tsx";
import {OrderPriceInfo} from "@components/order/OrderPriceInfo.tsx";
import {useEffect} from "react";
import {orderSelector, setReload} from "@store/order/order.slice.ts";
import {AppDispatch} from "@store/store.ts";
import OrderThunk from "@store/order/order.thunk.ts";
import {NumberUtil} from "@utils/number.util.ts";
import {OrderStatus} from "@/@types/order/order.type.ts";
import {AlertUtil} from "@utils/alert.util.ts";
import {DateUtil} from "@utils/date.util.tsx";
import dayjs from "dayjs";
import {OrderHelper} from "@/common/helpers/order.helper.tsx";
import {ShipSession, ShipType} from "@/@types/order/ship.type.ts";

export function OrderUpdateModal(props:ModalProps) {

	const product = useSelector(productSelector)
	const order = useSelector(orderSelector)
	const dispatch = useDispatch<AppDispatch>()
	const [form] = Form.useForm()
	
	
	useEffect(() => {
		if (props.open && order.select) {
			form.resetFields()
			dispatch(OrderThunk.getDetail(order.select))
		}
	}, [props.open]);
	
	useEffect(() => {
		if (order.detail!=undefined) {
			const newDetails = order.detail.details.map((detail:any, index:number) => {
				const newDetail:Record<string, any> = {...detail}
				
				if ((detail.product as any)[0]) {
					const product = (detail.product as any)[0]
					newDetail.product = `${product.code} - ${product.name}`
					newDetail.entity = {
						...product,
						skus:(detail as  any).skus
					}
				}
				if ((detail.sku as any)[0]) {
					newDetail.sku = (detail.sku as any)[0]._id
					newDetail.selectSku = (detail.sku as any)[0]
					newDetail.retailPrice = (detail.sku as any)[0].retailPrice
					newDetail.defaultPrice = (detail.sku as any)[0].price
				}
				if ((detail?.color as any)) {
					const color_id = (detail?.color as any).id
					const size_id = (detail?.color as any).size.id
					// @ts-ignore
					const sku = detail.sku[0];
					if (sku)
					{
						
						const color = sku.colors.find((e:any)=>e.id == color_id)
						newDetail.colorSelect = color
						newDetail.sizeSelect = detail.color.size
						newDetail.size = detail.color.size.id
						newDetail.weight = detail.color.size.weight
						newDetail.quantity = detail.quantity
						newDetail.price =  (newDetail.isRetail ? (newDetail.retailPrice + newDetail.sizeSelect.price) : (newDetail.defaultPrice + newDetail.sizeSelect.price)) * detail.quantity
						newDetail.showPrice = NumberUtil.toNumberMoney(newDetail.price);
					}
						
					// newDetail.color = (detail.color as any)
					// newDetail.size = (detail.color as any).size.id
					// const basePrice = detail.price || 0
					// newDetail.price = (basePrice + (detail?.color as any)?.size.price) * detail.quantity
					// newDetail.color = (detail.color as any).size
					// newDetail.colorSelect = (detail.color as any).size
					// newDetail.weight = (detail.color as any)?.size?.weight || 0
					// newDetail.showPrice = NumberUtil.toNumberMoney(newDetail.price);
				}
				newDetail.isRetail = detail.isRetail || false
				return newDetail
			})
			form.setFieldValue("details", undefined)
			form.resetFields()
			form.setFieldsValue({ 
				...order.detail,
				_id: order.detail?._id,
				details: newDetails,
				discount: order.detail?.discount,
				discountPrice: order.detail?.discount,
				ship: {
					to: {
						province: order.detail?.ship?.to?.province,
						district: order.detail?.ship?.to?.district,
						ward: order.detail?.ship?.to?.ward,
						street: order.detail?.ship?.to?.street,
						address: order.detail?.ship?.to?.address,
						fullName: order.detail?.ship?.to?.fullName,
						phone: order.detail?.ship?.to?.phone,
						note: order.detail?.ship?.note,
					},
					pickSession: order.detail?.ship?.pickSession || ShipSession.MORNING,
					shiftSession: order.detail?.ship?.shiftSession || ShipSession.MORNING,
					pickUpDate: dayjs(DateUtil.format(order.detail?.ship?.pickUpDate),DateUtil.dateFormat),
					shipType: order.detail?.ship?.type || ShipType.VNPOST,
					freeShip: order.detail?.ship?.freeShip,
				}
			})
			dispatch(setReload(true))
		}
	}, [order.detail]);

	useEffect(() => {
		if (!props.open) {
			form.resetFields()
		}
	}, [props.open]);
	const onFinish = (values:any) => {
		if(values.status != OrderStatus.CONFIRMED)
		{
			
			dispatch(OrderThunk.updateStatus({
				status:values.status,
				tag:values.tag,
				_id:order.select?._id,
				note:values.note || "",
				// details:OrderHelper.toOrderDetail(values).details
			}))
			props.onCancel?.(undefined as  any)
			return;
		}
		if ( !values?.details  || values?.details?.length == 0) {
			AlertUtil.Warning("Vui lòng chọn sản phẩm")
			return;
		}

		if (!values.ship?.to?.province) {
			AlertUtil.Warning("Vui lòng chọn tỉnh thành")
			return;
		}

		if (!values.ship?.to?.district) {
			AlertUtil.Warning("Vui lòng chọn quận huyện")
			return;
		}

		if (!values.ship?.to?.ward) {
			AlertUtil.Warning("Vui lòng chọn phường xã")
			return;
		}
		if (!values.ship.pickUpDate) {
			AlertUtil.Warning("Vui lòng chọn ngày lấy hàng")
			return;
		}
		dispatch(OrderThunk.update({
			...OrderHelper.toJson(values),
			_id:order.select?._id
		} as any))
		
		if (props.onCancel)
		{
			props.onCancel(undefined as any)
		}
	}
	
	return (
		<div>
			<Modal {...props} width={1680} title={"Cập nhật đơn hàng #"+order.select?.code} onOk={form.submit}>
				<Spin spinning={order.detail==undefined} size={"large"}>
					<Form layout={"vertical"} form={form} onFinish={onFinish} >
						<Row gutter={[32,32]}>
							<Col span={12}>
								<OrderShip form={form} 
										   province={order?.detail?.ship.to.province}
										   district={order?.detail?.ship.to.district}/>
							</Col>
							<Col span={12}>
								<OrderProduct form={form}/>
								<OrderDescription order={order?.detail}  />
								<OrderSetting form={form}/>
								<OrderPriceInfo form={form}/>
							</Col>
						</Row>
					</Form>
				</Spin>
			</Modal>
		</div>
	)
}