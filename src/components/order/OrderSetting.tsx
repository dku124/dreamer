import {OrderStatus, OrderTag, OrderType} from "@/@types/order/order.type.ts";
import {Col, DatePicker, Form, FormInstance, InputNumber, Radio, Row, Select, Switch} from "antd";
import {OrderHelper} from "@/common/helpers/order.helper.tsx";
import {ShipHelper} from "@/common/helpers/ship.helper.tsx";
import {ShipSession, ShipType} from "@/@types/order/ship.type.ts";
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';
import {DateUtil} from "@utils/date.util.tsx";
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import {orderSelector, setReload} from "@store/order/order.slice.ts";
import {AppDispatch} from "@store/store.ts";
import {NumberUtil} from "@utils/number.util.ts";

type OrderSettingProps = {
	form:FormInstance,
	type?:OrderType,
}

export function OrderSetting(props:OrderSettingProps)
{
	const order = useSelector(orderSelector)
	const dispatch = useDispatch<AppDispatch>()
	
	const updateDiscount = (v:number) => {
		props.form.setFieldsValue({discount:v})
		dispatch(setReload(true))
	}
	
	return(
		<div>
			<Row gutter={32} >
				<Col  span={12}>
					<Form.Item
						name={"status"}
						label={"Trạng thái đơn"}
						initialValue={props.type == OrderType.CUSTOM ? OrderStatus.CONFIRMED : OrderStatus.PENDING}
					>
						<Select style={{width:"100%"}} options={OrderHelper.toOrderStatusOptions()} />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name={"tag"} label={"Tag"} initialValue={OrderTag.UNCATEGORIZED} >
						<Select style={{width:"100%"}} options={OrderHelper.toOrderTagOptions()} />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label={"Giảm giá"} name={"discountPrice"} initialValue={0} >
						<InputNumber
							style={{width:"100%"}} 
							min={0} 
							onChange={(_v)=> updateDiscount(_v as number)} 
							formatter={value => NumberUtil.toMoney().fromNumber(value as any)}
							parser={value => NumberUtil.toMoney().fromString(value as any).toString() as any  }
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					
					<Form.Item name={['ship',"pickUpDate"]} label={"Ngày lấy hàng"}
							   rules={[{required:false, message:"Vui lòng chọn ngày lấy hàng"}]}

							   initialValue={dayjs(DateUtil.getTomorrowDate(),DateUtil.dateFormat)}
					>
						<DatePicker style={{width:"100%"}} format={DateUtil.dateFormat} />
					</Form.Item>
				</Col>
				<Col span={18}>
					<Form.Item name={['ship',"shipType"]}
							   rules={[{required:false, message:"Vui lòng chọn đơn vị vận chuyển"}]}
							   label={"Đơn vị vận chuyển"} initialValue={ShipType.VNPOST} >
						<Radio.Group optionType={"button"} defaultValue={ShipType.VNPOST} options={ShipHelper.toType()} buttonStyle="solid" />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name={['ship',"freeShip"]}
							   valuePropName="checked"
							   label={"Miễn phí ship"} >
						<Switch
							checkedChildren={<CheckOutlined />}
							unCheckedChildren={<CloseOutlined size={30} />}
							defaultChecked
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name={['ship',"pickSession"]} label={"Ca lấy hàng"} initialValue={ShipSession.MORNING} 
							   rules={[{required:false, message:"Vui lòng chọn ca lấy hàng"}]}
					>
						<Radio.Group optionType={"button"} options={OrderHelper.toPickSessionOptions()} buttonStyle="solid" />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name={['ship',"shiftSession"]} label={"Ca giao hàng"} initialValue={ShipSession.MORNING}
							   rules={[{required:false, message:"Vui lòng chọn ca giao hàng"}]}
					>
						<Radio.Group optionType={"button"} options={OrderHelper.toPickSessionOptions()} buttonStyle="solid" />
					</Form.Item>
				</Col>
				
			</Row>
		</div>
	)
}