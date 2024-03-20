import {Col, Descriptions, Form, Input, Modal, ModalProps, Row, Select, Space, Spin,} from "antd";
import {orderSelector} from "@store/order/order.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import OrderThunk from "@store/order/order.thunk.ts";
import {AppDispatch} from "@store/store.ts";
import {MapUtil} from "@utils/map.util.ts";
import {DateUtil} from "@utils/date.util.tsx";
import {ShipHelper} from "@/common/helpers/ship.helper.tsx";
import {NumberUtil} from "@utils/number.util.ts";
import {OrderHelper} from "@/common/helpers/order.helper.tsx";

export function UpdateShipInforOrderModal(props: ModalProps) {
	const order = useSelector(orderSelector);
	const dispatch = useDispatch<AppDispatch>();
	const [district, setDistrict] = useState<any[]>([]);
	const [ward, setWard] = useState<any[]>([]);
	const [form] = Form.useForm();

	useEffect(() => {
		if (props.open && order.select) {
			dispatch(OrderThunk.getDetail(order.select));
		}
		else
		{
			form.resetFields()
		}
	}, [order.select, order.reloading]);

	useEffect(() => {
		if (order.detail != undefined) {
			form.setFieldsValue({
				...order.detail,
				fullName: order.detail?.ship?.to?.fullName,
				phone: order.detail?.ship?.to?.phone,
				address: order.detail?.ship?.to?.address,
				note: order.detail?.note ,
			});
			if (order.detail.ship.to.province)
			{
				setDistrict(MapUtil.gI().getNameLevel2(order.detail.ship.to.province))
			}
			if (order.detail.ship.to.district)
			{
				setWard(MapUtil.gI().getNameLevel3(order.detail.ship.to.district))
			}
		}
	}, [order.detail]);

	const onFinish = (values: any) => {
		if (order) {
			dispatch(
				OrderThunk.UpdateInforShip({
					id:( order.select?._id || "").toString(),
					shipTo: {
						name: values.fullName,
						phone: values.phone,
						address: values.address,
						province: values.ship.to.province,
						district: values.ship.to.district,
						ward: values.ship.to.ward,
						street: values.ship.to.street,
						note: values.ship.note,
					}
				}),

			);
			
		}
		if (props.onCancel)
		{
			props.onCancel(undefined as  any)
		}
	};

	const selectProvince = (value:string,entity:any) => {
		form.setFieldValue("province",value)
		form.setFieldValue("district",undefined)
		form.setFieldValue("ward",undefined)
		setDistrict(MapUtil.gI().getNameLevel2(value))
	}

	const selectDistrict = (value:string,entity:any) => {
		form.setFieldValue("district",value)
		form.setFieldValue("ward",undefined)
		setWard(MapUtil.gI().getNameLevel3(value))
	}

	const selectWard = (value:string,entity:any) => {
		form.setFieldValue("ward",value)
	}
	
	
	return (
		<div>
			<Modal
				{...props}
				width={1080}
				cancelText={"Đóng"}
				onOk={form.submit}
				title={"Cập nhập thông tin đơn #" + order?.select?.code}
			>
				<Spin spinning={order.detail == undefined}>
					<Form layout={"vertical"} form={form} onFinish={onFinish}>
						<Row gutter={[32, 20]}>
							<Col span={12}>
								<Form.Item
									name="fullName"
									label="Tên khách hàng"
									rules={[{ required: true }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name="phone"
									label="Số điện thoại"
									rules={[{ required: true }]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item
									name={["address"]}
									label="Địa chỉ"
									rules={[{ required: true }]}
								>
									<Input
										value={order.detail?.ship?.to?.address}
										placeholder="Địa chỉ"
									/>
								</Form.Item>
							</Col>
							
						</Row>
						<Space.Compact style={{minWidth:"33.33%"}}>
							
								<Form.Item name={["ship","to","province"]}
										   label={"Tỉnh/Thành phố"}
										   style={{minWidth:"50%"}}
										   rules={[{required:false,message:"Vui lòng nhập tỉnh/thành phố"}]}
								>
									<Select
										showSearch={true}
										filterOption={(input, option) =>
										{
											// @ts-ignore
											return option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
										}
										}
										placeholder={"Tỉnh/Thành phố"}
										
										onChange={selectProvince}
										options={MapUtil.gI().getNameLevel1()}
									/>
								</Form.Item>
							
								<Form.Item name={["ship","to","district"]}
										   label={"Quận/Huyện"}
										   style={{minWidth:"50%"}}
										   rules={[{required:false,message:"Vui lòng nhập quận/huyện"}]}
								>
									<Select
										showSearch={true}
										filterOption={(input, option) =>
										{
											// @ts-ignore
											return option?.label?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
										}
										}
										onChange={selectDistrict}
										options={district}
										
										placeholder={"Quận/Huyện"}

									/>
								</Form.Item>
							
								<Form.Item name={["ship","to","ward"]}
										   label={"Phường/Xã"}
										   style={{minWidth:"50%"}}
										   rules={[{required:false,message:"Vui lòng nhập phường/xã"}]}
								>
									<Select
										showSearch={true}
										filterOption={(input, option) =>
										{
											// @ts-ignore
											return option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
										}
										}
										onChange={selectWard}
										options={ward}
										style={{minWidth:"205.33px"}}
										placeholder={"Phường/Xã"} />

								</Form.Item>
						</Space.Compact>
						<Row>
							<Col span={24} >
								<Form.Item name={["ship","to","street"]} label={"Đường/phố"}
										   rules={[{required:false,message:"Vui lòng nhập đường/phố"}]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col span={24} >
								<Form.Item name={["ship","note"]} label={"Ghi chú (vận chuyển)"}
										   rules={[{required:false,message:"Vui lòng nhập ghi chú"}]}
								>
									<Input.TextArea />
								</Form.Item>
							</Col>
						</Row>
					</Form>
					<Descriptions
						size={"small"}
						layout={"vertical"}
						column={24}
					>
						<Descriptions.Item label="Đơn vị vận chuyển" span={8}>
							{ShipHelper.toShipTypeName(
								order.detail?.ship?.type,
							)}
						</Descriptions.Item>
						<Descriptions.Item label="Ca lấy hàng" span={4}>
							{ShipHelper.toShipSession(
								order.detail?.ship?.pickSession,
							)}
						</Descriptions.Item>
						<Descriptions.Item label="Ca giao hàng" span={4}>
							{ShipHelper.toShipSession(
								order.detail?.ship?.shiftSession,
							)}
						</Descriptions.Item>
						<Descriptions.Item label="Miễn phí ship" span={4}>
							{order.detail?.ship?.freeShip ? "Có" : "Không"}
						</Descriptions.Item>
						<Descriptions.Item label="Ngày lấy hàng" span={4}>
							{DateUtil.format(
								order.detail?.ship?.pickUpDate,
								DateUtil.dateFormat,
							)}
						</Descriptions.Item>

						<Descriptions.Item label="Sản phẩm" span={8}>
							{OrderHelper.ToProduct(
								order?.detail?.details || [],
							)}
						</Descriptions.Item>

						<Descriptions.Item label="Tiền hàng" span={4}>
							{NumberUtil.toNumberMoney(
								OrderHelper.getTotal(
									order?.detail?.details || [],
								),
							)}{" "}
							đ
						</Descriptions.Item>
						<Descriptions.Item label="Tiền ship" span={4}>
							{NumberUtil.toNumberMoney(
								order?.detail?.ship?.fee || 0,
							)}{" "}
							đ
						</Descriptions.Item>
						<Descriptions.Item label="Giảm giá" span={4}>
							{NumberUtil.toNumberMoney(
								order?.detail?.discount || 0,
							)}{" "}
							đ
						</Descriptions.Item>
						<Descriptions.Item label="Tổng tiền" span={4}>
							{NumberUtil.toNumberMoney(
								OrderHelper.getTotal(
									order?.detail?.details || [],
								) +
									(order?.detail?.ship?.fee || 0) -
									(order?.detail?.discount || 0),
							)}{" "}
							đ
						</Descriptions.Item>
					</Descriptions>
				</Spin>
			</Modal>
		</div>
	);
}
