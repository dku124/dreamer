import {Col, Form, FormInstance, Input, Row, Select, Space} from "antd";
import {MapUtil} from "@utils/map.util.ts";
import {useEffect, useState} from "react";

type OrderShipProps = {
	form:FormInstance,
	province?:string,
	district?:string,
}

export default function OrderShip(props:OrderShipProps)
{
	const {form} = props;
	const [reload,setReload] = useState<boolean>(false)
	const [district,setDistrict] = useState<any[]>([])
	const [ward,setWard] = useState<any[]>([])
	useEffect(() => {
		if (props.province)
		{
			setDistrict(MapUtil.gI().getNameLevel2(props.province))
		}
		if (props.district)
		{
			setWard(MapUtil.gI().getNameLevel3(props.district))
		}
	}, [props]);
	
	const selectProvince = (value:string,entity:any) => {
		props.form.setFieldValue(['ship','to',"province"],value)
		props.form.setFieldValue(['ship','to',"district"],undefined)
		props.form.setFieldValue(['ship','to',"ward"],undefined)
		setDistrict(MapUtil.gI().getNameLevel2(value))
	}
	
	const selectDistrict = (value:string,entity:any) => {
		props.form.setFieldValue(['ship','to',"district"],value)
		props.form.setFieldValue(['ship','to',"ward"],undefined)
		setWard(MapUtil.gI().getNameLevel3(value))
	}
	
	const selectWard = (value:string,entity:any) => {
		props.form.setFieldValue(['ship','to',"ward"],value)
	}
	
	const getDistrict = () => {
		var province = props.form.getFieldValue(["ship","to","province"])
		if (province)
		{
			return MapUtil.gI().getNameLevel2(province)
		}
		return []
	}
	
	const getWard = () => {
		var district = props.form.getFieldValue(["ship","to","district"])
		if (district)
		{
			return MapUtil.gI().getNameLevel3(district)
		}
		return []
	}
	
	return (
		<div id={"OrderShip"}>
			<Row>
				
			</Row>
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item name={["ship","to","fullName"]}
							   label={"Họ và tên khách hàng"}
							   rules={[{required:true,message:"Vui lòng nhập họ và tên khách hàng"}]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name={["ship","to","phone"]}
							   label={"Số điện thoại"}
							   rules={[{required:true,message:"Vui lòng nhập số điện thoại"}]}
					>
						<Input />
					</Form.Item>
				</Col>
			</Row>
			<Form.Item name={["ship","to","address"]}
					   label={"Địa chỉ"}
					   rules={[{required:true,message:"Vui lòng nhập địa chỉ"}]}

			>
				<Input.TextArea />
			</Form.Item>
			<Space.Compact style={{width:"100%"}}>
				<Form.Item name={["ship","to","province"]}
						   label={"Tỉnh/Thành phố"}
						   rules={[{required:false,message:"Vui lòng nhập tỉnh/thành phố"}]}
						   style={{width:"100%"}}
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
						   style={{width:"100%"}}
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
						style={{minWidth:"205.33px"}}
						placeholder={"Quận/Huyện"}

					/>
				</Form.Item>
				<Form.Item name={["ship","to","ward"]}
						   label={"Phường/Xã"}
						   style={{width:"100%"}}
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
			<Form.Item name={["ship","to","street"]} label={"Đường/phố"}
					   rules={[{required:false,message:"Vui lòng nhập đường/phố"}]}
			>
				<Input />
			</Form.Item>
			<Form.Item name={["ship","to","note"]} label={"Ghi chú (Vận chuyển)"}
					   rules={[{required:false,message:"Vui lòng nhập ghi chú"}]}
			>
				<Input.TextArea />
			</Form.Item>
			<Form.Item name={"note"} label={"Ghi chú (Khác)"}
					   rules={[{required:false,message:"Vui lòng nhập ghi chú"}]}>
				<Input.TextArea />
			</Form.Item>
		</div>
	)
}