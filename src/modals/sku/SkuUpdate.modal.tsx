import {
	Button,
	Checkbox,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	InputNumber,
	Modal,
	ModalProps,
	Row,
	Select,
	Space
} from "antd";
import {supplierSelector} from "@store/supplier/supplier.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {AppDispatch} from "@store/store.ts";
import SupplierThunk from "@store/supplier/supplier.thunk.ts";
import {SupplierHelper} from "@/common/helpers/supplier.helper.tsx";
import {Label} from "@components/label/Label.tsx";
import {DateUtil} from "@utils/date.util.tsx";
import moment from "moment";
import dayjs from 'dayjs';
import SkuThunk from "@store/sku/sku.thunk.ts";
import {productSelector} from "@store/product/product.slice.ts";
import {skuSelector} from "@store/sku/sku.slice.ts";
import {SkuHelper} from "@/common/helpers/sku.helper.tsx";
import {ConfigHelper} from "@/common/helpers/configHelper.tsx";
import SettingThunk from "@store/setting/setting.thunk.ts";
import {settingSelector} from "@store/setting/setting.slice.ts";
import {NumberUtil} from "@utils/number.util.ts";

export default function SkuUpdateModal(props:ModalProps)
{
	const supplier = useSelector(supplierSelector)
	const product = useSelector(productSelector)
	const sku = useSelector(skuSelector)
	const setting = useSelector(settingSelector)
	const dispatch = useDispatch<AppDispatch>()
	const [state,setState] = useState<boolean>(false)
	useEffect(() => {
		dispatch(SupplierThunk.list())
		dispatch(SettingThunk.configUnit.getList())
		form.resetFields()
		if(sku.select)
		{
			form.setFieldsValue({
				...sku.select,
				importDate:moment(new Date(sku.select.importDate),DateUtil.dateFormat),
				supplier:sku.select.supplier?._id,
				priceUnit:sku.select.priceUnit?._id,
			})
			if (sku.select?.state)
			{
				setState(true)
			}
		}
	}, [props.open]);

	const onFinish = (values:any) => {
		dispatch(SkuThunk.update({
			...sku.select,
			...values,
			importDate:moment(values.importDate.toDate()).format(DateUtil.dateFormat),
			product:product.select?._id
		}))
		if(props.onCancel){
			props.onCancel(undefined as  any)
		}
	}
	
	const onUpdateState = (e:any) => {
		setState(e.target.checked)
		const colors = form.getFieldValue("colors")
		colors.forEach((color:any) => {
			color.sizes.forEach((size:any) => {
				size.quantity = size.quantity + size.reQuantity
			})
		})
	}


	const [form] = Form.useForm()
	return (
		<div id={"SkuCreateModal"}>
			<Modal {...props} width={1200} title={"Cập nhật SKU  #"+sku.select?.code} onOk={form.submit} okText={"Cập nhật"} cancelText={"Đóng"}>
				<Form form={form}  onFinish={onFinish}>
					<Form.Item
						label={<Label text={"Nhà cung cấp"}/>}
						name={"supplier"}
						rules={[
							{
								required:true,
								type:"string",
								message:"Vui lòng chọn nhà cung cấp"
							}
						]}
					>
						<Select
							disabled={true}
							showSearch
							placeholder={"Chọn nhà cung cấp"}
							filterOption={(input, option) =>{
								// @ts-ignore
								return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}}
							options={SupplierHelper.toOptions(supplier.list)}
						/>
					</Form.Item>
					<Row>
						<Col span={6}>
							<Form.Item
								label={<Label  minWidth={120} text={"Đơn vị nhập"} /> }
								name={"priceUnit"}

								rules={[
									{
										required:true,
										type:"string",
										min:0,
										message:"Đơn vị tiền không được để trống"
									}
								]}
							>
								<Select
									options={ConfigHelper.toConfigUnits(setting.configUnit.list)}
								/>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item
								label={<Label text={"Giá bán lẻ"} /> }
								name={"price"}
								rules={[
									{
										required:true,
										type:"number",
										min:0,
										message:"Giá bán lẻ không được để trống"
									}
								]}
							>
								<InputNumber style={{width:"90%"}}
											 formatter={value => NumberUtil.toMoney().fromNumber(value as any)}
											 parser={value => NumberUtil.toMoney().fromString(value as any).toString() as any  }
											 min={0} />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item
								label={<Label text={"Giá bán sỉ"} />}
								name={"retailPrice"}
								rules={[
									{
										required:true,
										type:"number",
										min:0,
										message:"Giá bán sỉ không được để trống"
									}
								]}
							>
								<InputNumber style={{width:"90%"}}
											 formatter={value => NumberUtil.toMoney().fromNumber(value as any)}
											 parser={value => NumberUtil.toMoney().fromString(value as any).toString() as any  }
											 min={0} />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item
								label={<Label text={"Ngày nhập"} /> }
								name={"importDate"}
								rules={[
									{
										required:true,
										type:"date",
										message:"Ngày nhập không được để trống"
									}
								]}
								initialValue={dayjs(DateUtil.getNowDateByFormat(DateUtil.dateFormat),DateUtil.dateFormat)}
							>
								<DatePicker disabled  format={DateUtil.dateFormat} style={{width:"90%"}} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={32}>
						<Col span={12}>
							<Form.Item
								label={<Label minWidth={120} text={"Nơi nhập"} />}
								name={"importAddress"}
								rules={[
									{
										required:true,
										type:"string",
										message:"Nơi nhập không được để trống"
									}
								]}
							> 
								<Select
									disabled={true}
									options={SkuHelper.toSrc()}
									placeholder={"Chọn nơi nhập"}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label={<Label padding-left={"-16px"} text={"Hàng đã về kho"} />}
								name={"state"}
								rules={[
									{
										required:true,
										type:"boolean",
										message:"Vui lòng chọn trạng thái"
									}
								]}
								valuePropName={"checked"}
								initialValue={false}
							>
								<Checkbox disabled={state} onChange={onUpdateState}  />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						label={<Label minWidth={130} text={"Ghi chú"} />}
						name={"note"}
						rules={[
							{
								required:false,
								type:"string",
							}
						]}
					>
						<Input.TextArea />
					</Form.Item>
					<Form.List name={"colors"}>
						{
							(fields, {add, remove}) => {
								return (
									<div  >
										<Button style={{marginTop:"10px",marginBottom:"10px"}} type={"primary"} onClick={() => add()}>Thêm màu</Button>
										{fields.map((field, index) => {
											return (
												<Row key={field.key}>
													<Col span={24}>
														<Space.Compact>
															<Form.Item
																label={<Label text={"Màu"} />}
																name={[field.name, "color"]}
																rules={[
																	{
																		required:true,
																		type:"string",
																		message:"Màu không được để trống"
																	}
																]}
															>
																<Input style={{width:"100%"}} />
															</Form.Item>
															<Button  type={"primary"} danger onClick={() => remove(field.name)}>Xóa</Button>
														</Space.Compact>
														<Form.Item label={<Label text={"Kích thước"} />} required={true} name={[field.name, "sizes"]}>
															<Form.List name={[field.name,"sizes"]}>
																{
																	(fields, {add, remove}) => {
																		return (
																			<div>
																				<Button type={"primary"} onClick={() => add()}>Thêm kích thước</Button>
																				{fields.map((field, index) => {
																						return (
																							<Row key={field.key} style={{marginTop:"15px"}}>
																								<Col span={22}>
																									<Row>
																										<Col span={8}>
																											<Form.Item
																												label={<Label align={"center"} minWidth={130} text={"Kích thước"} />}
																												name={[field.name, "size"]}
																												rules={[
																													{
																														required:true,
																														type:"string",
																														message:"Size không được để trống"
																													}
																												]}
																											>
																												<Input style={{width:"90%"}} />
																											</Form.Item>
																										</Col>
																										<Col span={8}>
																											<Form.Item
																												label={<Label align={"center"} minWidth={130}  text={"Trọng lượng"} />}
																												name={[field.name, "weight"]}
																												rules={[
																													{
																														required:true,
																														type:"number",
																														min:1,
																														message:"Trọng lượng không được để trống"
																													}
																												]}
																											>
																												<InputNumber style={{width:"90%"}} min={1} />
																											</Form.Item>
																										</Col>
																										<Col span={8}>
																											<Form.Item
																												label={<Label align={"center"} minWidth={130}  text={"Giá bán (Cộng thêm)"} />}
																												name={[field.name, "price"]}
																												rules={[
																													{
																														required:false,
																														type:"number",
																														min:0,
																														message:"Giá bán không được để trống"
																													}
																												]}
																											>
																												<InputNumber style={{width:"90%"}} min={0}
																															 formatter={value => NumberUtil.toMoney().fromNumber(value as any)}
																															 parser={value => NumberUtil.toMoney().fromString(value as any).toString() as any  }
																												/>
																											</Form.Item>
																										</Col>
																									</Row>
																									<Row>
																										<Col span={8}>
																											<Form.Item
																												label={<Label align={"center"} minWidth={140}  text={"Số lượng"} />}
																												name={[field.name, "quantity"]}
																												rules={[
																													{
																														required:false,
																														type:"number",
																														
																														message:"Số lượng không được để trống"
																													}
																												]}
																												initialValue={0}
																											>
																												<InputNumber disabled={state} style={{width:"90%"}}  />
																											</Form.Item>
																										</Col>
																										<Col span={8}>
																											<Form.Item
																												label={<Label align={"center"} minWidth={130}  text={"Số lượng nhập"} />}
																												name={[field.name, "reQuantity"]}
																												rules={[
																													{
																														required:true,
																														type:"number",
																														min:1,
																														message:"Số lượng nhập không được để trống"
																													}
																												]}
																											>
																												<InputNumber disabled={state} style={{width:"90%"}} min={1} />
																											</Form.Item>
																										</Col>
																										<Col span={8}>
																											<Form.Item
																												label={<Label align={"center"} minWidth={130}  text={"Giá nhập"} />}
																												name={[field.name, "importPrice"]}
																												rules={[
																													{
																														required:true,
																														type:"number",
																														min:0,
																														message:"Giá nhập không được để trống"
																													}
																												]}
																											>
																												<InputNumber
																													style={{width:"90%"}} min={0}
																													formatter={value => NumberUtil.toMoney().fromNumber(value as any)}
																													parser={value => NumberUtil.toMoney().fromString(value as any).toString() as any  }
																												/>
																											</Form.Item>
																										</Col>
																									</Row>
																								</Col>
																								<Col>
																									<Button style={{
																										marginLeft: "10px",
																										height: "90%",
																									}} type={"primary"} danger onClick={() => remove(field.name)}>Xóa</Button>
																								</Col>
																								<Divider style={{margin:"5px 0"}} />
																							</Row>
																						)
																					}
																				)}
																			</div>
																		)
																	}
																}
															</Form.List>
														</Form.Item>

													</Col>

												</Row>
											)
										})}
									</div>
								)
							}
						}
					</Form.List>
				</Form>
			</Modal>
		</div>
	)
}